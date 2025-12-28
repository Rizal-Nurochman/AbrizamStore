package products

import (
	"github.com/abrizamstore/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ProdukRouter(api *gin.RouterGroup, DB *gorm.DB) {
	produkRepo := NewRepository(DB)
	produkService := NewService(produkRepo)
	produkHandler := NewHandler(produkService)

	// All routes now require authentication for multi-tenant data isolation
	protected := api.Group("/products")
	protected.Use(middleware.RequireAuth(DB))
	{
		protected.GET("/", produkHandler.GetAll)
		protected.GET("/:id", produkHandler.GetByID)
		protected.GET("/low-stock", produkHandler.GetLowStock)
		protected.POST("/", middleware.RequireRole("user"), produkHandler.Create)
		protected.PUT("/:id", middleware.RequireRole("user"), produkHandler.Update)
		protected.DELETE("/:id", middleware.RequireRole("user"), produkHandler.Delete)
	}
}
