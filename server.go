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
	CreateTables()
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

func CreateTables() {
	statement, err := db.Prepare("CREATE TABLE IF NOT EXISTS `userinfo` (`uid` INTEGER PRIMARY KEY AUTOINCREMENT,`username` VARCHAR(64) NULL, `departname` VARCHAR(64) NULL, `created` DATE NULL);")
	helpers.CheckErr(err)
	statement.Exec()
}
