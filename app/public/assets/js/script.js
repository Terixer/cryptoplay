const CRYPTO_DATA = 10
const TIMER_ID = "cryptoBar";
var mainInterval;
var BTC = {
    slug: 'btc',
    id: "BTCChart",
    containerId: "btc-container",
    json: [],
    time: [],
    sell: [],
    buy: [],
    last: null,
    chart: null,
    chartTitle: "BTC - PLN",
    amount: {
        min: "#btc-price-sell",
        max: "#btc-price-buy",
        nowCrypto: "#btc-amount-now",
        futureCrypto: "#btc-amount-future",
        transactionCost: "#pln-btc-price",
        afterTransaction: "#pln-btc-amount-future"
    },
    form: "btc-form",

}
var LTC = {
    slug: 'ltc',
    id: "LTCChart",
    containerId: "ltc-container",
    json: [],
    time: [],
    sell: [],
    buy: [],
    last: null,
    chart: null,
    chartTitle: "LTC - PLN",
    amount: {
        min: "#ltc-price-sell",
        max: "#ltc-price-buy",
        nowCrypto: "#ltc-amount-now",
        futureCrypto: "#ltc-amount-future",
        transactionCost: "#pln-ltc-price",
        afterTransaction: "#pln-ltc-amount-future"
    },
    form: "ltc-form"
}


$(document).ready(function () {
    timer(TIMER_ID);
    ChartGenerator(BTC);
    ChartGenerator(LTC);
    chartButtons([BTC, LTC]);
    amountInput([LTC, BTC]);
    makeTransaction([LTC, BTC])
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

        updateChartAmountTimerAndResetInterval(cryptoObjects);
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
                text: cryptoObject.chartTitle
            }
        }
    });

    updateChartAmountTimerAndResetInterval([BTC, LTC])
}

function updateChartAmountTimer(cryptoObjects) {
    refreshWallet();
    cryptoObjects.forEach(function (cryptoObject) {
        updateCryptoChart(cryptoObject);
        updateCryptoAmount(cryptoObject);
        refeshInput(cryptoObject);
    })

    resetTimer(TIMER_ID);
}

function updateChartAmountTimerAndResetInterval(cryptoObjects) {
    updateChartAmountTimer(cryptoObjects);
    clearInterval(mainInterval);
    mainInterval = setInterval(function () {
        updateChartAmountTimer(cryptoObjects);
    }, 60 * 1000);
}

function updateCryptoChart(cryptoObject) {
    cryptoObject.json = [];
    var period = $("#" + cryptoObject.id).attr("data-period");
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
    return $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
    });
}

function refreshWallet() {
    $.when(getTransactions()).done(function (transactions) {
        recountOwnMoney(transactions);
        recountOwnCrypto(transactions, [BTC, LTC])
    });
}

function recountOwnCrypto(transactions, cryptoObjects) {
    cryptoObjects.forEach(function (cryptoObject) {
        var crypto = 0;
        transactions.forEach(function (transaction) {
            if (transaction.coin == cryptoObject.slug) {
                crypto += parseFloat(transaction.coinAmount);
            }
        });
        $(cryptoObject.amount.nowCrypto).text(crypto.toFixed(2));
    });
}

function recountOwnMoney(transactions) {
    var money = 0
    transactions.forEach(function (transaction) {
        money += parseFloat(transaction.value);
    });
    $("#current-owned-money").text(money.toFixed(2));
}

function amountInput(cryptoObjects) {
    cryptoObjects.forEach(function (cryptoObject) {
        var inputs = $("#" + cryptoObject.form).find("input");
        inputs.on("input", function () {
            refeshInput(cryptoObject);
        });
    });
}

function hideFields(cryptoObject) {
    var numberInput = $("#" + cryptoObject.form).find("input[type='number']");
    if (isNaN(parseFloat(numberInput.val()))) {
        $("#" + cryptoObject.containerId).find(".hide-fields").addClass("hide");
    } else {
        $("#" + cryptoObject.containerId).find(".hide-fields").removeClass("hide");
    }
}

function refeshInput(cryptoObject) {
    hideFields(cryptoObject);
    var numberInput = $("#" + cryptoObject.form).find("input[type='number']");
    var cryptoPrice = null;
    var inputValue = null
    if ($("#" + cryptoObject.form).find("input[type='radio']:checked").val() == "sprzedaż") {
        cryptoPrice = parseFloat($(cryptoObject.amount.min).text());
        inputValue = parseFloat(numberInput.val());
    } else {
        cryptoPrice = parseFloat($(cryptoObject.amount.max).text());
        inputValue = -parseFloat(numberInput.val());
    }

    //FutureCrypto
    var nowCrypto = parseFloat($(cryptoObject.amount.nowCrypto).text());
    var futureCrypto = (nowCrypto + -inputValue).toFixed(2);
    futureCrypto = isNaN(futureCrypto) ? nowCrypto : futureCrypto
    $(cryptoObject.amount.futureCrypto).text(futureCrypto);

    //TransactionCost
    var newTransactionPrice = (cryptoPrice * inputValue).toFixed(2);
    newTransactionPrice = isNaN(newTransactionPrice) ? 0 : newTransactionPrice;
    $(cryptoObject.amount.transactionCost).text(newTransactionPrice);

    //AfterTransaction
    var currentMoney = $("#current-owned-money").text();
    var afterTransactionMoney = parseFloat(currentMoney) + parseFloat(newTransactionPrice);
    afterTransactionMoney = newTransactionPrice == 0 ? parseFloat(currentMoney) : afterTransactionMoney;
    $(cryptoObject.amount.afterTransaction).text(afterTransactionMoney);

    //checkTransactionAvailability
    checkTransactionAvailability(cryptoObject, afterTransactionMoney, futureCrypto)
}

function checkTransactionAvailability(cryptoObject, futureMoney, futureCrypto) {
    var numberInput = $("#" + cryptoObject.form).find("input[type='number']");
    var transactionButton = $("#" + cryptoObject.form).find("button");
    if (futureMoney < 0 || futureCrypto < 0 || isNaN(parseFloat(numberInput.val())) || numberInput.val() == 0) {
        transactionButton.addClass("disabled").prop("disabled", true);;
    } else {
        transactionButton.removeClass("disabled").prop("disabled", false);;
    }

}

function makeTransaction(cryptoObjects) {
    $("form").on("submit", function (e) {
        e.preventDefault();
        var formSlug = $(this).attr("data-slug");
        cryptoObjects.forEach(function (cryptoObject) {
            if (cryptoObject.slug == formSlug) {
                var coinAmount = $("#" + cryptoObject.form).find("input[type='number']").val();
                if ($("#" + cryptoObject.form).find("input[type='radio']:checked").val() == "sprzedaż") {
                    coinAmount *= -1
                }
                var data = {
                    'value': parseFloat($(cryptoObject.amount.transactionCost).text()),
                    'coin': cryptoObject.slug,
                    'coinAmount': coinAmount,
                    'transactionType': $("#" + cryptoObject.form).find("input[type='radio']:checked").val()
                };
                setTransaction(data);
            }
        });
    });
}

function setTransaction(data) {
    var url = "http://localhost:1323/transactions/set";
    return $.ajax({
        url: url,
        method: "POST",
        data: data,
        success: function (data) {
            $("input[type='number']").val("");
            updateChartAmountTimerAndResetInterval([BTC, LTC]);
            refreshWallet();
            swal(
                'Gratulacje!',
                'Transakcja przebiegła pomyślnie!',
                'success'
            )
        },
        error: function (data) {
            console.log("fail");
            console.log(data);
        }
    });
}

function getTransactions() {
    var url = "http://localhost:1323/transactions/get";
    return $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
    });
}