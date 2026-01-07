package chatbot

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"gorm.io/gorm"
)

type Service interface {
	Chat(userID uint, message string) (*dto.ChatResponse, error)
	ClearHistory(userID uint)
}

type service struct {
	db     *gorm.DB
	memory *ConversationMemory
	cache  *ResponseCache
}

func NewService(db *gorm.DB) Service {
	return &service{
		db:     db,
		memory: NewConversationMemory(10, time.Hour), // Remember last 10 messages, 1 hour TTL
		cache:  NewResponseCache(5*time.Minute, 100), // Cache for 5 minutes, max 100 entries
	}
}

func (s *service) ClearHistory(userID uint) {
	s.memory.Clear(userID)
}

func (s *service) Chat(userID uint, message string) (*dto.ChatResponse, error) {
	// Check cache first
	if cachedResponse, found := s.cache.Get(userID, message); found {
		return &dto.ChatResponse{
			Message: cachedResponse + "\n\n_💾 (dari cache)_",
		}, nil
	}

	// Build context with user info for personalization
	context, userName, err := s.buildBusinessContextWithUser(userID)
	if err != nil {
		return &dto.ChatResponse{
			Message: s.getFriendlyErrorMessage("context"),
		}, nil
	}

	// Get conversation history
	history := s.memory.GetHistory(userID)

	// Build prompt with history and personalization
	prompt := s.buildPromptWithHistory(context, userName, history, message)

	// Call Gemini API with error handling
	response, err := s.callGeminiAPIWithRetry(prompt, 3)
	if err != nil {
		return &dto.ChatResponse{
			Message: s.handleGeminiError(err),
		}, nil
	}

	// Store in conversation memory
	s.memory.AddMessage(userID, "user", message)
	s.memory.AddMessage(userID, "assistant", response)

	// Cache the response
	s.cache.Set(userID, message, response)

	return &dto.ChatResponse{Message: response}, nil
}

func (s *service) buildBusinessContextWithUser(userID uint) (*dto.BusinessContext, string, error) {
	var user entities.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return nil, "", err
	}

	userName := user.Name
	if userName == "" {
		userName = "Kak"
	}

	var totalProducts int64
	s.db.Model(&entities.Produk{}).Where("id_user = ?", userID).Count(&totalProducts)

	var totalStock int64
	s.db.Model(&entities.Produk{}).Where("id_user = ?", userID).Select("COALESCE(SUM(stok), 0)").Scan(&totalStock)

	var lowStock, outOfStock int64
	s.db.Model(&entities.Produk{}).Where("id_user = ? AND stok > 0 AND stok <= 10", userID).Count(&lowStock)
	s.db.Model(&entities.Produk{}).Where("id_user = ? AND stok = 0", userID).Count(&outOfStock)

	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Second)

	salesSummary := s.getSalesSummary(userID, startOfMonth, endOfMonth)
	profitSummary := s.getProfitSummary(userID, startOfMonth, endOfMonth)
	topProducts := s.getTopProducts(userID, startOfMonth, endOfMonth)
	stockAlerts := s.getStockAlerts(userID)
	categories := s.getCategorySummary(userID)

	return &dto.BusinessContext{
		StoreName:          user.StoreName,
		TotalProducts:      totalProducts,
		TotalStock:         totalStock,
		ProductsLowStock:   lowStock,
		ProductsOutOfStock: outOfStock,
		SalesSummary:       salesSummary,
		ProfitSummary:      profitSummary,
		TopProducts:        topProducts,
		StockAlerts:        stockAlerts,
		Categories:         categories,
	}, userName, nil
}

func (s *service) getSalesSummary(userID uint, startDate, endDate time.Time) *dto.SalesSummary {
	var totalRevenue int64
	var totalTransactions int64

	s.db.Model(&entities.Penjualan{}).
		Where("id_user = ? AND created_at >= ? AND created_at <= ?", userID, startDate, endDate).
		Select("COALESCE(SUM(total_penjualan), 0)").Scan(&totalRevenue)

	s.db.Model(&entities.Penjualan{}).
		Where("id_user = ? AND created_at >= ? AND created_at <= ?", userID, startDate, endDate).
		Count(&totalTransactions)

	days := endDate.Sub(startDate).Hours() / 24
	if days < 1 {
		days = 1
	}
	dailyAvg := totalRevenue / int64(days)

	type DailySale struct {
		Date    string
		Revenue int64
	}
	var dailySales []DailySale
	s.db.Model(&entities.Penjualan{}).
		Select("DATE(created_at) as date, SUM(total_penjualan) as revenue").
		Where("id_user = ? AND created_at >= ? AND created_at <= ?", userID, startDate, endDate).
		Group("DATE(created_at)").
		Order("revenue DESC").
		Limit(1).
		Scan(&dailySales)

	var bestDay string
	var bestDayRevenue int64
	if len(dailySales) > 0 {
		bestDay = dailySales[0].Date
		bestDayRevenue = dailySales[0].Revenue
	}

	return &dto.SalesSummary{
		TotalRevenue:      totalRevenue,
		TotalTransactions: totalTransactions,
		DailyAverage:      dailyAvg,
		BestDay:           bestDay,
		BestDayRevenue:    bestDayRevenue,
	}
}

func (s *service) getProfitSummary(userID uint, startDate, endDate time.Time) *dto.ProfitSummary {
	type ProfitData struct {
		TotalCost    int64
		TotalRevenue int64
		TotalProfit  int64
	}
	var profitData ProfitData

	s.db.Model(&entities.Detail_Penjualan{}).
		Select(`
			COALESCE(SUM(detail_penjualans.jumlah * p.harga_beli), 0) as total_cost,
			COALESCE(SUM(detail_penjualans.subtotal), 0) as total_revenue,
			COALESCE(SUM(detail_penjualans.subtotal) - SUM(detail_penjualans.jumlah * p.harga_beli), 0) as total_profit
		`).
		Joins("LEFT JOIN produks p ON p.id = detail_penjualans.id_produk").
		Joins("LEFT JOIN penjualans pj ON pj.id = detail_penjualans.id_penjualan").
		Where("pj.id_user = ? AND pj.created_at >= ? AND pj.created_at <= ?", userID, startDate, endDate).
		Scan(&profitData)

	var margin float64
	if profitData.TotalCost > 0 {
		margin = (float64(profitData.TotalProfit) / float64(profitData.TotalCost)) * 100
	}

	type TopProfitProduct struct {
		Name   string
		Profit int64
	}
	var topProfit []TopProfitProduct
	s.db.Model(&entities.Detail_Penjualan{}).
		Select("p.nama_produk as name, SUM(detail_penjualans.subtotal) - SUM(detail_penjualans.jumlah * p.harga_beli) as profit").
		Joins("LEFT JOIN produks p ON p.id = detail_penjualans.id_produk").
		Joins("LEFT JOIN penjualans pj ON pj.id = detail_penjualans.id_penjualan").
		Where("pj.id_user = ? AND pj.created_at >= ? AND pj.created_at <= ?", userID, startDate, endDate).
		Group("p.id, p.nama_produk").
		Order("profit DESC").
		Limit(1).
		Scan(&topProfit)

	var mostProfitable string
	var highestProfit int64
	if len(topProfit) > 0 {
		mostProfitable = topProfit[0].Name
		highestProfit = topProfit[0].Profit
	}

	return &dto.ProfitSummary{
		TotalCost:      profitData.TotalCost,
		TotalRevenue:   profitData.TotalRevenue,
		TotalProfit:    profitData.TotalProfit,
		AverageMargin:  margin,
		MostProfitable: mostProfitable,
		HighestProfit:  highestProfit,
	}
}

func (s *service) getTopProducts(userID uint, startDate, endDate time.Time) []dto.TopProductItem {
	var topProducts []dto.TopProductItem

	s.db.Model(&entities.Detail_Penjualan{}).
		Select("p.nama_produk as name, SUM(detail_penjualans.jumlah) as sold_count, SUM(detail_penjualans.subtotal) as revenue").
		Joins("LEFT JOIN produks p ON p.id = detail_penjualans.id_produk").
		Joins("LEFT JOIN penjualans pj ON pj.id = detail_penjualans.id_penjualan").
		Where("pj.id_user = ? AND pj.created_at >= ? AND pj.created_at <= ?", userID, startDate, endDate).
		Group("p.id, p.nama_produk").
		Order("sold_count DESC").
		Limit(5).
		Scan(&topProducts)

	return topProducts
}

func (s *service) getStockAlerts(userID uint) []dto.StockAlertItem {
	var alerts []dto.StockAlertItem

	s.db.Model(&entities.Produk{}).
		Select("nama_produk as name, stok as stock, CASE WHEN stok = 0 THEN 'habis' ELSE 'menipis' END as status").
		Where("id_user = ? AND stok <= 10", userID).
		Order("stok ASC").
		Limit(10).
		Scan(&alerts)

	return alerts
}

func (s *service) getCategorySummary(userID uint) []dto.CategorySummaryItem {
	var categories []dto.CategorySummaryItem

	s.db.Model(&entities.Kategori{}).
		Select("kategoris.nama_kategori as name, COUNT(p.id) as product_count").
		Joins("LEFT JOIN produks p ON p.id_kategori = kategoris.id AND p.id_user = ?", userID).
		Where("kategoris.id_user = ?", userID).
		Group("kategoris.id, kategoris.nama_kategori").
		Scan(&categories)

	return categories
}

func (s *service) buildPromptWithHistory(context *dto.BusinessContext, userName string, history []ConversationMessage, userMessage string) string {
	storeName := context.StoreName
	if storeName == "" {
		storeName = "Toko"
	}

	// Get time-based greeting
	greeting := s.getTimeBasedGreeting()

	systemPrompt := fmt.Sprintf(`Kamu adalah Business Analyst AI yang ramah dan helpful untuk aplikasi DODOLAN.

KEPRIBADIAN:
- Panggil user dengan nama: %s
- Gunakan sapaan yang hangat dan personal
- Gunakan emoji sesekali untuk membuat percakapan lebih hidup 😊
- Berikan motivasi dan dukungan untuk bisnis mereka
- Jadilah seperti teman yang membantu, bukan robot

INFORMASI USER:
- Nama User: %s
- Nama Toko: %s
- Waktu: %s

DATA BISNIS (Bulan Ini):
- Total Produk: %d
- Total Stok: %d unit
- Produk Stok Menipis (≤10): %d
- Produk Habis: %d

`, userName, userName, storeName, greeting,
		context.TotalProducts, context.TotalStock, context.ProductsLowStock, context.ProductsOutOfStock)

	if context.SalesSummary != nil {
		systemPrompt += fmt.Sprintf(`RINGKASAN PENJUALAN:
- Total Omzet: Rp %d
- Total Transaksi: %d
- Rata-rata Harian: Rp %d
- Hari Terbaik: %s (Rp %d)

`, context.SalesSummary.TotalRevenue, context.SalesSummary.TotalTransactions,
			context.SalesSummary.DailyAverage, context.SalesSummary.BestDay, context.SalesSummary.BestDayRevenue)
	}

	if context.ProfitSummary != nil {
		systemPrompt += fmt.Sprintf(`RINGKASAN LABA/RUGI:
- Total Modal: Rp %d
- Total Penjualan: Rp %d
- Total Laba: Rp %d
- Margin Rata-rata: %.2f%%
- Produk Paling Untung: %s (Laba: Rp %d)

`, context.ProfitSummary.TotalCost, context.ProfitSummary.TotalRevenue,
			context.ProfitSummary.TotalProfit, context.ProfitSummary.AverageMargin,
			context.ProfitSummary.MostProfitable, context.ProfitSummary.HighestProfit)
	}

	if len(context.TopProducts) > 0 {
		systemPrompt += "TOP 5 PRODUK TERLARIS:\n"
		for i, p := range context.TopProducts {
			systemPrompt += fmt.Sprintf("%d. %s - Terjual: %d, Omzet: Rp %d\n", i+1, p.Name, p.SoldCount, p.Revenue)
		}
		systemPrompt += "\n"
	}

	if len(context.StockAlerts) > 0 {
		systemPrompt += "PERINGATAN STOK:\n"
		for _, a := range context.StockAlerts {
			systemPrompt += fmt.Sprintf("- %s: %d unit (%s)\n", a.Name, a.Stock, a.Status)
		}
		systemPrompt += "\n"
	}

	if len(context.Categories) > 0 {
		systemPrompt += "KATEGORI PRODUK:\n"
		for _, c := range context.Categories {
			systemPrompt += fmt.Sprintf("- %s: %d produk\n", c.Name, c.ProductCount)
		}
		systemPrompt += "\n"
	}

	// Add conversation history
	if len(history) > 0 {
		systemPrompt += "RIWAYAT PERCAKAPAN SEBELUMNYA:\n"
		for _, msg := range history {
			if msg.Role == "user" {
				systemPrompt += fmt.Sprintf("User: %s\n", msg.Content)
			} else {
				systemPrompt += fmt.Sprintf("Kamu: %s\n", msg.Content)
			}
		}
		systemPrompt += "\n"
	}

	systemPrompt += `ATURAN PENTING:
1. HANYA jawab pertanyaan tentang: penjualan, produk, stok, laba/rugi, kategori, dan strategi bisnis
2. Jika user bertanya di luar konteks bisnis, tolak dengan sopan dan arahkan kembali ke bisnis
3. Berikan insight dan rekomendasi yang actionable
4. Ingat konteks percakapan sebelumnya jika ada
5. Jika data kosong (0), berikan motivasi dan tips untuk memulai
6. Gunakan format yang mudah dibaca (bullet points, angka)

PERTANYAAN USER SAAT INI:
` + userMessage

	return systemPrompt
}

func (s *service) getTimeBasedGreeting() string {
	hour := time.Now().Hour()
	switch {
	case hour >= 5 && hour < 11:
		return "Pagi"
	case hour >= 11 && hour < 15:
		return "Siang"
	case hour >= 15 && hour < 18:
		return "Sore"
	default:
		return "Malam"
	}
}

func (s *service) callGeminiAPIWithRetry(prompt string, maxRetries int) (string, error) {
	var lastErr error

	for i := 0; i < maxRetries; i++ {
		response, err := s.callGeminiAPI(prompt)
		if err == nil {
			return response, nil
		}

		lastErr = err

		// Check if error is retryable
		if !s.isRetryableError(err) {
			return "", err
		}

		// Wait before retry (exponential backoff)
		time.Sleep(time.Duration(i+1) * time.Second)
	}

	return "", lastErr
}

func (s *service) isRetryableError(err error) bool {
	errStr := err.Error()
	// Retry on network errors or 5xx errors
	return strings.Contains(errStr, "connection") ||
		strings.Contains(errStr, "timeout") ||
		strings.Contains(errStr, "500") ||
		strings.Contains(errStr, "502") ||
		strings.Contains(errStr, "503")
}

func (s *service) handleGeminiError(err error) string {
	errStr := err.Error()

	switch {
	case strings.Contains(errStr, "GEMINI_API_KEY not configured"):
		return "Maaf, sistem sedang dalam konfigurasi. Silakan hubungi admin. 🔧"

	case strings.Contains(errStr, "429") || strings.Contains(errStr, "quota") || strings.Contains(errStr, "rate limit"):
		return "Maaf, layanan AI sedang sibuk. Coba lagi dalam beberapa menit ya! ⏳"

	case strings.Contains(errStr, "400") || strings.Contains(errStr, "invalid"):
		return "Hmm, ada yang tidak beres dengan pertanyaanmu. Coba formulasikan ulang ya! 🤔"

	case strings.Contains(errStr, "401") || strings.Contains(errStr, "403"):
		return "Maaf, ada masalah autentikasi dengan layanan AI. Silakan hubungi admin. 🔐"

	case strings.Contains(errStr, "timeout") || strings.Contains(errStr, "connection"):
		return "Koneksi ke layanan AI terputus. Coba lagi sebentar ya! 🌐"

	case strings.Contains(errStr, "empty response"):
		return "AI tidak memberikan respons. Coba tanyakan dengan cara yang berbeda! 💭"

	default:
		return "Maaf, terjadi kesalahan teknis. Coba lagi dalam beberapa saat. 🙏"
	}
}

func (s *service) getFriendlyErrorMessage(errorType string) string {
	switch errorType {
	case "context":
		return "Maaf, saya tidak bisa mengakses data bisnis Anda saat ini. Coba lagi nanti ya! 📊"
	default:
		return "Maaf, terjadi kesalahan. Coba lagi dalam beberapa saat. 🙏"
	}
}

func (s *service) callGeminiAPI(prompt string) (string, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GEMINI_API_KEY not configured")
	}

	// Using gemini-2.5-flash
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s", apiKey)

	requestBody := dto.GeminiRequest{
		Contents: []dto.GeminiContent{
			{
				Parts: []dto.GeminiPart{
					{Text: prompt},
				},
			},
		},
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Post(url, "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", fmt.Errorf("failed to call Gemini API: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	// Check HTTP status
	if resp.StatusCode != 200 {
		return "", fmt.Errorf("Gemini API returned status %d: %s", resp.StatusCode, string(body))
	}

	var geminiResp dto.GeminiResponse
	if err := json.Unmarshal(body, &geminiResp); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	if geminiResp.Error != nil {
		return "", fmt.Errorf("Gemini API error: %s", geminiResp.Error.Message)
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("empty response from Gemini")
	}

	response := geminiResp.Candidates[0].Content.Parts[0].Text
	response = strings.TrimSpace(response)

	return response, nil
}
