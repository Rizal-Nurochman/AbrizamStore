package products

import (
	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
)

type service struct {
	repository Repository
}

type Service interface {
	Create(produk dto.ProdukCreate) (*entities.Produk, error)
	GetAll(limit int, offset int) ([]entities.Produk, int64, error)
	GetByID(ID uint) (*entities.Produk, error)
	GetByName(name string, limit int, offset int) (*[]entities.Produk, int64, error)
	Update(ID uint, produk dto.ProdukCreate) (*entities.Produk, error)
	Delete(ID uint) error
}

func NewService(repository Repository) Service {
	return &service{repository: repository}
}

func (s *service) Create(produk dto.ProdukCreate) (*entities.Produk, error) {
	produkBaru := &entities.Produk{
		Nama_Produk: produk.Nama_Produk,
		Harga_Beli:  produk.Harga_Beli,
		Harga_Jual:  produk.Harga_Jual,
		Stok:        produk.Stok,
		ID_Kategori: produk.ID_Kategori,
	}

	err := s.repository.Create(produkBaru)
	if err != nil {
		return nil, err
	}

	return produkBaru, nil
}

func (s *service) GetAll(limit int, offset int) ([]entities.Produk, int64, error) {
	produks, total, err := s.repository.FindAll(limit, offset)
	if err != nil {
		return nil, 0, err
	}

	return produks, total, nil
}

func (s *service) GetByID(ID uint) (*entities.Produk, error) {
	produk, err := s.repository.FindByID(ID)
	if err != nil {
		return nil, err
	}

	return produk, nil
}

func (s *service) GetByName(name string, limit int, offset int) (*[]entities.Produk, int64, error) {
	produks, total, err := s.repository.FindByName(name, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	return produks, total, nil
}

func (s *service) Update(ID uint, produk dto.ProdukCreate) (*entities.Produk, error) {
	produkExist, err := s.repository.FindByID(ID)
	if err != nil {
		return nil, err
	}
	if produkExist == nil {
		return nil, nil
	}

	produkUpdate := entities.Produk{
		Nama_Produk: produk.Nama_Produk,
		Harga_Beli:  produk.Harga_Beli,
		Harga_Jual:  produk.Harga_Jual,
		Stok:        produk.Stok,
		ID_Kategori: produk.ID_Kategori,
	}

	updatedProduk, err := s.repository.Update(ID, produkUpdate)
	if err != nil {
		return nil, err
	}

	return updatedProduk, nil
}

func (s *service) Delete(ID uint) error {
	err:= s.repository.Delete(ID)
	if err != nil {
		return err
	}

	return nil
}