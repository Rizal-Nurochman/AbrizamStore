package chatbot

import (
	"github.com/abrizamstore/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ChatbotRouter(r *gin.RouterGroup, db *gorm.DB) {
	service := NewService(db)
	handler := NewHandler(service)

	chatbot := r.Group("/chatbot")
	chatbot.Use(middleware.RequireAuth(db))
	{
		chatbot.POST("/chat", handler.Chat)
	}
}
