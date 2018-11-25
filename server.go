package main

import (
	"cryptoplay/app/controllers"
	"cryptoplay/app/helpers"
	"cryptoplay/web"
	"database/sql"
	"fmt"
	"time"

	echotemplate "github.com/foolin/echo-template"
	"github.com/labstack/echo"
	_ "github.com/mattn/go-sqlite3"
	"github.com/vjeantet/jodaTime"
)

var db *sql.DB

func main() {
	db, _ = sql.Open("sqlite3", "./database/main.db")
	createTables()
	addDefaultData()
	controllers.DB = db
	port := "1323"
	echoFramework := echo.New()
	echoFramework.Static("/assets", "app/public/assets")
	echoFramework.Debug = true
	echoFramework.Renderer = echotemplate.New(echotemplate.TemplateConfig{
		Root:         "app/views",
		Extension:    ".tpl",
		Master:       "layouts/master",
		DisableCache: true,
	})

	web.Routing(echoFramework)

	fmt.Println("------------------")
	fmt.Println(jodaTime.Format("H:m:s", time.Now()))
	echoFramework.Logger.Fatal(echoFramework.Start(":" + port))
}

func createTables() {
	drop, err := db.Prepare("DROP TABLE `transactions`")
	helpers.CheckErr(err)
	drop.Exec()
	transactions, err := db.Prepare("CREATE TABLE IF NOT EXISTS `transactions` (`id` INTEGER PRIMARY KEY AUTOINCREMENT,`value` FLOAT, `coin` VARCHAR(64), `coin_amount` FLOAT,`transaction_type` VARCHAR(64));")
	helpers.CheckErr(err)
	transactions.Exec()
}
func addDefaultData() {
	transactions, err := db.Prepare("INSERT INTO transactions(value, coin, coin_amount, transaction_type) values(?,?,?,?)")
	helpers.CheckErr(err)
	_, err = transactions.Exec("50000", "", "", "default")
	helpers.CheckErr(err)
}
