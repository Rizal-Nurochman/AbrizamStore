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

	public := api.Group("/products")
	{
		public.GET("/", produkHandler.GetAll)
		public.GET("/:id", produkHandler.GetByID)
	}

	protected := api.Group("/products")
	protected.Use(middleware.RequireAuthorization("user"))
	{
		protected.POST("/", produkHandler.Create)
		protected.PUT("/:id", produkHandler.Update)
		protected.DELETE("/:id", produkHandler.Delete)
	}
}