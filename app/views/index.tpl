{{define "head"}}

{{end}}


{{define "content"}}
<div class="container">
    <div class="row">
        <div class="col-md-6">
            <div class="row">
                <div class="col-md-12">
                    <canvas id="BTCChart" width="400" height="400" data-period="90m"></canvas>
                    <button class="btn btn-primary chart-button" data-chart="BTCChart" data-period="90m">Minutowe</button>
                    <button class="btn btn-primary chart-button" data-chart="BTCChart" data-period="1d">Dzienne</button>
                    <button class="btn btn-primary chart-button" data-chart="BTCChart" data-period="1m" >Miesięczne</button>
                    <button class="btn btn-primary chart-button" data-chart="BTCChart" data-period="1y">Roczne</button>
                </div>
                <div class="col-md-6 my-3">
                    Kup BTC za: <span id="btc-amount-max"></span> PLN
                </div>
                <div class="col-md-6 my-3">
                    Sprzedaj BTC za: <span id="btc-amount-min"></span> PLN
                </div>
            </div>
            
        </div>
        <div class="col-md-6">
            <div class="row">
                <div class="col-md-12">
                    <canvas id="LTCChart" width="400" height="400" data-period="90m"></canvas>
                    <button class="btn btn-primary chart-button" data-chart="LTCChart" data-period="90m">Minutowe</button>
                    <button class="btn btn-primary chart-button" data-chart="LTCChart" data-period="1d">Dzienne</button>
                    <button class="btn btn-primary chart-button" data-chart="LTCChart" data-period="1m" >Miesięczne</button>
                    <button class="btn btn-primary chart-button" data-chart="LTCChart" data-period="1y">Roczne</button>
                </div>
                <div class="col-md-6 my-3">
                    Kup LTC za: <span id="ltc-amount-max"></span> PLN
                </div>
                <div class="col-md-6 my-3">
                    Sprzedaj LTC za: <span id="ltc-amount-min"></span> PLN
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <div class="progress">
                <div id="cryptoBar" data-state="0" class="progress-bar" role="progressbar"></div>
            </div>
        </div>
    </div>
    
</div>

{{end}}