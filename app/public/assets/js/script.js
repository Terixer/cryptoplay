const CRYPTO_DATA = 10

var btcChart = null;
var ltcChart = null;

$(document).ready(function () {
    timer()
    BTCGenerator();
    LTCGenerator();

});

function timer() {
    setInterval(function () {
        var state = parseInt($("#cryptoBar").attr("data-state"));
        state += 1;
        if (state == 10) {
            state = 0
        }
        $("#cryptoBar").attr("data-state", parseInt(state));
        $("#cryptoBar").css("width", parseInt(state) * 10 + "%")
        console.log(state);
    }, 6000);
}


function BTCGenerator() {

    var BTClineChartData = {
        labels: BTC.time,
        datasets: [{
            label: 'Kwota sprzedaży',
            borderColor: "blue",
            backgroundColor: "blue",
            fill: false,
            data: BTC.sell
        }, {
            label: 'Kwota kupna',
            borderColor: "red",
            backgroundColor: "red",
            fill: false,
            data: BTC.buy
        }]
    };

    var ctx = document.getElementById("BTCChart").getContext('2d');
    btcChart = new Chart(ctx, {
        type: 'line',
        data: BTClineChartData,
        options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            title: {
                display: true,
                text: 'BTC - PLN'
            }
        }
    });

    updateCrypto("btc", btcChart, "90m", false, true, BTC);
    setInterval(function () {
        updateCrypto("btc", btcChart, "90m", false, true, BTC);
    }, 60000);

}


function LTCGenerator() {

    var LTClineChartData = {
        labels: LTC.time,
        datasets: [{
            label: 'Kwota sprzedaży',
            borderColor: "blue",
            backgroundColor: "blue",
            fill: false,
            data: LTC.sell
        }, {
            label: 'Kwota kupna',
            borderColor: "red",
            backgroundColor: "red",
            fill: false,
            data: LTC.buy
        }]
    };

    var ctx = document.getElementById("LTCChart").getContext('2d');
    ltcChart = new Chart(ctx, {
        type: 'line',
        data: LTClineChartData,
        options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            title: {
                display: true,
                text: 'LTC - PLN'
            }
        }
    });

    updateCrypto("ltc", ltcChart, "90m", false, true, LTC);
    setInterval(function () {
        updateCrypto("ltc", ltcChart, "90m", false, true, LTC);
    }, 60000);

}

function updateCrypto(crypto, chart, periot, date, hour, cryptoObject) {
    $.when(getMarket(crypto, periot)).done(function (data) {
        cryptoObject.json = JSON.parse(data).slice(-CRYPTO_DATA);
        moment.locale('pl');
        var dateFormat = (date == true) ? "L " : " ";
        dateFormat += (hour == true) ? "LT " : " ";
        for (i = 0; i < CRYPTO_DATA; i++) {
            cryptoObject.time[i] = moment.unix(cryptoObject.json[i].time).format(dateFormat);
            cryptoObject.sell[i] = parseInt(cryptoObject.json[i].low);
            cryptoObject.buy[i] = parseInt(cryptoObject.json[i].high);
        }
        chart.update();
    });
}

function getMarket(type, periot) {

    return $.ajax({
        url: "http://localhost:1323/market/" + type + "/" + periot,
        method: "GET",
        dataType: "json",
    });
}

var BTC = {
    json: null,
    time: [],
    sell: [],
    buy: []
}
var LTC = {
    json: null,
    time: [],
    sell: [],
    buy: []
}