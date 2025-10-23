package main

import (
	"os"

	"github.com/abrizamstore/database/migrations"
	"github.com/abrizamstore/modules/auth"
	"github.com/abrizamstore/modules/products"
	"github.com/gin-gonic/gin"
)

func main() {
	migrations.ConnectionDatabase()

	DB := migrations.GetDB()
	router:=gin.Default()

	api:=router.Group("/api/v1")
	{
		auth.AuthRouter(api, DB)
		products.ProdukRouter(api, DB)
	}

	port := os.Getenv("GOLANG_PORT")
	router.Run(":" + port)
}