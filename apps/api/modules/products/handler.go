package products

import (
	"github.com/abrizamstore/package/dto"
	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
)

type handler struct {
	service Service
}

type Handler interface {
	Create(c *gin.Context)
	GetAll(c *gin.Context)
	GetByID(c *gin.Context)
	GetByName(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
}

func NewHandler(service Service) Handler {
	return &handler{service: service}
}

func (h *handler) Create(c *gin.Context) {
	var produkInput dto.ProdukCreate
	err := c.ShouldBindJSON(&produkInput)
	if err != nil {
		utils.BuildResponseFailed("Failed to bind produk input", err.Error(), utils.EmptyObj{})
		return
	}

	produkBaru, err := h.service.Create(produkInput)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to create produk", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	res := utils.BuildResponseSuccess("Produk created successfully", produkBaru)
	c.JSON(201, res)
}

func (h *handler) GetAll(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := utils.StringToInt(limitStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert limit", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	offset, err := utils.StringToInt(offsetStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert offset", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	produks, total, err := h.service.GetAll(limit, offset)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve produks", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	data := gin.H{
		"produks": produks,
		"total":   total,
	}

	res := utils.BuildResponseSuccess("Produks retrieved successfully", data)
	c.JSON(200, res)
}

func (h *handler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := utils.StringToInt(idStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert ID", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	produk, err := h.service.GetByID(uint(id))
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve produk", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	res := utils.BuildResponseSuccess("Produk retrieved successfully", produk)
	c.JSON(200, res)
}

func (h *handler) GetByName(c *gin.Context) {
	name := c.Query("nama_produk")
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := utils.StringToInt(limitStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert limit", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	offset, err := utils.StringToInt(offsetStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert offset", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	produks, total, err := h.service.GetByName(name, limit, offset)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve produks", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	data := gin.H{
		"produks": produks,
		"total":   total,
	}

	res := utils.BuildResponseSuccess("Produks retrieved successfully", data)
	c.JSON(200, res)
}

func (h *handler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := utils.StringToInt(idStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert ID", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	var produkInput dto.ProdukCreate
	err = c.ShouldBindJSON(&produkInput)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to bind produk input", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	updatedProduk, err := h.service.Update(uint(id), produkInput)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to update produk", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	if updatedProduk == nil {
		res := utils.BuildResponseFailed("Produk not found", "No produk with the given ID", utils.EmptyObj{})
		c.JSON(404, res)
		return
	}

	res := utils.BuildResponseSuccess("Produk updated successfully", updatedProduk)
	c.JSON(200, res)
}

func (h *handler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := utils.StringToInt(idStr)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to convert ID", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	err = h.service.Delete(uint(id))
	if err != nil {
		res := utils.BuildResponseFailed("Failed to delete produk", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	res := utils.BuildResponseSuccess("Produk deleted successfully", utils.EmptyObj{})
	c.JSON(200, res)
}