package dashboard

import (
	"net/http"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
)

type Handler interface {
	GetSummary(c *gin.Context)
	GetTopProducts(c *gin.Context)
	GetSalesTrend(c *gin.Context)
}

type handler struct {
	service Service
}

func NewHandler(service Service) Handler {
	return &handler{service: service}
}

func (h *handler) GetSummary(c *gin.Context) {
	// Get user from context
	user := c.MustGet("user").(entities.User)

	summary, err := h.service.GetSummary(user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get dashboard summary", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Dashboard summary retrieved successfully", summary)
	c.JSON(http.StatusOK, res)
}

func (h *handler) GetTopProducts(c *gin.Context) {
	// Get user from context
	user := c.MustGet("user").(entities.User)

	topProducts, err := h.service.GetTopProducts(user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get top products", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Top selling products retrieved successfully", topProducts)
	c.JSON(http.StatusOK, res)
}

func (h *handler) GetSalesTrend(c *gin.Context) {
	// Get user from context
	user := c.MustGet("user").(entities.User)

	trend, err := h.service.GetSalesTrend(user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get sales trend", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Sales trend retrieved successfully", trend)
	c.JSON(http.StatusOK, res)
}
