package auth

import (
	"github.com/abrizamstore/package/dto"
	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
)

type handler struct {
	service Service
}

type Handler interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
}

func NewHandler(service Service) Handler {
	return &handler{service}
}

func (h *handler) Register(c *gin.Context) {
	var input dto.UserRegister
	err := c.ShouldBindJSON(&input)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal melakukan registrasi", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	user, err := h.service.Register(input)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal melakukan registrasi", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	res := utils.BuildResponseSuccess("Berhasil melakukan registrasi", user)
	c.JSON(200, res)
}

func (h *handler) Login(c *gin.Context) {
	var input dto.UserLogin
	err := c.ShouldBindJSON(&input)

	if err != nil {
		res := utils.BuildResponseFailed("Gagal melakukan login", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	user, token, err := h.service.Login(input)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal melakukan login", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	data := gin.H{
		"user":  user,
		"token": token,
	}

	res := utils.BuildResponseSuccess("Berhasil melakukan login", data)
	c.JSON(200, res)
}