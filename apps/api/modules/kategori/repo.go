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
	FindAll(limit int, offset int, userID uint) ([]entities.Kategori, int64, error)
	FindByID(ID uint, userID uint) (*entities.Kategori, error)
	Update(ID uint, kategori entities.Kategori, userID uint) (*entities.Kategori, error)
	Delete(ID uint, userID uint) error
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

func (r *repository) FindAll(limit int, offset int, userID uint) ([]entities.Kategori, int64, error) {
	var kategoris []entities.Kategori
	var total int64

	query := r.db.Model(&entities.Kategori{}).Where("id_user = ?", userID)
	query.Count(&total)

	err := query.Limit(limit).Offset(offset).Find(&kategoris).Error
	if err != nil {
		return nil, 0, err
	}

	return kategoris, total, nil
}

func (r *repository) FindByID(ID uint, userID uint) (*entities.Kategori, error) {
	var kategori entities.Kategori
	err := r.db.Where("id_user = ?", userID).First(&kategori, ID).Error
	if err != nil {
		return nil, err
	}
	return &kategori, nil
}

func (r *repository) Update(ID uint, kategori entities.Kategori, userID uint) (*entities.Kategori, error) {
	err := r.db.Model(&entities.Kategori{}).Where("id = ? AND id_user = ?", ID, userID).Updates(kategori).Error
	if err != nil {
		return nil, err
	}
	return &kategori, nil
}

func (r *repository) Delete(ID uint, userID uint) error {
	err := r.db.Where("id = ? AND id_user = ?", ID, userID).Delete(&entities.Kategori{}).Error
	if err != nil {
		return err
	}
	return nil
}
