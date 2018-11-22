package web

import (
	"cryptoplay/app/controllers"

	"github.com/labstack/echo"
)

func Routing(e *echo.Echo) {
	e.GET("/", controllers.Index)
	e.GET("/users/:id", controllers.GetUser)
	e.GET("/market/btc/:timePeriod", controllers.GetBTCPLN)
	e.GET("/market/ltc/:timePeriod", controllers.GetLTCPLN)

}
