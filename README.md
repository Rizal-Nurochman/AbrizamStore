# 🛒 DODOLAN

**DODOLAN** adalah aplikasi Point of Sale (POS) modern dan lengkap untuk UMKM Indonesia. Nama "DODOLAN" berasal dari bahasa Jawa yang berarti "berjualan", mencerminkan semangat wirausaha dan kemudahan dalam berbisnis.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Go](https://img.shields.io/badge/Go-1.24-00ADD8?logo=go)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)

## ✨ Fitur Utama

- 🏪 **Kasir (POS)** - Sistem kasir yang cepat dan mudah digunakan
- 📦 **Manajemen Produk** - Kelola inventaris produk dengan kategori
- 📊 **Laporan Penjualan** - Analisis bisnis dengan laporan detail dan ekspor PDF/Excel
- 🔔 **Restock** - Manajemen pembelian dan restok barang
- 📱 **Responsive** - Optimal di desktop maupun mobile
- 🤖 **AI Chatbot** - Analisis bisnis pintar dengan Google Gemini
- 🔐 **Autentikasi** - Login dengan Google OAuth atau Email/Password

## 🏗️ Arsitektur

Proyek ini menggunakan arsitektur **monorepo** dengan dua aplikasi utama:

```
AbrizamStore/
├── apps/
│   ├── api/          # Backend Go (Gin Framework)
│   └── web/          # Frontend Next.js 16
```

### Backend (Go)
- **Framework**: Gin
- **Database**: PostgreSQL dengan GORM
- **Autentikasi**: JWT + Google OAuth
- **Modular**: Auth, Products, Kategori, Penjualan, Pembelian, Reports, Chatbot

### Frontend (Next.js)
- **Framework**: Next.js 16 dengan App Router
- **Styling**: Tailwind CSS 4
- **State**: TanStack Query (React Query)
- **Form**: React Hook Form + Zod
- **UI Components**: Radix UI

## 🚀 Memulai

### Prasyarat

- Node.js 20+
- Go 1.24+
- PostgreSQL

### 1. Clone Repository

```bash
git clone https://github.com/Rizal-Nurochman/AbrizamStore.git
cd AbrizamStore
```

### 2. Setup Backend

```bash
cd apps/api

# Buat file .env
cp .env.example .env

# Edit .env dengan konfigurasi database Anda
# DATABASE_URL=postgres://user:password@localhost:5432/dodolan
# JWT_SECRET=your_jwt_secret
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# GEMINI_API_KEY=your_gemini_api_key

# Jalankan server
go run ./cmd
```

### 3. Setup Frontend

```bash
cd apps/web

# Install dependencies
npm install

# Buat file .env.local
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8080
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Jalankan development server
npm run dev
```

### 4. Akses Aplikasi

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1

## 📁 Struktur Modul Backend

| Modul | Deskripsi |
|-------|-----------|
| `auth` | Autentikasi (login, register, Google OAuth) |
| `user` | Manajemen profil pengguna |
| `products` | CRUD produk |
| `kategori` | Kategori produk |
| `penjualan` | Transaksi penjualan |
| `pembelian` | Transaksi pembelian/restock |
| `reports` | Laporan dan analitik |
| `dashboard` | Data ringkasan dashboard |
| `chatbot` | AI Business Analyst dengan Gemini |

## 🌐 Deployment

### Backend (Koyeb/Fly.io)

```bash
# Build Docker image
docker build -t dodolan-api ./apps/api

# Deploy ke Koyeb/Fly.io
fly deploy
```

### Frontend (Vercel)

```bash
cd apps/web
vercel deploy
```

## 🔒 Environment Variables

### Backend (.env)

| Variable | Deskripsi |
|----------|-----------|
| `DATABASE_URL` | URL koneksi PostgreSQL |
| `JWT_SECRET` | Secret key untuk JWT |
| `GOLANG_PORT` | Port server (default: 8080) |
| `FRONTEND_URL` | URL frontend untuk CORS |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `GEMINI_API_KEY` | API Key Google Gemini |

### Frontend (.env.local)

| Variable | Deskripsi |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL Backend API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID |

## 📄 API Endpoints

### Auth
- `POST /api/v1/auth/register` - Registrasi pengguna baru
- `POST /api/v1/auth/login` - Login dengan email/password
- `POST /api/v1/auth/google` - Login dengan Google

### Products
- `GET /api/v1/products` - Daftar produk
- `POST /api/v1/products` - Tambah produk
- `PUT /api/v1/products/:id` - Update produk
- `DELETE /api/v1/products/:id` - Hapus produk

### Transaksi
- `GET /api/v1/penjualan` - Riwayat penjualan
- `POST /api/v1/penjualan` - Buat penjualan baru
- `GET /api/v1/pembelian` - Riwayat pembelian
- `POST /api/v1/pembelian` - Buat pembelian baru

### Reports
- `GET /api/v1/reports/sales` - Laporan penjualan
- `GET /api/v1/reports/products` - Laporan produk terlaris

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buka issue atau submit pull request.

## 📜 Lisensi

[MIT License](LICENSE)

---

**DODOLAN** - *Solusi POS Modern untuk UMKM Indonesia* 🇮🇩
