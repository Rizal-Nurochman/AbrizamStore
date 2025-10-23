package products

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ProdukRouter(api *gin.RouterGroup, DB *gorm.DB) {
	produkRepo := NewRepository(DB)
	produkService := NewService(produkRepo)
	produkHandler := NewHandler(produkService)

	produk := api.Group("/products")
	{
		produk.POST("/", produkHandler.Create)
		produk.GET("/", produkHandler.GetAll)
		produk.GET("/search", produkHandler.GetByName)
		produk.GET("/:id", produkHandler.GetByID)
		produk.PUT("/:id", produkHandler.Update)
		produk.DELETE("/:id", produkHandler.Delete)
	}
}