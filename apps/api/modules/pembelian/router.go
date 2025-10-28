package pembelian

import (
	"github.com/abrizamstore/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func PembelianRouter(api *gin.RouterGroup, DB *gorm.DB) {
	pembelianRepo := NewRepository(DB)
	pembelianService := NewService(DB, pembelianRepo)
	pembelianHandler := NewHandler(pembelianService)

	protected := api.Group("/pembelian")
	protected.Use(middleware.RequireAuth(DB))
	{
		protected.POST("/", middleware.RequireRole("user"), pembelianHandler.CreatePembelian)
		protected.GET("/", middleware.RequireRole("user"), pembelianHandler.GetAll)
		protected.GET("/:id", middleware.RequireRole("user"), pembelianHandler.GetByID)
	}
}