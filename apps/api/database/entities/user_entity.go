package entities

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name             string `json:"name"`
	Email            string `json:"email" gorm:"uniqueIndex"`
	Password         string `json:"password"`
	Role             string `json:"role" binding:"omitempty,oneof=admin user"`
	ProfileImage     string `json:"profile_image" gorm:"omitempty"`
	IsVerified       bool   `json:"is_verified" gorm:"default:false"`
	VerificationCode string `json:"verification_code" gorm:"omitempty"`

	Pembelian []Pembelian `gorm:"foreignKey:ID_User"`
	Penjualan []Penjualan `gorm:"foreignKey:ID_User"`
}
