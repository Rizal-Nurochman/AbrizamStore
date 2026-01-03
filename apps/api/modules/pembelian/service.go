package pembelian

import (
	"errors"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"gorm.io/gorm"
)

type service struct {
	db         *gorm.DB
	repository Repository
}

type Service interface {
	CreatePembelian(input dto.PembelianCreate, userID uint) (*entities.Pembelian, error)
	GetAll(limit int, offset int) ([]entities.Pembelian, int64, error)
	GetByID(ID uint) (*entities.Pembelian, error)
	Delete(ID uint) error
}

func NewService(db *gorm.DB, r Repository) Service {
	return &service{db: db, repository: r}
}

func (s *service) CreatePembelian(input dto.PembelianCreate, userID uint) (*entities.Pembelian, error) {
	tx := s.db.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}
	defer tx.Rollback()

	totalPembelian := 0
	var detailsToCreate []entities.Detail_Pembelian

	for _, item := range input.Items {
		produk, err := s.repository.GetProdukForUpdate(tx, item.ID_Produk)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, errors.New("produk tidak ditemukan")
			}
			return nil, err
		}

		produk.Stok += item.Jumlah
		produk.Harga_Beli = item.Harga_Beli

		if err := s.repository.UpdateProduk(tx, produk); err != nil {
			return nil, err
		}

		subtotal := item.Harga_Beli * item.Jumlah
		totalPembelian += subtotal

		detailsToCreate = append(detailsToCreate, entities.Detail_Pembelian{
			ID_Produk:  produk.ID,
			Harga_Beli: item.Harga_Beli,
			Jumlah:     item.Jumlah,
			Subtotal:   subtotal,
		})
	}

	pembelian := entities.Pembelian{
		ID_User:         &userID,
		Total_Pembelian: totalPembelian,
	}
	if err := s.repository.CreatePembelian(tx, &pembelian); err != nil {
		return nil, err
	}

	for _, detail := range detailsToCreate {
		detail.ID_Pembelian = pembelian.ID
		if err := s.repository.CreateDetailPembelian(tx, &detail); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return &pembelian, nil
}

func (s *service) GetAll(limit int, offset int) ([]entities.Pembelian, int64, error) {
	return s.repository.FindAll(limit, offset)
}

func (s *service) GetByID(ID uint) (*entities.Pembelian, error) {
	return s.repository.FindByID(ID)
}

func (s *service) Delete(ID uint) error {
	return s.repository.Delete(ID)
}
