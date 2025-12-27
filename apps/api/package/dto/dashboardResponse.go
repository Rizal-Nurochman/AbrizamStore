package dto

type SummaryResponse struct {
	TodayOmzet       int64 `json:"today_omzet"`
	TodayTransaksi   int64 `json:"today_transaksi"`
	WeeklyOmzet      int64 `json:"weekly_omzet"`
	WeeklyTransaksi  int64 `json:"weekly_transaksi"`
	MonthlyOmzet     int64 `json:"monthly_omzet"`
	MonthlyTransaksi int64 `json:"monthly_transaksi"`
}

type TopProductResponse struct {
	NamaProduk   string `json:"nama_produk"`
	TotalTerjual int64  `json:"total_terjual"`
}

type SalesTrendItem struct {
	Date       string `json:"date"`
	TotalOmzet int64  `json:"total_omzet"`
}
