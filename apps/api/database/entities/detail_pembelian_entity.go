package entities

type Detai_Pembelian struct {
	ID_Produk							uint			//foreignkey produk
	Produk								Produk
	ID_Pembelian					uint			//foreignkey pembelian
	Pembelian 						Pembelian

	Harga_Beli						int				`gorm:"harga_beli"`
	Jumlah								int				`gorm:"jumlah"`
	Subtotal							int				`gorm:"subtotal"`
}