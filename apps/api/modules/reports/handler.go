package reports

import (
	"net/http"
	"time"

	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
)

type Handler interface {
	GetSalesReport(c *gin.Context)
	GetProfitLossReport(c *gin.Context)
	GetStockReport(c *gin.Context)
}

type handler struct {
	service Service
}

func NewHandler(service Service) Handler {
	return &handler{service: service}
}

func (h *handler) GetSalesReport(c *gin.Context) {
	// Parse date parameters
	startDateStr := c.DefaultQuery("start_date", time.Now().AddDate(0, -1, 0).Format("2006-01-02"))
	endDateStr := c.DefaultQuery("end_date", time.Now().Format("2006-01-02"))

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		res := utils.BuildResponseFailed("Invalid start_date format", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		res := utils.BuildResponseFailed("Invalid end_date format", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	// Add end of day to endDate
	endDate = endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	report, err := h.service.GetSalesReport(startDate, endDate)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get sales report", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Sales report retrieved successfully", report)
	c.JSON(http.StatusOK, res)
}

func (h *handler) GetProfitLossReport(c *gin.Context) {
	// Parse date parameters
	startDateStr := c.DefaultQuery("start_date", time.Now().AddDate(0, -1, 0).Format("2006-01-02"))
	endDateStr := c.DefaultQuery("end_date", time.Now().Format("2006-01-02"))

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		res := utils.BuildResponseFailed("Invalid start_date format", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		res := utils.BuildResponseFailed("Invalid end_date format", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	// Add end of day to endDate
	endDate = endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	report, err := h.service.GetProfitLossReport(startDate, endDate)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get profit/loss report", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Profit/Loss report retrieved successfully", report)
	c.JSON(http.StatusOK, res)
}

func (h *handler) GetStockReport(c *gin.Context) {
	report, err := h.service.GetStockReport()
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get stock report", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Stock report retrieved successfully", report)
	c.JSON(http.StatusOK, res)
}
