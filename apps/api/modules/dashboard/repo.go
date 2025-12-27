package dashboard

import (
	"time"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"gorm.io/gorm"
)

type Repository interface {
	GetSummary(todayStart, weekStart, monthStart time.Time) (*dto.SummaryResponse, error)
	GetTopSellingProducts(limit int) (*[]dto.TopProductResponse, error)
	GetSalesTrend(days int) (*[]dto.SalesTrendItem, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetSummary(todayStart, weekStart, monthStart time.Time) (*dto.SummaryResponse, error) {
	var summary dto.SummaryResponse

	// Today's data
	var todayData struct {
		TotalOmzet     int64
		TotalTransaksi int64
	}
	err := r.db.Model(&entities.Penjualan{}).
		Select("COALESCE(SUM(total_penjualan), 0) as total_omzet, COUNT(id) as total_transaksi").
		Where("created_at >= ?", todayStart).
		Scan(&todayData).Error
	if err != nil {
		return nil, err
	}
	summary.TodayOmzet = todayData.TotalOmzet
	summary.TodayTransaksi = todayData.TotalTransaksi

	// Weekly data
	var weeklyData struct {
		TotalOmzet     int64
		TotalTransaksi int64
	}
	err = r.db.Model(&entities.Penjualan{}).
		Select("COALESCE(SUM(total_penjualan), 0) as total_omzet, COUNT(id) as total_transaksi").
		Where("created_at >= ?", weekStart).
		Scan(&weeklyData).Error
	if err != nil {
		return nil, err
	}
	summary.WeeklyOmzet = weeklyData.TotalOmzet
	summary.WeeklyTransaksi = weeklyData.TotalTransaksi

	// Monthly data
	var monthlyData struct {
		TotalOmzet     int64
		TotalTransaksi int64
	}
	err = r.db.Model(&entities.Penjualan{}).
		Select("COALESCE(SUM(total_penjualan), 0) as total_omzet, COUNT(id) as total_transaksi").
		Where("created_at >= ?", monthStart).
		Scan(&monthlyData).Error
	if err != nil {
		return nil, err
	}
	summary.MonthlyOmzet = monthlyData.TotalOmzet
	summary.MonthlyTransaksi = monthlyData.TotalTransaksi

	return &summary, nil
}

func (r *repository) GetTopSellingProducts(limit int) (*[]dto.TopProductResponse, error) {
	var topProducts []dto.TopProductResponse

	err := r.db.Model(&entities.Detail_Penjualan{}).
		Select("p.nama_produk, SUM(detail_penjualans.jumlah) as total_terjual").
		Joins("left join produks p on p.id = detail_penjualans.id_produk").
		Group("p.nama_produk").
		Order("total_terjual desc").
		Limit(limit).
		Scan(&topProducts).Error

	if err != nil {
		return nil, err
	}
	return &topProducts, nil
}

func (r *repository) GetSalesTrend(days int) (*[]dto.SalesTrendItem, error) {
	var trend []dto.SalesTrendItem

	err := r.db.Model(&entities.Penjualan{}).
		Select("DATE(created_at) as date, COALESCE(SUM(total_penjualan), 0) as total_omzet").
		Where("created_at >= ?", time.Now().AddDate(0, 0, -days)).
		Group("DATE(created_at)").
		Order("date ASC").
		Scan(&trend).Error

	if err != nil {
		return nil, err
	}
	return &trend, nil
}
