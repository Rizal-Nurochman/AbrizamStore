package auth

import (
	"github.com/abrizamstore/modules/user"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthRouter(api *gin.RouterGroup, DB *gorm.DB) {
	userRepo := user.NewRepository(DB)
	authService := NewService(userRepo)
	authHandler := NewHandler(authService)

	auth := api.Group("/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
	}

}