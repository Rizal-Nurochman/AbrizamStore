package dashboard

import (
	"time"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"gorm.io/gorm"
)

type Repository interface {
	GetSummary(todayStart time.Time) (*dto.SummaryResponse, error)
	GetTopSellingProducts(limit int) (*[]dto.TopProductResponse, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetSummary(todayStart time.Time) (*dto.SummaryResponse, error) {
	var summary dto.SummaryResponse

	err := r.db.Model(&entities.Penjualan{}).
		Select("COALESCE(SUM(total_penjualan), 0) as total_omzet, COUNT(id) as total_transaksi").
		Where("created_at >= ?", todayStart).
		Scan(&summary).Error

	if err != nil {
		return nil, err
	}
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