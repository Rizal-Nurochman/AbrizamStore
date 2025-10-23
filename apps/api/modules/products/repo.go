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
	FindAll(limit int, offset int) ([]entities.Produk, int64, error)
	FindByID(ID uint) (*entities.Produk, error)
	FindByName(name string, limit int, offset int) (*[]entities.Produk, int64, error)
	Update(ID uint, produk entities.Produk) (*entities.Produk, error)
	Delete(ID uint) (error)
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

func (r *repository) FindAll(limit int, offset int) ([]entities.Produk, int64, error) {
	var produks []entities.Produk
	var total int64

	query := r.db.Model(&entities.Produk{})
	query = query.Preload("Kategori")
	query.Count(&total)

	err := query.Limit(limit).Offset(offset).Find(&produks).Error
	if err != nil {
		return nil, 0, err
	}

	return produks, total, nil
}

func (r *repository) FindByID(ID uint) (*entities.Produk, error) {
	var produk entities.Produk
	err := r.db.First(&produk, ID).Error
	if err != nil {
		return nil, err
	}

	return &produk, nil
}

func (r *repository) FindByName(name string, limit int, offset int) (*[]entities.Produk, int64, error) {
	var produks []entities.Produk
	var total int64

	query := r.db.Model(&entities.Produk{}).Where("name ILIKE ?", "%"+name+"%")
	query.Count(&total)

	err := query.Preload("Kategori").Limit(limit).Offset(offset).Find(&produks).Error
	if err != nil {
		return nil, 0, err
	}

	return &produks, total, nil
}

func (r *repository) Update(ID uint, produk entities.Produk) (*entities.Produk, error) {
	err := r.db.Save(&produk).Error
	if err != nil {
		return nil, err
	}

	return &produk, nil
}

func (r *repository) Delete(ID uint) (error) {
	err := r.db.Where("id = ?", ID).Delete(&entities.Produk{}).Error
	if err != nil {
		return err
	}

	return nil
}