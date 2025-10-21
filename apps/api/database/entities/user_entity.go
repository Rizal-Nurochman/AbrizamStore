package entities

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name							string
	Email							string	`gorm:"uniqueIndex"`
	Password					string
	ProfileImage			string	`gorm:"omitempty"`
}