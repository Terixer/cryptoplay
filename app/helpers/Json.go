package helpers

import (
	"io/ioutil"
	"net/http"
)

func GetJsonFromUrl(url string) string {
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	// do this now so it won't be forgotten
	defer resp.Body.Close()
	// reads html as a slice of bytes
	html, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	// show the HTML code as a string %s
	return string(html)
}
