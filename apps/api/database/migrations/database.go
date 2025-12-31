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
	// Try loading .env - not fatal if not found (production uses env vars directly)
	if err := godotenv.Load("../.env"); err != nil {
		if err := godotenv.Load(); err != nil {
			log.Println("No .env file found, using environment variables")
		}
	}

	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASS")
	dbname := os.Getenv("DB_NAME")
	dbport := os.Getenv("DB_PORT")

	// SSL mode - default to disable for local, require for production (Supabase)
	sslmode := os.Getenv("DB_SSLMODE")
	if sslmode == "" {
		sslmode = "disable"
	}

	dsn := "host=" + host + " user=" + user + " password=" + password + " dbname=" + dbname + " port=" + dbport + " sslmode=" + sslmode + " TimeZone=Asia/Shanghai"
	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal koneksi database: ", err)
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
		log.Fatal("Gagal migrasi tabel: ", err)
	}

	// Seed default categories
	seedDefaultCategories(db)

	fmt.Println("Koneksi database sukses!")
}

func seedDefaultCategories(db *gorm.DB) {
	defaultCategories := []string{"Makanan", "Minuman", "Lain-lain"}

	for _, name := range defaultCategories {
		var existing entities.Kategori
		result := db.Where("nama_kategori = ?", name).First(&existing)
		if result.Error == gorm.ErrRecordNotFound {
			db.Create(&entities.Kategori{Nama_Kategori: name})
			fmt.Printf("Created default category: %s\n", name)
		}
	}
}

func GetDB() *gorm.DB {
	return db
}
