package dto

type KategoriCreate struct {
    Nama_Kategori string `json:"nama_kategori" binding:"required"`
}
type KategoriUpdate struct {
    Nama_Kategori string `json:"nama_kategori" binding:"omitempty"`
}