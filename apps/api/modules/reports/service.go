package reports

import (
	"time"

	"github.com/abrizamstore/package/dto"
)

type Service interface {
	GetSalesReport(startDate, endDate time.Time) (*dto.SalesReportResponse, error)
	GetProfitLossReport(startDate, endDate time.Time) (*dto.ProfitLossResponse, error)
	GetStockReport() (*dto.StockReportResponse, error)
}

type service struct {
	repository Repository
}

func NewService(r Repository) Service {
	return &service{repository: r}
}

func (s *service) GetSalesReport(startDate, endDate time.Time) (*dto.SalesReportResponse, error) {
	return s.repository.GetSalesReport(startDate, endDate)
}

func (s *service) GetProfitLossReport(startDate, endDate time.Time) (*dto.ProfitLossResponse, error) {
	return s.repository.GetProfitLossReport(startDate, endDate)
}

func (s *service) GetStockReport() (*dto.StockReportResponse, error) {
	return s.repository.GetStockReport()
}
