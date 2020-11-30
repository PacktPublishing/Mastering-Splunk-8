require([
    "splunkjs/mvc/searchmanager",
    "splunkjs/mvc/chartview",
    "splunkjs/mvc/simplexml/ready!"
], function(
   SearchManager,
   ChartView
) {

    // Set up search managers
    var search1 = new SearchManager({
        id: "example-search",
        search: "index=_internal | head 10000 | timechart count by bytes limit=10",
        preview: true,
        cache: true
    });

    var search2 = new SearchManager({
        id: "example-search-gauge",
        search: "index=_internal | stats count",
        earliest_time: "-15s",
        latest_time: "now",
        preview: true,
        cache: true
    });

    // Set up the charts
    barchart = new ChartView({
        id: "example-bar-chart",
        managerid: "example-search",
        "charting.chart.stackMode": "stacked",
        "charting.legend.placement": "bottom",
        type: "bar",
        el: $("#mybarchart")
    }).render();

    linechart = new ChartView({
        id: "example-chart-line",
        managerid: "example-search",
        type: "line",
        "charting.legend.placement": "bottom",
        el: $("#mylinechart")
    }).render();

    piechart = new ChartView({
        id: "example-chart-pie",
        managerid: "example-search",
        type: "pie",
        "charting.chart.showPercent": true,
        el: $("#mypiechart")
    }).render();

    areachart = new ChartView({
        id: "example-chart-area",
        managerid: "example-search",
        type: "area",
        el: $("#myareachart")
    }).render();

    scatterchart = new ChartView({
        id: "example-chart-scatter",
        managerid: "example-search",
        type: "scatter",
        el: $("#myscatterchart")
    }).render();

    columnchart = new ChartView({
        id: "example-chart-column",
        managerid: "example-search",
        type: "column",
        "charting.chart.stackMode": "stacked100",
        el: $("#mycolumnchart")
    }).render();

    fillergaugechart = new ChartView({
        id: "example-chart-fg",
        managerid: "example-search-gauge",
        type: "fillerGauge",
        el: $("#myfgchart")
    }).render();

    markergaugechart = new ChartView({
        id: "example-chart-mg",
        managerid: "example-search-gauge",
        type: "markerGauge",
        el: $("#mymgchart")
    }).render();

    radialgaugechart = new ChartView({
        id: "example-chart-rg",
        managerid: "example-search-gauge",
        type: "radialGauge",
        el: $("#myrgchart")
    }).render();

    // Respond to a click event on the bar chart
    barchart.on("click:chart", function (e) {
        e.preventDefault();
        console.log("Clicked chart: ", e);
    });

});