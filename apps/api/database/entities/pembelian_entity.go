package entities

import "gorm.io/gorm"

type Pembelian struct {
	gorm.Model
	Total_Pembelian		int					`gorm:"total_pembelian"`

	ID_User						*uint				//foreignkey user
	Produk						[]Produk		`gorm:"many2many:detail_pembelian;"`
}