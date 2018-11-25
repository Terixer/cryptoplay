package web

import (
	"cryptoplay/app/controllers"

	"github.com/labstack/echo"
)

func Routing(e *echo.Echo) {
	e.GET("/", controllers.Index)
	e.GET("/market/btc/:timePeriod", controllers.GetBTCPLN)
	e.GET("/market/ltc/:timePeriod", controllers.GetLTCPLN)
	e.GET("/transactions/get", controllers.GetTransactions)
	e.POST("/transactions/set", controllers.SetTransaction)

}
