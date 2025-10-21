package dto

type UserCreate struct {
	Nama							string			`json:"name" binding:"omitempty"`
	Email							string			`json:"email" binding:"requred,email"`
	Password					string 			`json:"password" binding:"required"`
	ProfileImage			string 			`json:"profile_image,omitempty" binding:"required,min=8"`
}

type UserRead struct {
	Nama							string			`json:"name"`
	Email							string			`json:"email"`
	Password					string 			`json:"password"`
	ProfileImage			string 			`json:"profile_image"`
}

type UserUpdate struct {
	Nama							string			`json:"name" binding:"omitempty"`
	Email							string			`json:"email" binding:"omitempty,email"`
	Password					string 			`json:"password" binding:"omitempty"`
	ProfileImage			string 			`json:"profile_image,omitempty" binding:"omitempty,min=8"`
}

type UserDelete struct {
	ID								uint				`json:"id" binding:"required"`
}