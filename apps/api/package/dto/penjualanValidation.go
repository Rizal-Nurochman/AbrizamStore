package dto

type CartItem struct {
	ID_Produk uint `json:"id_produk" binding:"required"`
	Jumlah    int  `json:"jumlah" binding:"required,gt=0"`
}

type PenjualanCreate struct {
	Items []CartItem `json:"items" binding:"required,min=1,dive"`
}