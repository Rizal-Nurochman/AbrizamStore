package entities

import "gorm.io/gorm"

type Pembelian struct {
	gorm.Model
	Total_Pembelian				int			`gorm:"total_pembelian"`
}