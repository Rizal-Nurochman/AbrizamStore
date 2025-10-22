package entities

import "gorm.io/gorm"

type Penjualan struct {
	gorm.Model
	Total_Penjualan int `json:"total_penjualan"`

	ID_User *uint `json:"id_user"`
	User    User  `gorm:"foreignKey:ID_User"`

	DetailPenjualan []Detail_Penjualan `gorm:"foreignKey:ID_Penjualan"`
}