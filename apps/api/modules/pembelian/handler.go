package pembelian

import (
	"net/http"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
)

type handler struct {
	service Service
}

type Handler interface {
	CreatePembelian(c *gin.Context)
	GetAll(c *gin.Context)
	GetByID(c *gin.Context)
}

func NewHandler(service Service) Handler {
	return &handler{service: service}
}

func (h *handler) CreatePembelian(c *gin.Context) {
	var input dto.PembelianCreate

	if err := c.ShouldBindJSON(&input); err != nil {
		res := utils.BuildResponseFailed("Input tidak valid", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	user, exists := c.Get("user")
	if !exists {
		res := utils.BuildResponseFailed("Otentikasi gagal", "User tidak ditemukan di context", utils.EmptyObj{})
		c.JSON(http.StatusUnauthorized, res)
		return
	}
	userID := user.(entities.User).ID

	pembelian, err := h.service.CreatePembelian(input, userID)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal mencatat pembelian", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Pembelian (restock) berhasil dicatat", pembelian)
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

	pembelians, total, err := h.service.GetAll(limit, offset)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve purchase history", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	data := gin.H{
		"pembelians": pembelians,
		"total":      total,
	}
	res := utils.BuildResponseSuccess("Purchase history retrieved successfully", data)
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

	pembelian, err := h.service.GetByID(uint(id))
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve purchase detail", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := utils.BuildResponseSuccess("Purchase detail retrieved successfully", pembelian)
	c.JSON(http.StatusOK, res)
}