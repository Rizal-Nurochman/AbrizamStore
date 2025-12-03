package user

import (
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
		passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		user.Password = string(passwordHash)
	}
	// ProfileImage logic can be added here if needed, assuming it's just a string URL for now
	if input.ProfileImage != "" {
		user.ProfileImage = input.ProfileImage
	}

	updatedUser, err := s.repository.Create(user) // Repository Create usually acts as Save/Update in GORM if ID exists
	if err != nil {
		return nil, err
	}

	return updatedUser, nil
}
