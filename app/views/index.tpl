{{define "head"}}

{{end}}


{{define "content"}}
<div class="container">
    <div class="row">
        <div class="col-md-6">
            <canvas id="BTCChart" width="400" height="400"></canvas>
        </div>
        <div class="col-md-6">
            <canvas id="LTCChart" width="400" height="400"></canvas>
        </div>
        <div class="col-md-12">
            <div class="progress">
                <div id="cryptoBar" data-state="0" class="progress-bar" role="progressbar"></div>
            </div>
        </div>
    </div>
    
</div>

{{end}}