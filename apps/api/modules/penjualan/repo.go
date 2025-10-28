package penjualan

import (
	"github.com/abrizamstore/database/entities"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type repository struct {
	db *gorm.DB
}

type Repository interface {
	GetProdukForUpdate(tx *gorm.DB, produkID uint) (*entities.Produk, error)
	UpdateProduk(tx *gorm.DB, produk *entities.Produk) error
	CreatePenjualan(tx *gorm.DB, penjualan *entities.Penjualan) error
	CreateDetailPenjualan(tx *gorm.DB, detail *entities.Detail_Penjualan) error
	FindAll(limit int, offset int) ([]entities.Penjualan, int64, error)
	FindByID(ID uint) (*entities.Penjualan, error)
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) GetProdukForUpdate(tx *gorm.DB, produkID uint) (*entities.Produk, error) {
	var produk entities.Produk
	err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&produk, produkID).Error
	if err != nil {
		return nil, err
	}
	return &produk, nil
}

func (r *repository) UpdateProduk(tx *gorm.DB, produk *entities.Produk) error {
	return tx.Save(produk).Error
}

func (r *repository) CreatePenjualan(tx *gorm.DB, penjualan *entities.Penjualan) error {
	return tx.Create(penjualan).Error
}

func (r *repository) CreateDetailPenjualan(tx *gorm.DB, detail *entities.Detail_Penjualan) error {
	return tx.Create(detail).Error
}

func (r *repository) FindAll(limit int, offset int) ([]entities.Penjualan, int64, error) {
	var penjualans []entities.Penjualan
	var total int64

	query := r.db.Model(&entities.Penjualan{})
	query = query.Preload("User")
	query.Count(&total)

	err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&penjualans).Error
	if err != nil {
		return nil, 0, err
	}
	return penjualans, total, nil
}

func (r *repository) FindByID(ID uint) (*entities.Penjualan, error) {
	var penjualan entities.Penjualan
	err := r.db.
		Preload("User").                               
		Preload("DetailPenjualan").                          
		Preload("DetailPenjualan.Produk").                   
		First(&penjualan, ID).Error
	if err != nil {
		return nil, err
	}
	return &penjualan, nil
}