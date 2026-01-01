package entities

import (
	"time"

	"gorm.io/gorm"
)

// AuthProvider constants
const (
	AuthProviderPassword = "password"
	AuthProviderGoogle   = "google"
)

type User struct {
	gorm.Model
	Name                   string    `json:"name"`
	Email                  string    `json:"email" gorm:"uniqueIndex"`
	Password               string    `json:"password"`
	Role                   string    `json:"role" binding:"omitempty,oneof=admin user"`
	ProfileImage           string    `json:"profile_image" gorm:"omitempty"`
	AuthProvider           string    `json:"auth_provider" gorm:"default:password"`
	StoreName              string    `json:"store_name" gorm:"omitempty"`
	IsVerified             bool      `json:"is_verified" gorm:"default:false"`
	VerificationCode       string    `json:"verification_code" gorm:"omitempty"`
	VerificationCodeExpiry time.Time `json:"verification_code_expiry" gorm:"omitempty"`
	ResetPasswordToken     string    `json:"reset_password_token" gorm:"omitempty"`
	ResetPasswordExpiry    time.Time `json:"reset_password_expiry" gorm:"omitempty"`

	Pembelian []Pembelian `gorm:"foreignKey:ID_User"`
	Penjualan []Penjualan `gorm:"foreignKey:ID_User"`
}
