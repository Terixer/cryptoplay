package web

import (
	"cryptoplay/controllers"

	"github.com/labstack/echo"
)

func Routing(e *echo.Echo) {
	e.GET("/", controllers.Index)
	e.GET("/users/:id", controllers.GetUser)
}
