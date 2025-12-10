package utils

import "strconv"

type Response struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Error   any    `json:"error,omitempty"`
	Data    any    `json:"data,omitempty"`
	Meta    any    `json:"meta,omitempty"`
}

type EmptyObj struct{}

func BuildResponseSuccess(message string, data any) Response {
	res := Response{
		Status:  true,
		Message: message,
		Data:    data,
	}
	return res
}

func BuildResponseFailed(message string, err string, data any) Response {
	res := Response{
		Status:  false,
		Message: message,
		Error:   err,
		Data:    data,
	}
	return res
}

type PaginationMeta struct {
	CurrentPage int   `json:"current_page"`
	TotalPage   int   `json:"total_page"`
	TotalItems  int64 `json:"total_items"`
	Limit       int   `json:"limit"`
}

func BuildResponseWithPagination(message string, data any, meta PaginationMeta) Response {
	res := Response{
		Status:  true,
		Message: message,
		Data:    data,
		Meta:    meta,
	}
	return res
}

func StringToInt(str string) (int, error) {
	result, err := strconv.Atoi(str)
	if err != nil {
		return 0, err
	}
	return int(result), nil
}
