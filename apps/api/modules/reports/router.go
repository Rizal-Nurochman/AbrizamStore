package reports

import (
	"github.com/abrizamstore/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ReportsRouter(api *gin.RouterGroup, DB *gorm.DB) {
	reportsRepo := NewRepository(DB)
	reportsService := NewService(reportsRepo)
	reportsHandler := NewHandler(reportsService)

	protected := api.Group("/reports")
	protected.Use(middleware.RequireAuth(DB))
	protected.Use(middleware.RequireRole("user"))
	{
		protected.GET("/sales", reportsHandler.GetSalesReport)
		protected.GET("/profit-loss", reportsHandler.GetProfitLossReport)
		protected.GET("/stock", reportsHandler.GetStockReport)
	}
}
