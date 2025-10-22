package entities

import "gorm.io/gorm"

type Produk struct {
	gorm.Model
	Nama_Produk					string						`gorm:"nama_produk"`
	ID_Kategori					*uint							//ForeignKey kategori
	Kategori						Kategori
	Harga_Beli					int 							`gorm:"harga_beli"`
	Harga_Jual					int								`gorm:"harga_jual"`
	Stok								int								`gorm:"stok"`

	DetailPembelian			[]Detai_Pembelian		`gorm:"foreignkey:ID_Produk"`
	DetailPenjualan 		[]Detail_Penjualan	`gorm:"foreignkey:ID_Produk"`
}