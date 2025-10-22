package entities

type Detail_Penjualan struct {
	ID_Produk							uint			//foreignkey produk
	Produk 								Produk
	ID_Penjualan					uint			//foreignkey penjualan
	Penjualan							Penjualan
	
	Harga_Jual						int				`gorm:"harga_jual"`
	Jumlah								int				`gorm:"jumlah"`
	Subtotal							int				`gorm:"subtotal"`
}