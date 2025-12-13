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
		auth.DELETE("/logout", authHandler.Logout)
		auth.POST("/logout", authHandler.Logout)
		auth.POST("/verify-email", authHandler.VerifyEmail)
		auth.POST("/resend-verification", authHandler.ResendVerificationCode)
		auth.POST("/forgot-password", authHandler.ForgotPassword)
		auth.POST("/reset-password", authHandler.ResetPassword)
		auth.POST("/google-login", authHandler.GoogleLoginHandler)
		auth.GET("/google-callback", authHandler.GoogleCallbackHandler)
	}

}
