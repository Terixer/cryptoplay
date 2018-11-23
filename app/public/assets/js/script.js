const CRYPTO_DATA = 10

var BTC = {
    slug: 'btc',
    id: "BTCChart",
    json: [],
    time: [],
    sell: [],
    buy: [],
    last: null,
    chart: null,
    chartTitle: "BTC - PLN",
    amount: {
        min: "#btc-amount-min",
        max: "#btc-amount-max"
    }
}
var LTC = {
    slug: 'ltc',
    id: "LTCChart",
    json: [],
    time: [],
    sell: [],
    buy: [],
    last: null,
    chart: null,
    chartTitle: "LTC - PLN",
    amount: {
        min: "#ltc-amount-min",
        max: "#ltc-amount-max"
    }
}


$(document).ready(function () {
    timer()
    ChartGenerator(BTC);
    ChartGenerator(LTC);
    chartButtons();
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
    }, 6000);
}

function chartButtons() {
    $(".chart-button").on("click", function () {
        var chartId = $(this).attr("data-chart");
        var period = $(this).attr("data-period");
        $("#" + chartId).attr("data-period", period);
        var object = null;
        if (BTC.id == chartId) {
            object = BTC;
        } else if (LTC.id == chartId) {
            object = LTC;
        }
        updateCryptoChart(object);
    })
}

function ChartGenerator(cryptoObject) {

    var chartOptions = {
        labels: cryptoObject.time,
        datasets: [{
            label: 'Kwota sprzedaży',
            borderColor: "blue",
            backgroundColor: "blue",
            fill: false,
            data: cryptoObject.sell
        }, {
            label: 'Kwota kupna',
            borderColor: "red",
            backgroundColor: "red",
            fill: false,
            data: cryptoObject.buy
        }]
    };

    var ctx = document.getElementById(cryptoObject.id).getContext('2d');
    cryptoObject.chart = new Chart(ctx, {
        type: 'line',
        data: chartOptions,
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

    updateCryptoChart(cryptoObject);
    updateCryptoAmount(cryptoObject);
    setInterval(function () {
        updateCryptoChart(cryptoObject);
        updateCryptoAmount(cryptoObject);
    }, 60000);
}

function updateCryptoChart(cryptoObject) {
    var period = $("#" + cryptoObject.id).attr("data-period");
    console.log(period)
    $.when(getMarket(cryptoObject.slug, period)).done(function (data) {
        if (period == "90m") {
            cryptoObject.json = JSON.parse(data).slice(-CRYPTO_DATA);
        } else {
            Object.keys(JSON.parse(data)).forEach(function (key) {
                var currentKey = parseInt(key);
                if (((currentKey + 1) % 9) == 0 || currentKey == 0) {
                    cryptoObject.json.push(JSON.parse(data)[key]);

                }
            });
        }
        moment.locale('pl');
        var dateFormat = "";
        switch (period) {
            case "90m":
                dateFormat = "LT"
                break;
            case "1d":
                dateFormat = "L LT"
                break;
            default:
                dateFormat = "L"
                break;
        }
        for (i = 0; i < CRYPTO_DATA; i++) {
            cryptoObject.time[i] = moment.unix(cryptoObject.json[i].time).format(dateFormat);
            cryptoObject.sell[i] = parseInt(cryptoObject.json[i].low);
            cryptoObject.buy[i] = parseInt(cryptoObject.json[i].high);
        }
        cryptoObject.chart.update();
    });
}

function updateCryptoAmount(cryptoObject) {
    $.when(getMarket(cryptoObject.slug, "90m")).done(function (data) {
        cryptoObject.last = JSON.parse(data)[89];
        $(cryptoObject.amount.min).text(parseInt(cryptoObject.last.low));
        $(cryptoObject.amount.max).text(parseInt(cryptoObject.last.high));
    });
}

function getMarket(type, period) {
    return $.ajax({
        url: "http://localhost:1323/market/" + type + "/" + period,
        method: "GET",
        dataType: "json",
    });
}