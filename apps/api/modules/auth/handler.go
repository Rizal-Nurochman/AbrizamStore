package auth

import (
	"context"
	"net/http"
	"os"

	"github.com/abrizamstore/package/dto"
	"github.com/abrizamstore/package/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	googleAPI "google.golang.org/api/oauth2/v2"
)

type handler struct {
	service     Service
	oauthConfig *oauth2.Config
}

type Handler interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
	Logout(c *gin.Context)
	GoogleLoginHandler(c *gin.Context)
	GoogleCallbackHandler(c *gin.Context)
	VerifyEmail(c *gin.Context)
	ResendVerificationCode(c *gin.Context)
	ForgotPassword(c *gin.Context)
	ResetPassword(c *gin.Context)
}

func NewHandler(service Service) Handler {
	config := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
	return &handler{service, config}
}

func (h *handler) Register(c *gin.Context) {
	var input dto.UserRegister
	err := c.ShouldBindJSON(&input)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal melakukan registrasi", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	user, err := h.service.Register(input)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal melakukan registrasi", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	res := utils.BuildResponseSuccess("Berhasil melakukan registrasi", user)
	c.JSON(200, res)
}

func (h *handler) Login(c *gin.Context) {
	var input dto.UserLogin
	err := c.ShouldBindJSON(&input)

	if err != nil {
		res := utils.BuildResponseFailed("Gagal melakukan login", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	user, token, err := h.service.Login(input)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal melakukan login", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	cookieDomain := os.Getenv("COOKIE_DOMAIN")
	if cookieDomain == "" {
		cookieDomain = "localhost"
	}

	c.SetCookie(
		"Authorization", // Nama yang sama dengan yang dibaca middleware
		token,           // Token dari service
		3600*12,         // 12 jam
		"/",             // Path
		cookieDomain,    // Domain
		false,           // Secure
		true,            // HttpOnly
	)

	data := gin.H{
		"user":  user,
		"token": token,
	}

	res := utils.BuildResponseSuccess("Berhasil melakukan login", data)
	c.JSON(200, res)
}

func (h *handler) Logout(c *gin.Context) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "Authorization",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	})

	res := utils.BuildResponseSuccess("Berhasil melakukan logout", utils.EmptyObj{})
	c.JSON(200, res)
}

func (h *handler) GoogleLoginHandler(c *gin.Context) {
	var input struct {
		Code string `json:"code" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		res := utils.BuildResponseFailed("Authorization code not provided", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	token, err := h.oauthConfig.Exchange(context.Background(), input.Code)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to exchange code", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}
	client := h.oauthConfig.Client(context.Background(), token)
	service, err := googleAPI.New(client)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to create Google client", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}
	userInfo, err := service.Userinfo.Get().Do()
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get user info", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}
	user, appToken, err := h.service.LoginOrRegisterWithGoogle(userInfo)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to login or register with Google", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	cookieDomain := os.Getenv("COOKIE_DOMAIN")
	if cookieDomain == "" {
		cookieDomain = "localhost"
	}

	c.SetCookie(
		"Authorization", // Match standard auth cookie name
		appToken,
		3600*12, // 12 hours
		"/",
		cookieDomain,
		false, // Set to true in production
		true,
	)

	data := gin.H{
		"user":  user,
		"token": appToken,
	}

	res := utils.BuildResponseSuccess("Successfully logged in with Google", data)
	c.JSON(http.StatusOK, res)
}

func (h *handler) GoogleCallbackHandler(c *gin.Context) {
	// Kept for backward compatibility or if GET method is used
	code := c.Query("code")
	if code == "" {
		res := utils.BuildResponseFailed("Authorization code not provided", "code is empty", utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}
	token, err := h.oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to exchange code", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}
	client := h.oauthConfig.Client(context.Background(), token)
	service, err := googleAPI.New(client)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to create Google client", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}
	userInfo, err := service.Userinfo.Get().Do()
	if err != nil {
		res := utils.BuildResponseFailed("Failed to get user info", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusInternalServerError, res)
		return
	}
	user, appToken, err := h.service.LoginOrRegisterWithGoogle(userInfo)
	if err != nil {
		res := utils.BuildResponseFailed("Failed to login or register with Google", err.Error(), utils.EmptyObj{})
		c.JSON(http.StatusBadRequest, res)
		return
	}

	cookieDomain := os.Getenv("COOKIE_DOMAIN")
	if cookieDomain == "" {
		cookieDomain = "localhost"
	}

	c.SetCookie(
		"Authorization", // Match standard auth cookie name
		appToken,
		3600*12, // 12 hours
		"/",
		cookieDomain,
		false, // Set to true in production
		true,
	)

	data := gin.H{
		"user":  user,
		"token": appToken,
	}

	res := utils.BuildResponseSuccess("Successfully logged in with Google", data)
	c.JSON(http.StatusOK, res)
}

func (h *handler) VerifyEmail(c *gin.Context) {
	var input struct {
		Email string `json:"email" binding:"required,email"`
		Code  string `json:"code" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		res := utils.BuildResponseFailed("Gagal verifikasi email", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	err := h.service.VerifyEmail(input.Email, input.Code)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal verifikasi email", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	res := utils.BuildResponseSuccess("Email berhasil diverifikasi", utils.EmptyObj{})
	c.JSON(200, res)
}

func (h *handler) ResendVerificationCode(c *gin.Context) {
	var input struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		res := utils.BuildResponseFailed("Input tidak valid", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	err := h.service.ResendVerificationCode(input.Email)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal mengirim ulang kode verifikasi", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	res := utils.BuildResponseSuccess("Kode verifikasi baru telah dikirim", utils.EmptyObj{})
	c.JSON(200, res)
}

func (h *handler) ForgotPassword(c *gin.Context) {
	var input dto.ForgotPasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		res := utils.BuildResponseFailed("Input tidak valid", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	err := h.service.ForgotPassword(input)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal mengirim kode reset password", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	res := utils.BuildResponseSuccess("Kode reset password telah dikirim ke email Anda", utils.EmptyObj{})
	c.JSON(200, res)
}

func (h *handler) ResetPassword(c *gin.Context) {
	var input dto.ResetPasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		res := utils.BuildResponseFailed("Input tidak valid", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	err := h.service.ResetPassword(input)
	if err != nil {
		res := utils.BuildResponseFailed("Gagal mereset password", err.Error(), utils.EmptyObj{})
		c.JSON(400, res)
		return
	}

	res := utils.BuildResponseSuccess("Password berhasil direset, silakan login kembali", utils.EmptyObj{})
	c.JSON(200, res)
}
