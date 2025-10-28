package dashboard

import (
	"time"

	"github.com/abrizamstore/package/dto"
)

type Service interface {
	GetSummary() (*dto.SummaryResponse, error)
	GetTopProducts() (*[]dto.TopProductResponse, error)
}

type service struct {
	repository Repository
}

func NewService(r Repository) Service {
	return &service{repository: r}
}

func (s *service) GetSummary() (*dto.SummaryResponse, error) {
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	return s.repository.GetSummary(todayStart)
}

func (s *service) GetTopProducts() (*[]dto.TopProductResponse, error) {
	return s.repository.GetTopSellingProducts(5)
}