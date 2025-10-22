package entities

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name         string `json:"name"`
	Email        string `json:"email" gorm:"uniqueIndex"`
	Password     string `json:"password"`
	ProfileImage string `json:"profile_image" gorm:"omitempty"`

	Pembelian []Pembelian `gorm:"foreignKey:ID_User"`
	Penjualan []Penjualan `gorm:"foreignKey:ID_User"`
}