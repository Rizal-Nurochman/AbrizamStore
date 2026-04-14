package main

import (
	"log"
	"os"

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
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		if err := godotenv.Load(); err != nil {
			log.Println("No .env file found")
		}
	}

	migrations.ConnectionDatabase()
	DB := migrations.GetDB()

	router := gin.Default()

	allowedOrigins := []string{"http://localhost:3000", "http://localhost:5173"}
	if frontendURL := os.Getenv("FRONTEND_URL"); frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}

	config := cors.DefaultConfig()
	config.AllowOrigins = allowedOrigins
	config.AllowCredentials = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"}

	router.Use(cors.New(config))

	api := router.Group("/api/v1")
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

	port := os.Getenv("PORT")
	if port == "" {
		port = os.Getenv("GOLANG_PORT")
	}
	if port == "" {
		port = "8080"
	}
	router.Run(":" + port)
}
