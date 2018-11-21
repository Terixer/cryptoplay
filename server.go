package main

import (
	"cryptoplay/web"
	"html/template"
	"io"

	"github.com/labstack/echo"
)

type Template struct {
	templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

func main() {
	echoFramework := echo.New()
	echoFramework.Debug = true
	renderer := &Template{
		templates: template.Must(template.ParseGlob("public/views/*")),
	}
	echoFramework.Renderer = renderer
	web.Routing(echoFramework)
	echoFramework.Logger.Fatal(echoFramework.Start(":1323"))
}
