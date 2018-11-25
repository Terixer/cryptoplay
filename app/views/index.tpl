{{define "head"}}

{{end}}


{{define "content"}}
<div class="container-fluid p-0">
    <div class="progress"style="border-radius:0px">
        <div id="cryptoBar" data-state="0" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"></div>
    </div>
</div>
<div class="container">
    <div class="row">
        <div class="col-md-6" id="btc-container">
            <div class="row">
                <div class="col-md-12 mb-3 text-center">
                    <canvas id="BTCChart" width="400" height="400" data-period="90m"></canvas>
                    <div class="btn-group py-2" role="group">
                        <button class="btn btn-primary chart-button active" data-chart="BTCChart" data-period="90m">Minutowe</button>
                        <button class="btn btn-primary chart-button" data-chart="BTCChart" data-period="1d">Dzienne</button>
                        <button class="btn btn-primary chart-button" data-chart="BTCChart" data-period="1m" >Miesięczne</button>
                        <button class="btn btn-primary chart-button" data-chart="BTCChart" data-period="1y">Roczne</button>
                    </div>
                </div>
                <div class="col-md-6 my-3">
                    Kup BTC za: <strong id="btc-price-buy"></strong> PLN
                </div>
                <div class="col-md-6 my-3">
                    Sprzedaj BTC za: <strong id="btc-price-sell"></strong> PLN
                </div>
                 <div class="col-md-12">
                    <form id="btc-form" data-slug="btc">
                        <div class="form-row">
                            <div class="form-group col">
                              <div class="form-check">
                                    <input class="form-check-input" type="radio" name="btc-form-checkbox-sprzedaj"  id="btc-form-checkbox-sprzedaj" value="kupno" checked>
                                    <label class="form-check-label" for="btc-form-checkbox-sprzedaj">Kup</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="btc-form-checkbox-sprzedaj" id="btc-form-checkbox-sprzedaj" value="sprzedaż">
                                    <label class="form-check-label" for="btc-form-checkbox-sprzedaj">Sprzedaj</label>
                                </div>
                            </div>
                            <div class="form-group col-6">
                                    <label for="btc-form-ilosc" class="sr-only">Ilość</label>
                                    <input type="number" step="0.0001" class="form-control" id="btc-form-ilosc" placeholder="Ilość" required>
                            </div>
                            <div class="form-group col">
                                <button type="submit" class="btn btn-primary mb-2">Transakcja</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-md-4 my-3 ">
                            Posiadasz: <strong id="btc-amount-now">0</strong> BTC
                        </div>
                         <div class="col my-3 hide-fields">
                            Po transakcji będziesz posiadał: <strong id="btc-amount-future">0</strong> BTC
                        </div>
                    </div>
                </div>
                 <div class="col-md-12">
                    <div class="row">
                        <div class="col text-center my-3 hide-fields">
                            Po transakcji Twoje fundusze zmienią się o: <strong id="pln-btc-price">0</strong> PLN
                        </div>
                         <div class="col text-center my-3 hide-fields">
                            Po transakcji będziesz posiadał: <strong id="pln-btc-amount-future">0</strong> PLN
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6" id="ltc-container">
            <div class="row">
                <div class="col-md-12 mb-3 text-center">
                    <canvas id="LTCChart" width="400" height="400" data-period="90m"></canvas>
                    <div class="btn-group py-2" role="group">
                        <button class="btn btn-primary chart-button active" data-chart="LTCChart" data-period="90m">Minutowe</button>
                        <button class="btn btn-primary chart-button" data-chart="LTCChart" data-period="1d">Dzienne</button>
                        <button class="btn btn-primary chart-button" data-chart="LTCChart" data-period="1m" >Miesięczne</button>
                        <button class="btn btn-primary chart-button" data-chart="LTCChart" data-period="1y">Roczne</button>
                    </div>
                </div>
                <div class="col-md-6 my-3">
                    Kup LTC za: <strong id="ltc-price-buy"></strong> PLN
                </div>
                <div class="col-md-6 my-3">
                    Sprzedaj LTC za: <strong id="ltc-price-sell"></strong> PLN
                </div>
                <div class="col-md-12">
                    <form id="ltc-form" data-slug="ltc">
                        <div class="form-row">
                            <div class="form-group col">
                              <div class="form-check">
                                    <input class="form-check-input" type="radio" name="ltc-form-checkbox-sprzedaj"  id="ltc-form-checkbox-sprzedaj" value="kupno" checked>
                                    <label class="form-check-label" for="ltc-form-checkbox-sprzedaj">Kup</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="ltc-form-checkbox-sprzedaj" id="ltc-form-checkbox-sprzedaj" value="sprzedaż">
                                    <label class="form-check-label" for="ltc-form-checkbox-sprzedaj">Sprzedaj</label>
                                </div>
                            </div>
                            <div class="form-group col-6">
                                    <label for="ltc-form-ilosc" class="sr-only">Ilość</label>
                                    <input type="number" step="0.0001" class="form-control" id="ltc-form-ilosc" placeholder="Ilość" required>
                            </div>
                            <div class="form-group col">
                                <button type="submit" class="btn btn-primary mb-2">Transakcja</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-md-4 my-3 ">
                            Posiadasz: <strong id="ltc-amount-now">0</strong> LTC
                        </div>
                         <div class="col my-3 hide-fields">
                            Po transakcji będziesz posiadał: <strong id="ltc-amount-future">0</strong> LTC
                        </div>
                    </div>
                </div>
                 <div class="col-md-12">
                    <div class="row">
                        <div class="col text-center my-3 hide-fields">
                            Po transakcji Twoje fundusze zmienią się o: <strong id="pln-ltc-price">0</strong> PLN
                        </div>
                         <div class="col text-center my-3 hide-fields">
                            Po transakcji będziesz posiadał: <strong id="pln-ltc-amount-future">0</strong> PLN
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


{{end}}