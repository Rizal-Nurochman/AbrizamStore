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
	"gorm.io/gorm"
)

type service struct {
	repository user.Repository
}

type Service interface {
	Register(input dto.UserRegister) (*entities.User, error)
	Login(input dto.UserLogin) (*entities.User, string, error)
	Logout() (string, error)
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
		// Return nil to avoid enumerating users, or return error if strict
		// For security, best practice is to say "If email exists, code sent"
		// But for this stage, I'll return error if DB fails, or nil if not found (silent) or specific error.
		// The repo returns error if not found? Let's check repo.
		// Repo uses first(), returns error if not found.
		return errors.New("email tidak ditemukan")
	}

	code := utils.GenerateVerificationCode()
	user.ResetPasswordToken = code
	user.ResetPasswordExpiry = time.Now().Add(15 * time.Minute) // 15 minutes expiry

	_, err = s.repository.Update(user)
	if err != nil {
		return err
	}

	// Send Email
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
	user.ResetPasswordExpiry = time.Time{} // Clear expiry

	_, err = s.repository.Update(user)
	if err != nil {
		return err
	}

	return nil
}
