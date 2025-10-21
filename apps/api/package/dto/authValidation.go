package dto

type UserRegister struct {
	Name 								string 			`json:"name" binding:"required"`
	Email								string 			`json:"email" binding:"required,email"`
	Password						string 			`json:"password" binding:"required,min=8"`
}

type UserLogin struct {
	Email								string 			`json:"email" binding:"required,email"`
	Password						string 			`json:"password" binding:"required,min=8"`
}