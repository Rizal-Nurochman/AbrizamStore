package dashboard

import (
	"time"

	"github.com/abrizamstore/package/dto"
)

type Service interface {
	GetSummary(userID uint) (*dto.SummaryResponse, error)
	GetTopProducts(userID uint) (*[]dto.TopProductResponse, error)
	GetSalesTrend(userID uint) (*[]dto.SalesTrendItem, error)
}

type service struct {
	repository Repository
}

func NewService(r Repository) Service {
	return &service{repository: r}
}

func (s *service) GetSummary(userID uint) (*dto.SummaryResponse, error) {
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

	return s.repository.GetSummary(todayStart, weekStart, monthStart, userID)
}

func (s *service) GetTopProducts(userID uint) (*[]dto.TopProductResponse, error) {
	return s.repository.GetTopSellingProducts(5, userID)
}

func (s *service) GetSalesTrend(userID uint) (*[]dto.SalesTrendItem, error) {
	return s.repository.GetSalesTrend(7, userID) // Last 7 days
}
