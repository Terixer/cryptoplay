package main

import (
	"cryptoplay/web"
	"fmt"
	"time"

	"github.com/foolin/echo-template"
	"github.com/labstack/echo"
	"github.com/vjeantet/jodaTime"
)

func main() {
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
