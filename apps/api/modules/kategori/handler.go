// File: modules/kategori/handler.go
package kategori

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
	Update(c *gin.Context)
	Delete(c *gin.Context)
}

func NewHandler(service Service) Handler {
	return &handler{service: service}
}

func (h *handler) Create(c *gin.Context) {
	var kategoriInput dto.KategoriCreate
	err := c.ShouldBindJSON(&kategoriInput)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to bind kategori input", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	// Get user from context
	user := c.MustGet("user").(entities.User)

	kategoriBaru, err := h.service.Create(kategoriInput, user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to create kategori", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	res := utils.BuildResponseSuccess("Kategori created successfully", kategoriBaru)
	c.JSON(201, res)
}

func (h *handler) GetAll(c *gin.Context) {
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

	kategoris, total, err := h.service.GetAll(limit, offset, user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve kategoris", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	data := map[string]interface{}{
		"kategoris": kategoris,
		"total":     total,
	}

	res := utils.BuildResponseSuccess("Kategoris retrieved successfully", data)
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

	kategori, err := h.service.GetByID(uint(id), user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to retrieve kategori", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	res := utils.BuildResponseSuccess("Kategori retrieved successfully", kategori)
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

	var kategoriInput dto.KategoriUpdate
	err = c.ShouldBindJSON(&kategoriInput)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to bind kategori input", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	// Get user from context
	user := c.MustGet("user").(entities.User)

	updatedKategori, err := h.service.Update(uint(id), kategoriInput, user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to update kategori", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	if updatedKategori == nil {
		res := utils.BuildResponseFailed("Kategori not found", "No kategori with the given ID", utils.EmptyObj{})
		c.JSON(404, res)
		return
	}

	res := utils.BuildResponseSuccess("Kategori updated successfully", updatedKategori)
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
		res := utils.BuildResponseFailed("Failed to delete kategori", err.Error(), utils.EmptyObj{})
		c.JSON(500, res)
		return
	}

	res := utils.BuildResponseSuccess("Kategori deleted successfully", utils.EmptyObj{})
	c.JSON(200, res)
}
