package dashboard

import (
	"time"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"gorm.io/gorm"
)

type Repository interface {
	GetSummary(todayStart, weekStart, monthStart time.Time, userID uint) (*dto.SummaryResponse, error)
	GetTopSellingProducts(limit int, userID uint) (*[]dto.TopProductResponse, error)
	GetSalesTrend(days int, userID uint) (*[]dto.SalesTrendItem, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetSummary(todayStart, weekStart, monthStart time.Time, userID uint) (*dto.SummaryResponse, error) {
	var summary dto.SummaryResponse

	// Today's data - filter by user
	var todayData struct {
		TotalOmzet     int64
		TotalTransaksi int64
	}
	err := r.db.Model(&entities.Penjualan{}).
		Select("COALESCE(SUM(total_penjualan), 0) as total_omzet, COUNT(id) as total_transaksi").
		Where("id_user = ? AND created_at >= ?", userID, todayStart).
		Scan(&todayData).Error
	if err != nil {
		return nil, err
	}
	summary.TodayOmzet = todayData.TotalOmzet
	summary.TodayTransaksi = todayData.TotalTransaksi

	// Weekly data - filter by user
	var weeklyData struct {
		TotalOmzet     int64
		TotalTransaksi int64
	}
	err = r.db.Model(&entities.Penjualan{}).
		Select("COALESCE(SUM(total_penjualan), 0) as total_omzet, COUNT(id) as total_transaksi").
		Where("id_user = ? AND created_at >= ?", userID, weekStart).
		Scan(&weeklyData).Error
	if err != nil {
		return nil, err
	}
	summary.WeeklyOmzet = weeklyData.TotalOmzet
	summary.WeeklyTransaksi = weeklyData.TotalTransaksi

	// Monthly data - filter by user
	var monthlyData struct {
		TotalOmzet     int64
		TotalTransaksi int64
	}
	err = r.db.Model(&entities.Penjualan{}).
		Select("COALESCE(SUM(total_penjualan), 0) as total_omzet, COUNT(id) as total_transaksi").
		Where("id_user = ? AND created_at >= ?", userID, monthStart).
		Scan(&monthlyData).Error
	if err != nil {
		return nil, err
	}
	summary.MonthlyOmzet = monthlyData.TotalOmzet
	summary.MonthlyTransaksi = monthlyData.TotalTransaksi

	return &summary, nil
}

func (r *repository) GetTopSellingProducts(limit int, userID uint) (*[]dto.TopProductResponse, error) {
	var topProducts []dto.TopProductResponse

	// Filter by user's products via penjualan
	err := r.db.Model(&entities.Detail_Penjualan{}).
		Select("p.nama_produk, SUM(detail_penjualans.jumlah) as total_terjual").
		Joins("LEFT JOIN produks p ON p.id = detail_penjualans.id_produk").
		Joins("LEFT JOIN penjualans pj ON pj.id = detail_penjualans.id_penjualan").
		Where("pj.id_user = ?", userID).
		Group("p.nama_produk").
		Order("total_terjual desc").
		Limit(limit).
		Scan(&topProducts).Error

	if err != nil {
		return nil, err
	}
	return &topProducts, nil
}

func (r *repository) GetSalesTrend(days int, userID uint) (*[]dto.SalesTrendItem, error) {
	var trend []dto.SalesTrendItem

	// Filter by user
	err := r.db.Model(&entities.Penjualan{}).
		Select("DATE(created_at) as date, COALESCE(SUM(total_penjualan), 0) as total_omzet").
		Where("id_user = ? AND created_at >= ?", userID, time.Now().AddDate(0, 0, -days)).
		Group("DATE(created_at)").
		Order("date ASC").
		Scan(&trend).Error

	if err != nil {
		return nil, err
	}
	return &trend, nil
}
