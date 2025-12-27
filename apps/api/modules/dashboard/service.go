package dashboard

import (
	"time"

	"github.com/abrizamstore/package/dto"
)

type Service interface {
	GetSummary() (*dto.SummaryResponse, error)
	GetTopProducts() (*[]dto.TopProductResponse, error)
	GetSalesTrend() (*[]dto.SalesTrendItem, error)
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

	// Get start of week (Monday)
	weekday := int(now.Weekday())
	if weekday == 0 {
		weekday = 7
	}
	weekStart := time.Date(now.Year(), now.Month(), now.Day()-weekday+1, 0, 0, 0, 0, now.Location())

	// Get start of month
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	return s.repository.GetSummary(todayStart, weekStart, monthStart)
}

func (s *service) GetTopProducts() (*[]dto.TopProductResponse, error) {
	return s.repository.GetTopSellingProducts(5)
}

func (s *service) GetSalesTrend() (*[]dto.SalesTrendItem, error) {
	return s.repository.GetSalesTrend(7) // Last 7 days
}
