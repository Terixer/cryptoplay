package controllers

import (
	"net/http"

	"github.com/labstack/echo"
)

func GetUser(c echo.Context) error {
	id := c.Param("id")
	return c.Render(http.StatusOK, "users", echo.Map{
		"id": id,
	})
}
