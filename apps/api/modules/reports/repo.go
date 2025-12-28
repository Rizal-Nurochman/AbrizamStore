package reports

import (
	"time"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"gorm.io/gorm"
)

type Repository interface {
	GetSalesReport(startDate, endDate time.Time, userID uint) (*dto.SalesReportResponse, error)
	GetProfitLossReport(startDate, endDate time.Time, userID uint) (*dto.ProfitLossResponse, error)
	GetStockReport(userID uint) (*dto.StockReportResponse, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetSalesReport(startDate, endDate time.Time, userID uint) (*dto.SalesReportResponse, error) {
	var items []dto.SalesReportItem

	// Get daily sales summary - filter by user's penjualan
	err := r.db.Model(&entities.Penjualan{}).
		Select("id, created_at as tanggal, total_penjualan, (SELECT COUNT(*) FROM detail_penjualans WHERE detail_penjualans.id_penjualan = penjualans.id) as jumlah_item").
		Where("id_user = ? AND created_at >= ? AND created_at <= ?", userID, startDate, endDate).
		Order("created_at DESC").
		Scan(&items).Error
	if err != nil {
		return nil, err
	}

	// Calculate totals
	var totalOmzet int64
	var totalTransaksi int64
	dailyTotals := make(map[string]int64)

	for _, item := range items {
		totalOmzet += int64(item.TotalPenjualan)
		totalTransaksi++
		dateKey := item.Tanggal.Format("2006-01-02")
		dailyTotals[dateKey] += int64(item.TotalPenjualan)
	}

	// Find best day
	var hariTerbaik string
	var omzetTerbaik int64
	for date, omzet := range dailyTotals {
		if omzet > omzetTerbaik {
			omzetTerbaik = omzet
			hariTerbaik = date
		}
	}

	// Calculate daily average
	days := endDate.Sub(startDate).Hours() / 24
	if days < 1 {
		days = 1
	}
	rataRataHarian := totalOmzet / int64(days)

	return &dto.SalesReportResponse{
		Items:          items,
		TotalOmzet:     totalOmzet,
		TotalTransaksi: totalTransaksi,
		RataRataHarian: rataRataHarian,
		HariTerbaik:    hariTerbaik,
		OmzetTerbaik:   omzetTerbaik,
	}, nil
}

func (r *repository) GetProfitLossReport(startDate, endDate time.Time, userID uint) (*dto.ProfitLossResponse, error) {
	var items []dto.ProfitLossItem

	// Get profit per product - filter by user's products
	err := r.db.Model(&entities.Detail_Penjualan{}).
		Select(`
			p.nama_produk,
			SUM(detail_penjualans.jumlah) as jumlah_terjual,
			p.harga_beli,
			detail_penjualans.harga_jual,
			SUM(detail_penjualans.jumlah * p.harga_beli) as total_modal,
			SUM(detail_penjualans.subtotal) as total_penjualan,
			SUM(detail_penjualans.subtotal) - SUM(detail_penjualans.jumlah * p.harga_beli) as laba
		`).
		Joins("LEFT JOIN produks p ON p.id = detail_penjualans.id_produk").
		Joins("LEFT JOIN penjualans pj ON pj.id = detail_penjualans.id_penjualan").
		Where("pj.id_user = ? AND pj.created_at >= ? AND pj.created_at <= ?", userID, startDate, endDate).
		Group("p.id, p.nama_produk, p.harga_beli, detail_penjualans.harga_jual").
		Order("laba DESC").
		Scan(&items).Error
	if err != nil {
		return nil, err
	}

	// Calculate totals
	var totalModal, totalPenjualan, totalLaba int64
	var produkPalingUntung string
	var labaTertinggi int64

	for i, item := range items {
		totalModal += int64(item.TotalModal)
		totalPenjualan += int64(item.TotalPenjualan)
		totalLaba += int64(item.Laba)
		if i == 0 {
			produkPalingUntung = item.NamaProduk
			labaTertinggi = int64(item.Laba)
		}
	}

	marginRataRata := float64(0)
	if totalModal > 0 {
		marginRataRata = (float64(totalLaba) / float64(totalModal)) * 100
	}

	return &dto.ProfitLossResponse{
		Items:              items,
		TotalModal:         totalModal,
		TotalPenjualan:     totalPenjualan,
		TotalLaba:          totalLaba,
		MarginRataRata:     marginRataRata,
		ProdukPalingUntung: produkPalingUntung,
		LabaTertinggi:      labaTertinggi,
	}, nil
}

func (r *repository) GetStockReport(userID uint) (*dto.StockReportResponse, error) {
	var items []dto.StockReportItem

	// Filter by user's products
	err := r.db.Model(&entities.Produk{}).
		Select(`
			produks.id,
			produks.nama_produk,
			produks.stok,
			produks.harga_beli,
			produks.harga_jual,
			(produks.stok * produks.harga_beli) as nilai_modal,
			(produks.stok * produks.harga_jual) as nilai_jual,
			(produks.stok * produks.harga_jual) - (produks.stok * produks.harga_beli) as potensial_laba,
			COALESCE(k.nama_kategori, 'Tanpa Kategori') as kategori,
			CASE 
				WHEN produks.stok = 0 THEN 'habis'
				WHEN produks.stok <= 10 THEN 'menipis'
				ELSE 'aman'
			END as status
		`).
		Joins("LEFT JOIN kategoris k ON k.id = produks.id_kategori").
		Where("produks.id_user = ?", userID).
		Order("produks.stok ASC").
		Scan(&items).Error
	if err != nil {
		return nil, err
	}

	// Calculate totals
	var totalProduk, totalStok, totalNilaiModal, totalNilaiJual, totalPotensialLaba int64
	var produkHampirHabis, produkHabis int64

	for _, item := range items {
		totalProduk++
		totalStok += int64(item.Stok)
		totalNilaiModal += int64(item.NilaiModal)
		totalNilaiJual += int64(item.NilaiJual)
		totalPotensialLaba += int64(item.PotensialLaba)
		if item.Status == "menipis" {
			produkHampirHabis++
		} else if item.Status == "habis" {
			produkHabis++
		}
	}

	return &dto.StockReportResponse{
		Items:              items,
		TotalProduk:        totalProduk,
		TotalStok:          totalStok,
		TotalNilaiModal:    totalNilaiModal,
		TotalNilaiJual:     totalNilaiJual,
		TotalPotensialLaba: totalPotensialLaba,
		ProdukHampirHabis:  produkHampirHabis,
		ProdukHabis:        produkHabis,
	}, nil
}
