package user

import (
	"fmt"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"golang.org/x/crypto/bcrypt"
)

type service struct {
	repository Repository
}

type Service interface {
	GetProfile(userID uint) (*entities.User, error)
	UpdateProfile(userID uint, input dto.UserUpdate) (*entities.User, error)
}

func NewService(repository Repository) Service {
	return &service{repository}
}

func (s *service) GetProfile(userID uint) (*entities.User, error) {
	user, err := s.repository.FindByID(userID)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *service) UpdateProfile(userID uint, input dto.UserUpdate) (*entities.User, error) {
	user, err := s.repository.FindByID(userID)
	if err != nil {
		return nil, err
	}

	if input.Nama != "" {
		user.Name = input.Nama
	}
	if input.Email != "" {
		user.Email = input.Email
	}
	if input.Password != "" {
		// Block password change for Google users
		if user.AuthProvider == entities.AuthProviderGoogle {
			return nil, fmt.Errorf("user yang login dengan Google tidak dapat mengubah password")
		}
		passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		user.Password = string(passwordHash)
	}
	if input.ProfileImage != "" {
		user.ProfileImage = input.ProfileImage
	}
	if input.StoreName != "" {
		user.StoreName = input.StoreName
	}

	updatedUser, err := s.repository.Update(user)
	if err != nil {
		return nil, err
	}

	return updatedUser, nil
}
