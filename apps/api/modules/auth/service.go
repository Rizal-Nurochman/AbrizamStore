package auth

import (
	"errors"
	"os"
	"time"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/modules/user"
	"github.com/abrizamstore/package/dto"
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

	userInput := &entities.User{
		Name: user.Name,
		Email: user.Email,
		Password: string(passwordHash),
	}

	newUser, err := s.repository.Create(userInput)
	if err != nil {
		return nil, err
	}

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