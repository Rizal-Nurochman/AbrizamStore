package kategori

import (
	"github.com/abrizamstore/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func KategoriRouter(api *gin.RouterGroup, DB *gorm.DB) {
	kategoriRepo := NewRepository(DB)
	kategoriService := NewService(kategoriRepo)
	kategoriHandler := NewHandler(kategoriService)

	public := api.Group("/kategori")
	{
		public.GET("/", kategoriHandler.GetAll)
		public.GET("/:id", kategoriHandler.GetByID)
	}

	protected := api.Group("/kategori")
	protected.Use(middleware.RequireAuth(DB))
	{
		protected.POST("/", middleware.RequireRole("user"), kategoriHandler.Create)
		protected.PUT("/:id", middleware.RequireRole("user"), kategoriHandler.Update)
		protected.DELETE("/:id", middleware.RequireRole("user"), kategoriHandler.Delete)
	}
}