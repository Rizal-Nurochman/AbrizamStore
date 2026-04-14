package handler

import (
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/abrizamstore/database/migrations"
	"github.com/abrizamstore/modules/auth"
	"github.com/abrizamstore/modules/chatbot"
	"github.com/abrizamstore/modules/dashboard"
	"github.com/abrizamstore/modules/kategori"
	"github.com/abrizamstore/modules/pembelian"
	"github.com/abrizamstore/modules/penjualan"
	"github.com/abrizamstore/modules/products"
	"github.com/abrizamstore/modules/reports"
	"github.com/abrizamstore/modules/user"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var (
	ginRouter *gin.Engine
	once      sync.Once
)

func setupRouter() {
	gin.SetMode(gin.ReleaseMode)

	migrations.ConnectionDatabase()
	DB := migrations.GetDB()

	ginRouter = gin.New()
	ginRouter.Use(gin.Recovery())

	allowedOrigins := []string{"http://localhost:3000", "http://localhost:5173"}
	if frontendURL := os.Getenv("FRONTEND_URL"); frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}

	config := cors.DefaultConfig()
	config.AllowOrigins = allowedOrigins
	config.AllowCredentials = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"}

	ginRouter.Use(cors.New(config))

	api := ginRouter.Group("/api/v1")
	{
		auth.AuthRouter(api, DB)
		user.UserRouter(api, DB)
		products.ProdukRouter(api, DB)
		kategori.KategoriRouter(api, DB)
		penjualan.PenjualanRouter(api, DB)
		pembelian.PembelianRouter(api, DB)
		dashboard.DashboardRouter(api, DB)
		reports.ReportsRouter(api, DB)
		chatbot.ChatbotRouter(api, DB)
	}

	log.Println("Gin router initialized for Vercel")
}

// Handler is the Vercel serverless function entry point
func Handler(w http.ResponseWriter, r *http.Request) {
	once.Do(setupRouter)
	ginRouter.ServeHTTP(w, r)
}
