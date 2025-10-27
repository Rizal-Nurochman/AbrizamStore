package middleware

import (
	"net/http"
	"os"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/database/migrations"
	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func RequireAuth(c *gin.Context) {
	tokenString, err := c.Cookie("Authorization")
	if err != nil {
		res := utils.BuildResponseFailed("Otentikasi gagal", "Cookie 'Authorization' tidak ditemukan", utils.EmptyObj{})
		c.AbortWithStatusJSON(http.StatusUnauthorized, res)
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()})) 

	if err != nil {
		res := utils.BuildResponseFailed("Otentikasi gagal", "Token tidak valid atau kedaluwarsa: "+err.Error(), utils.EmptyObj{})
		c.AbortWithStatusJSON(http.StatusUnauthorized, res)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
	
		var user entities.User
		userID := uint(claims["user_id"].(float64))

		if err := migrations.GetDB().Find(&user, userID).Error; err != nil || user.ID == 0 {
			res := utils.BuildResponseFailed("Otentikasi gagal", "User yang terkait dengan token tidak ditemukan", utils.EmptyObj{})
			c.AbortWithStatusJSON(http.StatusUnauthorized, res)
			return
		}

		c.Set("user", user)
		c.Next()

	} else {
		res := utils.BuildResponseFailed("Otentikasi gagal", "Klaim token tidak valid", utils.EmptyObj{})
		c.AbortWithStatusJSON(http.StatusUnauthorized, res)
	}
}