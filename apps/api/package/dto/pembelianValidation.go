package dto

type RestockItem struct {
	ID_Produk  uint `json:"id_produk" binding:"required"`
	Jumlah     int  `json:"jumlah" binding:"required,gt=0"`
	Harga_Beli int  `json:"harga_beli" binding:"required,gt=0"`
}

type PembelianCreate struct {
	Items []RestockItem `json:"items" binding:"required,min=1,dive"`
}