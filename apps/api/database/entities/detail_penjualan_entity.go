package entities

import "gorm.io/gorm"

type Detail_Penjualan struct {
	gorm.Model
	ID_Produk uint   `json:"id_produk" gorm:"index"`
	Produk    Produk `gorm:"foreignKey:ID_Produk"`

	ID_Penjualan uint      `json:"id_penjualan" gorm:"index"`
	Penjualan    Penjualan `gorm:"foreignKey:ID_Penjualan"`

	Harga_Jual int `json:"harga_jual"`
	Jumlah     int `json:"jumlah"`
	Subtotal   int `json:"subtotal"`
}
