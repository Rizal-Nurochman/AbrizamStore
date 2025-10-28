package dto

type SummaryResponse struct {
	TotalOmzet     int64 `json:"total_omzet"`
	TotalTransaksi int64 `json:"total_transaksi"`
}

type TopProductResponse struct {
	NamaProduk   string `json:"nama_produk"`
	TotalTerjual int64  `json:"total_terjual"`
}