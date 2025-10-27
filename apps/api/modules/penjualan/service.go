package penjualan

import (
	"errors"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"gorm.io/gorm"
)

type Service interface {
	CreatePenjualan(input dto.PenjualanCreate, userID uint) (*entities.Penjualan, error)
}

type service struct {
	db         *gorm.DB 
	repository Repository
}

func NewService(db *gorm.DB, r Repository) Service {
	return &service{db: db, repository: r}
}

func (s *service) CreatePenjualan(input dto.PenjualanCreate, userID uint) (*entities.Penjualan, error) {
	tx := s.db.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}
	defer tx.Rollback()

	totalPenjualan := 0
	var detailsToCreate []entities.Detail_Penjualan

	for _, item := range input.Items {
		produk, err := s.repository.GetProdukForUpdate(tx, item.ID_Produk)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, errors.New("produk tidak ditemukan")
			}
			return nil, err
		}

		if produk.Stok < item.Jumlah {
			return nil, errors.New("stok produk '" + produk.Nama_Produk + "' tidak mencukupi")
		}

		produk.Stok -= item.Jumlah
		if err := s.repository.UpdateProduk(tx, produk); err != nil {
			return nil, err
		}

		subtotal := produk.Harga_Jual * item.Jumlah
		totalPenjualan += subtotal

		detailsToCreate = append(detailsToCreate, entities.Detail_Penjualan{
			ID_Produk:  produk.ID,
			Harga_Jual: produk.Harga_Jual,
			Jumlah:     item.Jumlah,
			Subtotal:   subtotal,
		})
	}

	penjualan := entities.Penjualan{
		ID_User:         &userID,
		Total_Penjualan: totalPenjualan,
	}
	if err := s.repository.CreatePenjualan(tx, &penjualan); err != nil {
		return nil, err
	}

	for _, detail := range detailsToCreate {
		detail.ID_Penjualan = penjualan.ID
		if err := s.repository.CreateDetailPenjualan(tx, &detail); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return &penjualan, nil
}