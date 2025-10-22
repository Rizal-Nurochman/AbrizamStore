package entities

import "gorm.io/gorm"

type Produk struct {
	gorm.Model
	Nama_Produk string `json:"nama_produk"`
	Harga_Beli  int    `json:"harga_beli"`
	Harga_Jual  int    `json:"harga_jual"`
	Stok        int    `json:"stok"`

	ID_Kategori *uint     `json:"id_kategori"`
	Kategori    Kategori  `gorm:"foreignKey:ID_Kategori"`

	DetailPembelian []Detail_Pembelian `gorm:"foreignKey:ID_Produk"`
	DetailPenjualan []Detail_Penjualan `gorm:"foreignKey:ID_Produk"`
}