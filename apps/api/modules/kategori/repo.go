// File: modules/kategori/repo.go
package kategori

import (
	"github.com/abrizamstore/database/entities"
	"gorm.io/gorm"
)

type repository struct {
	db *gorm.DB
}

type Repository interface {
	Create(kategori *entities.Kategori) error
	FindAll(limit int, offset int) ([]entities.Kategori, int64, error)
	FindByID(ID uint) (*entities.Kategori, error)
	Update(ID uint, kategori entities.Kategori) (*entities.Kategori, error)
	Delete(ID uint) error
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(kategori *entities.Kategori) error {
	err := r.db.Create(kategori).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *repository) FindAll(limit int, offset int) ([]entities.Kategori, int64, error) {
	var kategoris []entities.Kategori
	var total int64

	query := r.db.Model(&entities.Kategori{})
	// Mengikuti pola products/repo.go, kita preload relasi "has many"
	// Hati-hati jika 1 kategori punya ribuan produk, ini bisa lambat
	query = query.Preload("Produk") 
	query.Count(&total)

	err := query.Limit(limit).Offset(offset).Find(&kategoris).Error
	if err != nil {
		return nil, 0, err
	}

	return kategoris, total, nil
}

func (r *repository) FindByID(ID uint) (*entities.Kategori, error) {
	var kategori entities.Kategori
	// Preload produk-produk yang termasuk dalam kategori ini
	err := r.db.Preload("Produk").First(&kategori, ID).Error
	if err != nil {
		return nil, err
	}
	return &kategori, nil
}

func (r *repository) Update(ID uint, kategori entities.Kategori) (*entities.Kategori, error) {
	err := r.db.Model(&entities.Kategori{}).Where("id = ?", ID).Updates(kategori).Error
	if err != nil {
		return nil, err
	}
	return &kategori, nil
}

func (r *repository) Delete(ID uint) error {
	err := r.db.Where("id = ?", ID).Delete(&entities.Kategori{}).Error
	if err != nil {
		return err
	}
	return nil
}