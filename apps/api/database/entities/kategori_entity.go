package entities

import "gorm.io/gorm"

type Kategori struct {
	gorm.Model
	Nama_Kategori string  `json:"nama_kategori"`
	Produk        []Produk `gorm:"foreignKey:ID_Kategori;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}