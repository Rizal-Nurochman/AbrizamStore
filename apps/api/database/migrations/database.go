package migrations

import (
	"fmt"
	"log"
	"os"

	"github.com/abrizamstore/database/entities"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func ConnectionDatabase() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Gagal memuat file .env", err)
	}

	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASS")
	dbname := os.Getenv("DB_NAME")
	dbport := os.Getenv("DB_PORT")

	dsn := "host="+host+" user="+user+" password="+password+" dbname="+dbname+" port="+dbport+" sslmode=disable TimeZone=Asia/Shanghai"
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal koneksi database: ",err)
	}

	err = db.AutoMigrate(
		&entities.User{},
		&entities.Produk{},
		&entities.Pembelian{},
		&entities.Detail_Pembelian{},
		&entities.Detail_Penjualan{},
		&entities.Kategori{},
	)
	if err != nil {
		log.Fatal("Gagal migrasi tabel: ",err)
	}

	fmt.Println("Koneksi database sukses!")
}

func GetDB() *gorm.DB {
    return db
}