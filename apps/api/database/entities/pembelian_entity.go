package entities

import "gorm.io/gorm"

type Pembelian struct {
	gorm.Model
	Total_Pembelian int `json:"total_pembelian"`

	ID_User *uint `json:"id_user"`
	User    User  `gorm:"foreignKey:ID_User"`

	DetailPembelian []Detail_Pembelian `gorm:"foreignKey:ID_Pembelian"`
}