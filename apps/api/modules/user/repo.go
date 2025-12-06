package user

import (
	"github.com/abrizamstore/database/entities"
	"gorm.io/gorm"
)

type repository struct {
	db *gorm.DB
}

type Repository interface {
	FindByEmail(email string) (*entities.User, error)
	FindByID(ID uint) (*entities.User, error)
	Create(user *entities.User) (*entities.User, error)
	Update(user *entities.User) (*entities.User, error)
	FindByToken(token string) (*entities.User, error)
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) Create(user *entities.User) (*entities.User, error) {
	err := r.db.Create(&user).Error
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *repository) FindByEmail(email string) (*entities.User, error) {
	var existUser entities.User
	err := r.db.Where("email = ?", email).First(&existUser).Error
	if err != nil {
		return nil, err
	}

	return &existUser, nil
}

func (r *repository) FindByID(ID uint) (*entities.User, error) {
	var existUser entities.User
	err := r.db.First(&existUser, ID).Error
	if err != nil {
		return nil, err
	}

	return &existUser, nil
}

func (r *repository) Update(user *entities.User) (*entities.User, error) {
	err := r.db.Save(&user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *repository) FindByToken(token string) (*entities.User, error) {
	var user entities.User
	err := r.db.Where("reset_password_token = ?", token).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
