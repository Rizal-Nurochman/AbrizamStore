package reports

import (
	"time"

	"github.com/abrizamstore/package/dto"
)

type Service interface {
	GetSalesReport(startDate, endDate time.Time, userID uint) (*dto.SalesReportResponse, error)
	GetProfitLossReport(startDate, endDate time.Time, userID uint) (*dto.ProfitLossResponse, error)
	GetStockReport(userID uint) (*dto.StockReportResponse, error)
}

type service struct {
	repository Repository
}

func NewService(r Repository) Service {
	return &service{repository: r}
}

func (s *service) GetSalesReport(startDate, endDate time.Time, userID uint) (*dto.SalesReportResponse, error) {
	return s.repository.GetSalesReport(startDate, endDate, userID)
}

func (s *service) GetProfitLossReport(startDate, endDate time.Time, userID uint) (*dto.ProfitLossResponse, error) {
	return s.repository.GetProfitLossReport(startDate, endDate, userID)
}

func (s *service) GetStockReport(userID uint) (*dto.StockReportResponse, error) {
	return s.repository.GetStockReport(userID)
}
