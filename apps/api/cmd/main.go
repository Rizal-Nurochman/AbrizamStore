package main

import (
	"os"

	"github.com/abrizamstore/database/migrations"
	"github.com/abrizamstore/modules/auth"
	"github.com/abrizamstore/modules/dashboard"
	"github.com/abrizamstore/modules/kategori"
	"github.com/abrizamstore/modules/pembelian"
	"github.com/abrizamstore/modules/penjualan"
	"github.com/abrizamstore/modules/products"
	"github.com/abrizamstore/modules/user"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	migrations.ConnectionDatabase()
	DB := migrations.GetDB()

	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:5173"} // Ganti dengan port FE Anda
	config.AllowCredentials = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}

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
	}

	port := os.Getenv("GOLANG_PORT")
	router.Run(":" + port)
}
