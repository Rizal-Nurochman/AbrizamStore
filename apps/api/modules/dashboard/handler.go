package dashboard

import (
	"net/http"

	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
)

type Handler interface {
	GetSummary(c *gin.Context)
	GetTopProducts(c *gin.Context)
}

type handler struct {
	service Service
}

func NewHandler(service Service) Handler {
	return &handler{service: service}
}

func (h *handler) GetSummary(c *gin.Context) {
	summary, err := h.service.GetSummary()
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get dashboard summary", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Dashboard summary retrieved successfully", summary)
	c.JSON(http.StatusOK, res)
}

func (h *handler) GetTopProducts(c *gin.Context) {
	topProducts, err := h.service.GetTopProducts()
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get top products", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Top selling products retrieved successfully", topProducts)
	c.JSON(http.StatusOK, res)
}