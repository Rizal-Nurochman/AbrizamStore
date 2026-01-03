package reports

import (
	"net/http"
	"time"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
)

var jakartaLocation *time.Location

func init() {
	var err error
	jakartaLocation, err = time.LoadLocation("Asia/Jakarta")
	if err != nil {
		jakartaLocation = time.FixedZone("WIB", 7*60*60)
	}
}

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
	user := c.MustGet("user").(entities.User)

	now := time.Now().In(jakartaLocation)
	startDateStr := c.DefaultQuery("start_date", now.AddDate(0, -1, 0).Format("2006-01-02"))
	endDateStr := c.DefaultQuery("end_date", now.Format("2006-01-02"))

	startDate, err := time.ParseInLocation("2006-01-02", startDateStr, jakartaLocation)
	if err != nil {
		res := utils.BuildResponseFailed("Invalid start_date format", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	endDate, err := time.ParseInLocation("2006-01-02", endDateStr, jakartaLocation)
	if err != nil {
		res := utils.BuildResponseFailed("Invalid end_date format", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	endDate = endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	report, err := h.service.GetSalesReport(startDate, endDate, user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get sales report", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Sales report retrieved successfully", report)
	c.JSON(http.StatusOK, res)
}

func (h *handler) GetProfitLossReport(c *gin.Context) {
	user := c.MustGet("user").(entities.User)

	now := time.Now().In(jakartaLocation)
	startDateStr := c.DefaultQuery("start_date", now.AddDate(0, -1, 0).Format("2006-01-02"))
	endDateStr := c.DefaultQuery("end_date", now.Format("2006-01-02"))

	startDate, err := time.ParseInLocation("2006-01-02", startDateStr, jakartaLocation)
	if err != nil {
		res := utils.BuildResponseFailed("Invalid start_date format", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	endDate, err := time.ParseInLocation("2006-01-02", endDateStr, jakartaLocation)
	if err != nil {
		res := utils.BuildResponseFailed("Invalid end_date format", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	endDate = endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	report, err := h.service.GetProfitLossReport(startDate, endDate, user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get profit/loss report", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Profit/Loss report retrieved successfully", report)
	c.JSON(http.StatusOK, res)
}

func (h *handler) GetStockReport(c *gin.Context) {
	user := c.MustGet("user").(entities.User)

	report, err := h.service.GetStockReport(user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get stock report", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Stock report retrieved successfully", report)
	c.JSON(http.StatusOK, res)
}
