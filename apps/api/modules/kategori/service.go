// File: modules/kategori/service.go
package kategori

import (
	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
)

type service struct {
	repository Repository
}

type Service interface {
	Create(kategori dto.KategoriCreate, userID uint) (*entities.Kategori, error)
	GetAll(limit int, offset int, userID uint) ([]entities.Kategori, int64, error)
	GetByID(ID uint, userID uint) (*entities.Kategori, error)
	Update(ID uint, kategori dto.KategoriUpdate, userID uint) (*entities.Kategori, error)
	Delete(ID uint, userID uint) error
}

func NewService(repository Repository) Service {
	return &service{repository: repository}
}

func (s *service) Create(kategori dto.KategoriCreate, userID uint) (*entities.Kategori, error) {
	kategoriBaru := &entities.Kategori{
		Nama_Kategori: kategori.Nama_Kategori,
		ID_User:       &userID,
	}

	err := s.repository.Create(kategoriBaru)
	if err != nil {
		return nil, err
	}
	return kategoriBaru, nil
}

func (s *service) GetAll(limit int, offset int, userID uint) ([]entities.Kategori, int64, error) {
	kategoris, total, err := s.repository.FindAll(limit, offset, userID)
	if err != nil {
		return nil, 0, err
	}
	return kategoris, total, nil
}

func (s *service) GetByID(ID uint, userID uint) (*entities.Kategori, error) {
	kategori, err := s.repository.FindByID(ID, userID)
	if err != nil {
		return nil, err
	}
	return kategori, nil
}

func (s *service) Update(ID uint, kategori dto.KategoriUpdate, userID uint) (*entities.Kategori, error) {
	kategoriExist, err := s.repository.FindByID(ID, userID)
	if err != nil {
		return nil, err
	}
	if kategoriExist == nil {
		return nil, nil
	}

	kategoriUpdate := entities.Kategori{
		Nama_Kategori: kategori.Nama_Kategori,
	}

	updatedKategori, err := s.repository.Update(ID, kategoriUpdate, userID)
	if err != nil {
		return nil, err
	}
	return updatedKategori, nil
}

func (s *service) Delete(ID uint, userID uint) error {
	err := s.repository.Delete(ID, userID)
	if err != nil {
		return err
	}
	return nil
}
