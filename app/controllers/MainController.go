package controllers

import (
	"net/http"

	"github.com/labstack/echo"
)

func Index(c echo.Context) error {
	return c.Render(http.StatusOK, "index", echo.Map{
		"title": "CryptoPlay",
	})
}
