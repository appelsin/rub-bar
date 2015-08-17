function respChart(selector, data, options) {

    // Define default option for line chart
    var option = {
        scaleOverlay: false,
        scaleOverride: false,
        scaleSteps: false,
        scaleStepWidth: false,
        scaleStartValue: false,
        scaleLineColor: "rgba(0,0,0,.1)",
        scaleLineWidth: 1,
        scaleShowLabels: true,
        scaleBeginAtZero: 1,
        scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        scaleFontSize: 10,
        scaleFontStyle: "normal",
        scaleFontColor: "#909090",
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: true,
        pointDot: true,
        pointDotRadius: 3,
        pointDotStrokeWidth: 1,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
        animation: false,
        animationSteps: 60,
        animationEasing: "easeOutQuart"
    };

    // check if the option is override to exact options
    // (bar, pie and other)
    if (options == false || options == null) {
        options = option;
    }

    // enable resizing matter
    $(window).resize(generateChart);

    function xinspect(o, i) {
        if (typeof i == 'undefined')i = '';
        if (i.length > 50)return '[MAX ITERATIONS]';
        var r = [];
        for (var p in o) {
            var t = typeof o[p];
            r.push(i + '"' + p + '" (' + t + ') => ' + o[p] );
        }
        return r.join(i + '\n');
    }

    // this function produce the responsive Chart JS
    function generateChart(new_data) {
        if(typeof new_data !== 'undefined' && new_data && new_data.type != 'resize'){
            data = new_data;
            $(selector).replaceWith('<canvas id="oil_chart" height="400"></canvas>');
        }

        var element = $(selector);

        // get selector by context
        var ctx = element.get(0).getContext("2d");
        // pointing parent container to make chart js inherit its width
        var container = $(element).parent();

        // make chart width fit with its container
        var ww = element.attr('width', $(container).width());
        // Initiate new chart or Redraw

        new Chart(ctx).Line(data, options);
    }

    // run function - render chart at first load
    generateChart();

    return generateChart;
}

function chart_from_ajax(data, slice) {
    slice = typeof slice !== 'undefined' ? slice : 30;

    var values_all = data.val.slice(-slice);
    var labels_all = data.time.slice(-slice);

    // skip if too much elements
    var skip = Math.floor(values_all.length/30);
    skip = skip < 1 ? 1 : skip;

    // getting elements to show starting from max date
    var values = [];
    var labels = [];
    for (var i = values_all.length-1; i >= 0 ; i = i - skip) {
        values.push(values_all[i]);
        labels.push(labels_all[i]);
    }

    // reverse it for past to future will be left to right in chart
    values.reverse();
    labels.reverse();

    var months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сент', 'окт', 'нояб', 'дек'];
    labels = $.map(labels, function (val, i) {
        var date = new Date(val * 1000);
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var day = date.getDate();
        return day + ' ' + month + ' ' + year;
    });

    return {
        labels: labels,
        datasets: [
            {
                label: "Rub/Bar Oil",
                fillColor: "rgba(171, 156, 178, 0.20)",
                strokeColor: "rgba(165, 156, 186, 1)",
                pointColor: "rgba(165, 156, 186, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(165, 156, 186, 1)",
                data: values
            }
        ]
    };
}
