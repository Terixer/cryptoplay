package controllers

import (
	"cryptoplay/app/helpers"

	"github.com/labstack/echo"
)

func GetLTCPLN(c echo.Context) error {
	timePeriod := c.Param("timePeriod")
	url := "https://www.bitmarket.pl/graphs/LTCPLN/" + timePeriod + ".json"
	val := helpers.GetJsonFromUrl(url)

	return c.JSON(200, val)
}
