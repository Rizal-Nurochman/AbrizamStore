package user

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
	GetProfile(c *gin.Context)
	UpdateProfile(c *gin.Context)
}

func NewHandler(service Service) Handler {
	return &handler{service}
}

func (h *handler) GetProfile(c *gin.Context) {
	user := c.MustGet("user").(entities.User)

	userResult, err := h.service.GetProfile(user.ID)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal mendapatkan profil", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	res := utils.BuildResponseSuccess("Berhasil mendapatkan profil", userResult)
	c.JSON(200, res)
}

func (h *handler) UpdateProfile(c *gin.Context) {
	var input dto.UserUpdate
	err := c.ShouldBindJSON(&input)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal memperbarui profil", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	user := c.MustGet("user").(entities.User)

	updatedUser, err := h.service.UpdateProfile(user.ID, input)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal memperbarui profil", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	res := utils.BuildResponseSuccess("Berhasil memperbarui profil", updatedUser)
	c.JSON(200, res)
}
