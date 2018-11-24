package controllers

import (
	"cryptoplay/app/helpers"
	"fmt"
	"net/http"

	"github.com/labstack/echo"
)

func Index(c echo.Context) error {
	insert()
	return c.Render(http.StatusOK, "index", echo.Map{
		"title": "CRYPTOPLAY | STRONA GŁÓWNA",
		"add": func(a int, b int) int {
			return a + b
		},
	})
}

func insert() {

	db := DB
	stmt, err := db.Prepare("INSERT INTO userinfo(username, departname, created) values(?,?,?)")
	helpers.CheckErr(err)

	res, err := stmt.Exec("astaxie", "研发部门", "2012-12-09")
	helpers.CheckErr(err)

	id, err := res.LastInsertId()
	helpers.CheckErr(err)

	fmt.Println(id)

}
