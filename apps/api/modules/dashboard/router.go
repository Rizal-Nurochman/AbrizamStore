package dashboard

import (
	"github.com/abrizamstore/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DashboardRouter(api *gin.RouterGroup, DB *gorm.DB) {
	dashboardRepo := NewRepository(DB)
	dashboardService := NewService(dashboardRepo)
	dashboardHandler := NewHandler(dashboardService)

	protected := api.Group("/dashboard")
	protected.Use(middleware.RequireAuth(DB))
	{
		protected.GET("/summary", dashboardHandler.GetSummary)
		protected.GET("/top-products", dashboardHandler.GetTopProducts)
		protected.GET("/sales-trend", dashboardHandler.GetSalesTrend)
	}
}
