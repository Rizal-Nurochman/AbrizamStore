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
	protected.Use(middleware.RequireAuth(DB))
	{
		protected.POST("/", middleware.RequireRole("user"), produkHandler.Create)
		protected.PUT("/:id", middleware.RequireRole("user"), produkHandler.Update)
		protected.DELETE("/:id", middleware.RequireRole("user"), produkHandler.Delete)
	}
}