package middleware

import (
	"net/http"
	"os"

	"github.com/abrizamstore/database/entities"
	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"gorm.io/gorm"
)

func RequireAuth(DB *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("Authorization")
		if err != nil || tokenString == "" {
			// Fallback to Authorization header
			tokenString = c.GetHeader("Authorization")
			if tokenString == "" {
				res := utils.BuildResponseFailed("Otentikasi gagal", "Token tidak ditemukan", utils.EmptyObj{})
				c.AbortWithStatusJSON(http.StatusUnauthorized, res)
				return
			}
			// Remove "Bearer " prefix if present
			if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
				tokenString = tokenString[7:]
			}
		}
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
		if err != nil {
			res := utils.BuildResponseFailed("Otentikasi gagal", "Token tidak valid", utils.EmptyObj{})
			c.AbortWithStatusJSON(http.StatusUnauthorized, res)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			var user entities.User
			userID := uint(claims["user_id"].(float64))

			if err := DB.Find(&user, userID).Error; err != nil || user.ID == 0 {
				res := utils.BuildResponseFailed("Otentikasi gagal", "User tidak ditemukan", utils.EmptyObj{})
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
}

func RequireRole(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(entities.User)

		isAllowed := false
		for _, role := range allowedRoles {
			if user.Role == role {
				isAllowed = true
				break
			}
		}

		if !isAllowed {
			res := utils.BuildResponseFailed("Akses ditolak", "Anda tidak memiliki izin", utils.EmptyObj{})
			c.AbortWithStatusJSON(http.StatusForbidden, res)
			return
		}

		c.Next()
	}
}
