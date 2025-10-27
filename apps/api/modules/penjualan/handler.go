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