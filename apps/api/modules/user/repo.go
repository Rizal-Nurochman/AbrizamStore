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
	Create(user *entities.User) (*entities.User, error)
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
	err:=r.db.Where("email = ?",email).First(&existUser).Error
	if err != nil {
		return nil, err
	}

	return &existUser, nil
}