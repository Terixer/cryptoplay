package controllers

import (
	"cryptoplay/app/helpers"
	"net/http"

	"github.com/labstack/echo"
)

type transaction struct {
	Value           string `json:"value"`
	Coin            string `json:"coin"`
	CoinAmount      string `json:"coinAmount"`
	TransactionType string `json:"transactionType"`
}

func GetTransactions(c echo.Context) error {

	db := DB
	rows, err := db.Query("SELECT value,coin,coin_amount,transaction_type FROM transactions")
	helpers.CheckErr(err)
	transactions := []transaction{}
	for rows.Next() {
		s := transaction{}
		if err := rows.Scan(&s.Value, &s.Coin, &s.CoinAmount, &s.TransactionType); err != nil {
			return err
		}
		transactions = append(transactions, s)
	}

	for _, element := range transactions {
		if err := c.Bind(&element); err != nil {
			return err
		}
	}

	return c.JSON(http.StatusOK, transactions)
}

func SetTransaction(c echo.Context) error {

	db := DB

	t := new(transaction)
	if err := c.Bind(t); err != nil {
		return c.JSON(http.StatusBadRequest, "")
	}
	transactions, err := db.Prepare("INSERT INTO transactions(value, coin, coin_amount, transaction_type) values(?,?,?,?)")
	helpers.CheckErr(err)
	_, err = transactions.Exec(t.Value, t.Coin, t.CoinAmount, t.TransactionType)
	helpers.CheckErr(err)
	return c.JSON(http.StatusOK, 200)

}
