package products

import (
	"github.com/abrizamstore/database/entities"
	"gorm.io/gorm"
)

type repository struct {
	db *gorm.DB
}

type Repository interface {
	Create(produk *entities.Produk) error
	FindAll(limit int, offset int, userID uint) ([]entities.Produk, int64, error)
	FindAllWithFilter(limit int, offset int, kategoriId *uint, userID uint) ([]entities.Produk, int64, error)
	FindByID(ID uint, userID uint) (*entities.Produk, error)
	FindByName(name string, limit int, offset int, userID uint) (*[]entities.Produk, int64, error)
	FindLowStock(stokThreshold int, userID uint) ([]entities.Produk, int64, error)
	Update(ID uint, produk entities.Produk, userID uint) (*entities.Produk, error)
	Delete(ID uint, userID uint) error
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(produk *entities.Produk) error {
	err := r.db.Create(produk).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *repository) FindAll(limit int, offset int, userID uint) ([]entities.Produk, int64, error) {
	var produks []entities.Produk
	var total int64

	query := r.db.Model(&entities.Produk{}).Where("id_user = ?", userID)
	query = query.Preload("Kategori")
	query.Count(&total)

	err := query.Limit(limit).Offset(offset).Find(&produks).Error
	if err != nil {
		return nil, 0, err
	}

	return produks, total, nil
}

func (r *repository) FindAllWithFilter(limit int, offset int, kategoriId *uint, userID uint) ([]entities.Produk, int64, error) {
	var produks []entities.Produk
	var total int64

	query := r.db.Model(&entities.Produk{}).Where("id_user = ?", userID)
	query = query.Preload("Kategori")

	// Filter by category if provided
	if kategoriId != nil {
		query = query.Where("id_kategori = ?", *kategoriId)
	}

	query.Count(&total)

	err := query.Limit(limit).Offset(offset).Find(&produks).Error
	if err != nil {
		return nil, 0, err
	}

	return produks, total, nil
}

func (r *repository) FindByID(ID uint, userID uint) (*entities.Produk, error) {
	var produk entities.Produk
	err := r.db.Preload("Kategori").Where("id_user = ?", userID).First(&produk, ID).Error
	if err != nil {
		return nil, err
	}

	return &produk, nil
}

func (r *repository) FindByName(name string, limit int, offset int, userID uint) (*[]entities.Produk, int64, error) {
	var produks []entities.Produk
	var total int64

	query := r.db.Model(&entities.Produk{}).Where("id_user = ? AND nama_produk ILIKE ?", userID, "%"+name+"%")
	query.Count(&total)

	err := query.Preload("Kategori").Limit(limit).Offset(offset).Find(&produks).Error
	if err != nil {
		return nil, 0, err
	}

	return &produks, total, nil
}

func (r *repository) Update(ID uint, produk entities.Produk, userID uint) (*entities.Produk, error) {
	err := r.db.Model(&entities.Produk{}).Where("id = ? AND id_user = ?", ID, userID).Updates(produk).Error
	if err != nil {
		return nil, err
	}
	return &produk, nil
}

func (r *repository) Delete(ID uint, userID uint) error {
	err := r.db.Where("id = ? AND id_user = ?", ID, userID).Delete(&entities.Produk{}).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *repository) FindLowStock(stokThreshold int, userID uint) ([]entities.Produk, int64, error) {
	var produks []entities.Produk
	var total int64

	query := r.db.Model(&entities.Produk{}).
		Preload("Kategori").
		Where("id_user = ? AND stok <= ?", userID, stokThreshold)

	query.Count(&total)

	err := query.Order("stok asc").Find(&produks).Error
	if err != nil {
		return nil, 0, err
	}

	return produks, total, nil
}
