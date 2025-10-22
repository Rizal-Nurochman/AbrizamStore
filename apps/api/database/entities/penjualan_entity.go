package entities

import "gorm.io/gorm"

type Penjualan struct {
	gorm.Model
	Total_Penjualan							int									`gorm:"total_penjualan"`

	ID_User											*uint								//foreignkey User
	DetailPenjualan 						[]Detail_Penjualan	`gorm:"foreignkey:ID_Penjualan"`
}