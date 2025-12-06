package auth

import (
	"errors"
	"os"
	"time"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/modules/user"
	"github.com/abrizamstore/package/dto"
	"github.com/abrizamstore/package/utils"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/oauth2/v2"
	"gorm.io/gorm"
)

type service struct {
	repository user.Repository
}

type Service interface {
	Register(input dto.UserRegister) (*entities.User, error)
	Login(input dto.UserLogin) (*entities.User, string, error)
	Logout() (string, error)
	LoginOrRegisterWithGoogle(googleUserInfo *oauth2.Userinfo) (*entities.User, string, error)
	VerifyEmail(email string, code string) error
	ForgotPassword(input dto.ForgotPasswordInput) error
	ResetPassword(input dto.ResetPasswordInput) error
}

func NewService(repository user.Repository) Service {
	return &service{repository}
}

func (s *service) generateTokenJWT(userID uint) (string, error) {
	claims := jwt.MapClaims{}
	claims["user_id"] = userID
	claims["exp"] = time.Now().Add(time.Hour * 12).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}
	return signedToken, nil
}

func (s *service) Register(user dto.UserRegister) (*entities.User, error) {
	findUser, err := s.repository.FindByEmail(user.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	if findUser != nil {
		return nil, errors.New("email sudah terdaftar")
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	verificationCode := utils.GenerateVerificationCode()

	userInput := &entities.User{
		Name:             user.Name,
		Email:            user.Email,
		Password:         string(passwordHash),
		Role:             "user",
		VerificationCode: verificationCode,
	}

	newUser, err := s.repository.Create(userInput)
	if err != nil {
		return nil, err
	}

	go utils.SendEmail(newUser.Email, "Verifikasi Email", "Kode verifikasi Anda: "+verificationCode)

	return newUser, err
}

func (s *service) Login(input dto.UserLogin) (*entities.User, string, error) {
	findUser, err := s.repository.FindByEmail(input.Email)
	if err != nil {
		return nil, "", err
	}

	if findUser == nil {
		return nil, "", errors.New("email atau password salah")
	}

	err = bcrypt.CompareHashAndPassword([]byte(findUser.Password), []byte(input.Password))
	if err != nil {
		return nil, "", errors.New("email atau password salah")
	}

	token, err := s.generateTokenJWT(findUser.ID)
	if err != nil {
		return nil, "", err
	}

	return findUser, token, nil
}

func (s *service) Logout() (string, error) {
	expiredToken := ""
	return expiredToken, nil
}

func (s *service) VerifyEmail(email string, code string) error {
	user, err := s.repository.FindByEmail(email)
	if err != nil {
		return err
	}

	if user.VerificationCode != code {
		return errors.New("kode verifikasi salah")
	}

	user.IsVerified = true
	user.VerificationCode = ""
	_, err = s.repository.Create(user)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) ForgotPassword(input dto.ForgotPasswordInput) error {
	user, err := s.repository.FindByEmail(input.Email)
	if err != nil {
		return errors.New("email tidak ditemukan")
	}

	code := utils.GenerateVerificationCode()
	user.ResetPasswordToken = code
	user.ResetPasswordExpiry = time.Now().Add(15 * time.Minute)

	_, err = s.repository.Update(user)
	if err != nil {
		return err
	}

	go utils.SendEmail(user.Email, "Reset Password", "Kode reset password Anda: "+code)

	return nil
}

func (s *service) ResetPassword(input dto.ResetPasswordInput) error {
	user, err := s.repository.FindByToken(input.Token)
	if err != nil {
		return errors.New("token invalid atau kadaluarsa")
	}

	if time.Now().After(user.ResetPasswordExpiry) {
		return errors.New("token kadaluarsa")
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(passwordHash)
	user.ResetPasswordToken = ""
	user.ResetPasswordExpiry = time.Time{}

	_, err = s.repository.Update(user)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) LoginOrRegisterWithGoogle(googleUserInfo *oauth2.Userinfo) (*entities.User, string, error) {
	user, err := s.repository.FindByEmail(googleUserInfo.Email)
	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		newUser := &entities.User{
			Name:     googleUserInfo.Name,
			Email:    googleUserInfo.Email,
			Password: "",
		}
		createdUser, err := s.repository.Create(newUser)
		if err != nil {
			return nil, "", err
		}
		user = createdUser
	} else if err != nil {
		return nil, "", err
	}
	token, err := s.generateTokenJWT(user.ID)
	if err != nil {
		return nil, "", err
	}
	return user, token, nil
}