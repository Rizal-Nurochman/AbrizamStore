package penjualan

import (
	"net/http"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
)

type Handler interface {
	CreatePenjualan(c *gin.Context)
	GetAll(c *gin.Context)
	GetByID(c *gin.Context)
	DeletePenjualan(c *gin.Context)
}

type handler struct {
	service Service
}

func NewHandler(service Service) Handler {
	return &handler{service: service}
}

func (h *handler) CreatePenjualan(c *gin.Context) {
	var input dto.PenjualanCreate

	// Validasi input JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		res := utils.BuildResponseFailed("Input tidak valid", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	// Ambil user dari context (yang di-set oleh middleware RequireAuth)
	user, exists := c.Get("user")
	if !exists {
		res := utils.BuildResponseFailed("Otentikasi gagal", "User tidak ditemukan di context", utils.EmptyObj{})
		c.JSON(http.StatusUnauthorized, res)
		return
	}
	userID := user.(entities.User).ID

	// Panggil service
	penjualan, err := h.service.CreatePenjualan(input, userID)
	if err != nil {
		// Error dari service (misal: "stok tidak cukup")
		res := utils.BuildResponseFailed("Gagal membuat transaksi", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Transaksi berhasil dibuat", penjualan)
	c.JSON(http.StatusCreated, res)
}

func (h *handler) GetAll(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := utils.StringToInt(limitStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert limit", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	offset, err := utils.StringToInt(offsetStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert offset", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	penjualans, total, err := h.service.GetAll(limit, offset)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve sales history", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	data := gin.H{
		"penjualans": penjualans,
		"total":      total,
	}
	res := utils.BuildResponseSuccess("Sales history retrieved successfully", data)
	c.JSON(http.StatusOK, res)
}

func (h *handler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := utils.StringToInt(idStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert ID", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	penjualan, err := h.service.GetByID(uint(id))
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve sale detail", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Sale detail retrieved successfully", penjualan)
	c.JSON(http.StatusOK, res)
}

func (h *handler) DeletePenjualan(c *gin.Context) {
	idStr := c.Param("id")
	id, err := utils.StringToInt(idStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert ID", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	err = h.service.Delete(uint(id))
	if err != nil {
		res := utils.BuildResponseFailed("Failed to delete sale", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Transaksi penjualan berhasil dihapus", nil)
	c.JSON(http.StatusOK, res)
}
