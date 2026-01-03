package penjualan

import (
	"github.com/abrizamstore/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func PenjualanRouter(api *gin.RouterGroup, DB *gorm.DB) {
	penjualanRepo := NewRepository(DB)
	penjualanService := NewService(DB, penjualanRepo)
	penjualanHandler := NewHandler(penjualanService)

	protected := api.Group("/penjualan")
	protected.Use(middleware.RequireAuth(DB))
	{
		protected.POST("/", middleware.RequireRole("user"), penjualanHandler.CreatePenjualan)
		protected.GET("/", middleware.RequireRole("user"), penjualanHandler.GetAll)
		protected.GET("/:id", middleware.RequireRole("user"), penjualanHandler.GetByID)
		protected.DELETE("/:id", middleware.RequireRole("user"), penjualanHandler.DeletePenjualan)
	}
}
