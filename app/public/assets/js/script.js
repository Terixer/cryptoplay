const CRYPTO_DATA = 10
const TIMER_ID = "cryptoBar";
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
        min: "#btc-price-sell",
        max: "#btc-price-buy"
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
        min: "#ltc-price-sell",
        max: "#ltc-price-buy"
    }
}


$(document).ready(function () {
    timer(TIMER_ID);
    ChartGenerator(BTC);
    ChartGenerator(LTC);
    chartButtons([BTC, LTC]);
});

function timer(id) {
    var cryptoBar = $("#" + id);
    setInterval(function () {

        var state = parseFloat(cryptoBar.attr("data-state"));
        if (state <= 60) {
            state += 1;
            if (state <= 30) {
                cryptoBar.removeClass("bg-danger");
                cryptoBar.addClass("bg-info");
            } else if (state <= 50) {
                cryptoBar.removeClass("bg-info");
                cryptoBar.addClass("bg-warning");
            } else {
                cryptoBar.removeClass("bg-warning");
                cryptoBar.addClass("bg-danger");
            }
            cryptoBar.text((60 - state) + "s");
            cryptoBar.attr("data-state", parseFloat(state));
            cryptoBar.css("width", parseFloat(state) / 60 * 100 + "%")
        }

    }, 1000);
}

function chartButtons(cryptoObjects) {
    $(".chart-button").on("click", function () {
        var chartId = $(this).attr("data-chart");
        $(".chart-button[data-chart=" + chartId + "]").removeClass("active");
        $(this).addClass("active");
        var period = $(this).attr("data-period");
        $("#" + chartId).attr("data-period", period);
        var object = null;
        for (var i = 0; i < cryptoObjects.length; i++) {
            if (cryptoObjects[i].id == chartId) {
                object = cryptoObjects[i]
            }
        }

        updateChartAmountTimer(object);
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

    updateChartAmountTimer(cryptoObject);
    setInterval(function () {
        updateChartAmountTimer(cryptoObject);
    }, 60 * 1000);
}

function updateChartAmountTimer(cryptoObject) {
    updateCryptoChart(cryptoObject);
    updateCryptoAmount(cryptoObject);
    resetTimer(TIMER_ID);
}

function updateCryptoChart(cryptoObject) {
    cryptoObject.json = [];
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
        console.log(cryptoObject.json);
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

function resetTimer(id) {
    $("#" + id).attr("data-state", 0);
}

function updateCryptoAmount(cryptoObject) {
    $.when(getMarket(cryptoObject.slug, "90m")).done(function (data) {
        cryptoObject.last = JSON.parse(data)[89];
        $(cryptoObject.amount.min).text(parseInt(cryptoObject.last.low));
        $(cryptoObject.amount.max).text(parseInt(cryptoObject.last.high));
    });
}

function getMarket(type, period) {
    var url = "http://localhost:1323/market/" + type + "/" + period;
    console.log(url);
    return $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
    });
}