package chatbot

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/dto"
	"github.com/gin-gonic/gin"
)

const (
	MaxMessageLength   = 500
	MaxRequestsPerHour = 20
)

type Handler struct {
	service     Service
	rateLimiter *RateLimiter
}

func NewHandler(s Service) *Handler {
	return &Handler{
		service:     s,
		rateLimiter: NewRateLimiter(MaxRequestsPerHour, time.Hour),
	}
}

func (h *Handler) Chat(c *gin.Context) {
	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, dto.ChatResponse{Error: "Unauthorized"})
		return
	}

	user, ok := userInterface.(entities.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, dto.ChatResponse{Error: "Invalid user context"})
		return
	}

	if !h.rateLimiter.Allow(user.ID) {
		remaining, resetTime := h.rateLimiter.GetRemaining(user.ID)
		resetIn := time.Until(resetTime).Round(time.Minute)
		c.JSON(http.StatusTooManyRequests, dto.ChatResponse{
			Error: fmt.Sprintf("Batas penggunaan tercapai (%d/%d). Coba lagi dalam %v.", remaining, MaxRequestsPerHour, resetIn),
		})
		return
	}

	var req dto.ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ChatResponse{Error: "Message is required"})
		return
	}

	message := strings.TrimSpace(req.Message)
	if len(message) == 0 {
		c.JSON(http.StatusBadRequest, dto.ChatResponse{Error: "Pesan tidak boleh kosong"})
		return
	}

	if len(message) > MaxMessageLength {
		c.JSON(http.StatusBadRequest, dto.ChatResponse{
			Error: fmt.Sprintf("Pesan terlalu panjang. Maksimal %d karakter.", MaxMessageLength),
		})
		return
	}

	response, err := h.service.Chat(user.ID, message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ChatResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}
