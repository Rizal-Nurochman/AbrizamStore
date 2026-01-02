package dto

import "time"

// Sales Report
type SalesReportRequest struct {
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

// Detail item for each product in a sale
type SalesDetailItem struct {
	NamaProduk string `json:"nama_produk"`
	Jumlah     int    `json:"jumlah"`
	HargaJual  int    `json:"harga_jual"`
	Subtotal   int    `json:"subtotal"`
}

type SalesReportItem struct {
	ID             uint              `json:"id"`
	Tanggal        time.Time         `json:"tanggal"`
	TotalPenjualan int               `json:"total_penjualan"`
	JumlahItem     int               `json:"jumlah_item"`
	Details        []SalesDetailItem `json:"details"`
}

type SalesReportResponse struct {
	Items          []SalesReportItem `json:"items"`
	TotalOmzet     int64             `json:"total_omzet"`
	TotalTransaksi int64             `json:"total_transaksi"`
	RataRataHarian int64             `json:"rata_rata_harian"`
	HariTerbaik    string            `json:"hari_terbaik"`
	OmzetTerbaik   int64             `json:"omzet_terbaik"`
}

// Profit Loss Report
type ProfitLossItem struct {
	NamaProduk     string `json:"nama_produk"`
	JumlahTerjual  int    `json:"jumlah_terjual"`
	HargaBeli      int    `json:"harga_beli"`
	HargaJual      int    `json:"harga_jual"`
	TotalModal     int    `json:"total_modal"`
	TotalPenjualan int    `json:"total_penjualan"`
	Laba           int    `json:"laba"`
}

type ProfitLossResponse struct {
	Items              []ProfitLossItem `json:"items"`
	TotalModal         int64            `json:"total_modal"`
	TotalPenjualan     int64            `json:"total_penjualan"`
	TotalLaba          int64            `json:"total_laba"`
	MarginRataRata     float64          `json:"margin_rata_rata"`
	ProdukPalingUntung string           `json:"produk_paling_untung"`
	LabaTertinggi      int64            `json:"laba_tertinggi"`
}

// Stock Report
type StockReportItem struct {
	ID            uint   `json:"id"`
	NamaProduk    string `json:"nama_produk"`
	Stok          int    `json:"stok"`
	HargaBeli     int    `json:"harga_beli"`
	HargaJual     int    `json:"harga_jual"`
	NilaiModal    int    `json:"nilai_modal"`    // stok * harga_beli
	NilaiJual     int    `json:"nilai_jual"`     // stok * harga_jual
	PotensialLaba int    `json:"potensial_laba"` // nilai_jual - nilai_modal
	Kategori      string `json:"kategori"`
	Status        string `json:"status"` // "aman", "menipis", "habis"
}

type StockReportResponse struct {
	Items              []StockReportItem `json:"items"`
	TotalProduk        int64             `json:"total_produk"`
	TotalStok          int64             `json:"total_stok"`
	TotalNilaiModal    int64             `json:"total_nilai_modal"`
	TotalNilaiJual     int64             `json:"total_nilai_jual"`
	TotalPotensialLaba int64             `json:"total_potensial_laba"`
	ProdukHampirHabis  int64             `json:"produk_hampir_habis"`
	ProdukHabis        int64             `json:"produk_habis"`
}
