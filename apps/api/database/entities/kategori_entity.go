package entities

import "gorm.io/gorm"

type Kategori struct {
	gorm.Model
	Produk						[]Produk				`gorm:"foreignkey:ID_Kategori"`
	Nama_Kategori			string					`gorm:"nama_kategori"`
}