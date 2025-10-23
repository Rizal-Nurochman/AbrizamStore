package dto

type ProdukCreate struct {
	Nama_Produk		string		`json:"nama_produk" binding:"required"`
	Harga_Beli		int		`json:"harga_beli" binding:"required,gt=0"`
	Harga_Jual		int		`json:"harga_jual" binding:"required,gt=0"`
	Stok					int				`json:"stok" binding:"required,gte=0"`
	ID_Kategori		*uint			`json:"kategori_id"`
}