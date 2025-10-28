package pembelian

import (
	"github.com/abrizamstore/database/entities"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository interface {
	GetProdukForUpdate(tx *gorm.DB, produkID uint) (*entities.Produk, error)
	UpdateProduk(tx *gorm.DB, produk *entities.Produk) error
	CreatePembelian(tx *gorm.DB, pembelian *entities.Pembelian) error
	CreateDetailPembelian(tx *gorm.DB, detail *entities.Detail_Pembelian) error
	FindAll(limit int, offset int) ([]entities.Pembelian, int64, error)
	FindByID(ID uint) (*entities.Pembelian, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
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

func (r *repository) CreatePembelian(tx *gorm.DB, pembelian *entities.Pembelian) error {
	return tx.Create(pembelian).Error
}

func (r *repository) CreateDetailPembelian(tx *gorm.DB, detail *entities.Detail_Pembelian) error {
	return tx.Create(detail).Error
}

func (r *repository) FindAll(limit int, offset int) ([]entities.Pembelian, int64, error) {
	var pembelians []entities.Pembelian
	var total int64

	query := r.db.Model(&entities.Pembelian{})
	query = query.Preload("User")
	query.Count(&total)

	err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&pembelians).Error
	if err != nil {
		return nil, 0, err
	}
	return pembelians, total, nil
}

func (r *repository) FindByID(ID uint) (*entities.Pembelian, error) {
	var pembelian entities.Pembelian
	err := r.db.
		Preload("User").
		Preload("DetailPembelian").
		Preload("DetailPembelian.Produk").
		First(&pembelian, ID).Error
	if err != nil {
		return nil, err
	}
	return &pembelian, nil
}