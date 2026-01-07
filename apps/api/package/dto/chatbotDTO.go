package dto

type ChatRequest struct {
	Message string `json:"message" binding:"required"`
}

type ChatResponse struct {
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

type BusinessContext struct {
	StoreName          string                `json:"store_name"`
	TotalProducts      int64                 `json:"total_products"`
	TotalStock         int64                 `json:"total_stock"`
	ProductsLowStock   int64                 `json:"products_low_stock"`
	ProductsOutOfStock int64                 `json:"products_out_of_stock"`
	SalesSummary       *SalesSummary         `json:"sales_summary,omitempty"`
	ProfitSummary      *ProfitSummary        `json:"profit_summary,omitempty"`
	TopProducts        []TopProductItem      `json:"top_products,omitempty"`
	StockAlerts        []StockAlertItem      `json:"stock_alerts,omitempty"`
	Categories         []CategorySummaryItem `json:"categories,omitempty"`
}

type SalesSummary struct {
	TotalRevenue      int64  `json:"total_revenue"`
	TotalTransactions int64  `json:"total_transactions"`
	DailyAverage      int64  `json:"daily_average"`
	BestDay           string `json:"best_day"`
	BestDayRevenue    int64  `json:"best_day_revenue"`
}

type ProfitSummary struct {
	TotalCost      int64   `json:"total_cost"`
	TotalRevenue   int64   `json:"total_revenue"`
	TotalProfit    int64   `json:"total_profit"`
	AverageMargin  float64 `json:"average_margin"`
	MostProfitable string  `json:"most_profitable_product"`
	HighestProfit  int64   `json:"highest_profit"`
}

type TopProductItem struct {
	Name      string `json:"name"`
	SoldCount int    `json:"sold_count"`
	Revenue   int    `json:"revenue"`
}

type StockAlertItem struct {
	Name   string `json:"name"`
	Stock  int    `json:"stock"`
	Status string `json:"status"`
}

type CategorySummaryItem struct {
	Name         string `json:"name"`
	ProductCount int    `json:"product_count"`
}

type GeminiRequest struct {
	Contents []GeminiContent `json:"contents"`
}

type GeminiContent struct {
	Parts []GeminiPart `json:"parts"`
}

type GeminiPart struct {
	Text string `json:"text"`
}

type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}
