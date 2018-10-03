
// iffy wrapper
(function() {

const baseURL='http://rsnacrowdquant2.eastus2.cloudapp.azure.com:5984';
const measurementsURL = baseURL + '/measurements';
const measurementsDB = new PouchDB(measurementsURL);
const chronicleURL = baseURL + '/chronicle';
const chronicleDB = new PouchDB(chronicleURL);

document.addEventListener("DOMContentLoaded", function(e) {

    Promise.all([
        measurementsDB.query('by/annotators', {
            reduce: true,
            group: true,
            level: 'exact',
        }),
        measurementsDB.query('by/seriesUID', {
            reduce: true,
            group: true,
            level: 'exact'
        }),
        chronicleDB.query('instances/bySeriesUID', {
            reduce: true,
            group: true,
            level: 'exact'
        })
    ])
    .then (function(res) {

        var measByAnno = res[0].rows;
        var measBySeries = res[1].rows;
        var seriesInfo = res[2].rows;

        measByAnno.sort(function(a, b) { return b.value - a.value; });
        measBySeries.sort(function(a, b) { return b.value - a.value; });
        var catBySeries = seriesInfo.reduce(function(a, c) {
            a[c.key[0]] = c.key[1];
            return a;
        }, {});

        populateLeaderBoard(measByAnno);
        populateHistogram(measBySeries);
        populateAnnotationPerCategory(measBySeries, catBySeries);

    });

});


function populateAnnotationPerCategory(measBySeries, catBySeriesMap) {

    var svg = d3.select('#annos-by-category');

    var allCategories = {
        'TCGA-LUAD' : 'Lung',
        'TCGA-LIHC' : 'Liver',
        'TCGA_RN' : 'Renal',
        'TCGA_OV' : 'Ovarian'
    };

    var catMap = {};
    measBySeries.forEach(function(m) {
        m.category = catBySeriesMap[m.key];
        if (!catMap[m.category]) {
            catMap[m.category] = 0;
        }
        catMap[m.category]++;
    });

    var margin = {top: 60, right: 40, bottom: 30, left: 60},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    svg.append('g')
        .attr('transform', 'translate(40, 30)')
        .append('text')
        .text('Annotations per Category');

    var svgg = svg.append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1)
        .align(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    x.domain(Object.keys(catMap));
    y.domain([0, d3.max(Object.values(catMap))]).nice();

    svgg.selectAll(".bar")
      .data(d3.entries(catMap))
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

    svgg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(function(t) { return allCategories[t];}))
        .select(".domain").remove();

    svgg.append("g")
        .attr("class", "y axis")
        .attr('transform', 'translate (' + (-10) + ', 0)')
        .call(d3.axisLeft(y).tickSize(-width-20));
}

function populateHistogram(rows) {

    var svg = d3.select('#annos-by-case-histogram');

    var data = rows.map(function(d) { return d.value; });

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear()
              .range([0, width]);
              //.padding(0.1);

    var y = d3.scaleLinear()
              .range([height, 0]);

    var svgg = svg.append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain([0, data.length]);
    y.domain([0, d3.max(data)]).nice();

    // append the rectangles for the bar chart
    svgg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) { return x(i); })
      .attr("width", 2)
      .attr("y", function(d) { return y(d); })
      .attr("height", function(d) { return height - y(d); });

      // add the x Axis
      var axisBuffer = 10;
      svgg.append("g")
          .attr("transform", "translate(0," + (height + axisBuffer) + ")")
          .call(d3.axisBottom(x));

      // // add the y Axis
      svgg.append("g")
          .attr('transform', 'translate (' + (-axisBuffer) + ', 0)')
          .call(d3.axisLeft(y));
}

function populateLeaderBoard(rows) {

    d3.select('.leaderboard .annotator-count')
            .text(rows.length);

    displayTopAnnotators(rows, 10);
}

function displayTopAnnotators(rows, numToDisplay) {

    var topAnnotators = d3.select('.top-annotators');

    var annotatorContainers = topAnnotators.selectAll('.annotator')
        .data(rows)
      .enter()
      .filter(function(d, i) { return i < numToDisplay; })
        .append('div')
        .classed('annotator', true);

    annotatorContainers
        .append('text')
        .text(function(d) {
            return d.key ? d.key : '< null >';
        });

    annotatorContainers
        .append('text')
        .text(function(d){
            return d.value;
        });
}


})(); // end iffy
