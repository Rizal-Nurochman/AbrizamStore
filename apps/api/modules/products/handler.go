package products

import (
	"github.com/abrizamstore/database/entities"
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
	GetLowStock(c *gin.Context)
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
		res := utils.BuildResponseFailed("Failed to bind produk input", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	// Get user from context
	user := c.MustGet("user").(entities.User)

	produkBaru, err := h.service.Create(produkInput, user.ID)
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
	searchName := c.Query("nama_produk")
	kategoriIdStr := c.Query("id_kategori")

	// Get user from context
	user := c.MustGet("user").(entities.User)

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

	var kategoriId *uint
	if kategoriIdStr != "" {
		id, err := utils.StringToInt(kategoriIdStr)
		if err == nil {
			uid := uint(id)
			kategoriId = &uid
		}
	}

	var produks []entities.Produk
	var total int64
	var errService error

	if searchName != "" {
		var produksPtr *[]entities.Produk
		produksPtr, total, errService = h.service.GetByName(searchName, limit, offset, user.ID)
		if errService == nil {
			produks = *produksPtr
		}
	} else {
		produks, total, errService = h.service.GetAllWithFilter(limit, offset, kategoriId, user.ID)
	}

	if errService != nil {
		res := utils.BuildResponseFailed("Failed to retrieve produks", errService.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	totalPages := int(total) / limit
	if int(total)%limit != 0 {
		totalPages++
	}

	currentPage := (offset / limit) + 1

	pagination := utils.PaginationMeta{
		CurrentPage: currentPage,
		TotalPage:   totalPages,
		TotalItems:  total,
		Limit:       limit,
	}

	res := utils.BuildResponseWithPagination("Produks retrieved successfully", produks, pagination)
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

	// Get user from context
	user := c.MustGet("user").(entities.User)

	produk, err := h.service.GetByID(uint(id), user.ID)
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

	// Get user from context
	user := c.MustGet("user").(entities.User)

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

	produks, total, err := h.service.GetByName(name, limit, offset, user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve produks", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	totalPages := int(total) / limit
	if int(total)%limit != 0 {
		totalPages++
	}

	currentPage := (offset / limit) + 1

	pagination := utils.PaginationMeta{
		CurrentPage: currentPage,
		TotalPage:   totalPages,
		TotalItems:  total,
		Limit:       limit,
	}

	res := utils.BuildResponseWithPagination("Produks retrieved successfully", *produks, pagination)
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

	// Get user from context
	user := c.MustGet("user").(entities.User)

	updatedProduk, err := h.service.Update(uint(id), produkInput, user.ID)
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

	// Get user from context
	user := c.MustGet("user").(entities.User)

	err = h.service.Delete(uint(id), user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to delete produk", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	res := utils.BuildResponseSuccess("Produk deleted successfully", utils.EmptyObj{})
	c.JSON(200, res)
}

func (h *handler) GetLowStock(c *gin.Context) {
	// Get user from context
	user := c.MustGet("user").(entities.User)

	produks, total, err := h.service.GetLowStock(user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve low stock produks", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	data := map[string]interface{}{
		"produks": produks,
		"total":   total,
	}

	res := utils.BuildResponseSuccess("Low stock produks retrieved successfully", data)
	c.JSON(200, res)
}
