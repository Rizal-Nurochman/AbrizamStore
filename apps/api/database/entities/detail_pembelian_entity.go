package entities

import "gorm.io/gorm"

type Detail_Pembelian struct {
	gorm.Model
	ID_Produk    uint `json:"id_produk"`
	Produk       Produk `gorm:"foreignKey:ID_Produk"`

	ID_Pembelian uint `json:"id_pembelian"`
	Pembelian    Pembelian `gorm:"foreignKey:ID_Pembelian"`

	Harga_Beli int `json:"harga_beli"`
	Jumlah     int `json:"jumlah"`
	Subtotal   int `json:"subtotal"`
}