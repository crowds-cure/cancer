
// iffy wrapper
(function() {

const baseURL='http://rsnacrowdquant.cloudapp.net:5984';
const measurementsURL = baseURL + '/measurements';
const measurementsDB = new PouchDB(measurementsURL);
const chronicleURL = baseURL + '/chronicle';
const chronicleDB = new PouchDB(chronicleURL);

// document ready?
document.addEventListener("DOMContentLoaded", function(e) {

    measurementsDB.query('by/annotators', {
        reduce: true,
        group: true,
        level: 'exact',
    }).then (function(res) {

        var rows = res.rows;
        rows.sort(function(a, b) { return b.value - a.value; });
        populateLeaderBoard(rows);
    });

    measurementsDB.query('by/seriesUID', {
        reduce: true,
        group: true,
        level: 'exact',
    }).then (function(res) {

        var rows = res.rows;
        rows.sort(function(a, b) { return b.value - a.value; });
        populateHistogram(rows);

    });

});


function populateHistogram(rows) {

    var svg = d3.select('#annos-by-case-histogram');

    var data = rows.map(function(d) { return d.value; });

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr('width')- margin.left - margin.right,
        height = +svg.attr('height')- margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear()
              .range([0, width]);
              //.padding(0.1);

    var y = d3.scaleLinear()
              .range([height, 0]);

    var svgg = svg.append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // // format the data
    // data.forEach(function(d) {
    //   d.sales = +d.sales;
    // });

    // Scale the range of the data in the domains
    x.domain([0, data.length]);
    y.domain([0, d3.max(data)]);

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
      var axisBuffer = 5;
      svgg.append("g")
          .attr("transform", "translate(0," + (height + axisBuffer) + ")")
          .call(d3.axisBottom(x));
      //
      // // add the y Axis
      svgg.append("g")
          .call(d3.axisLeft(y))
          .attr('transform', 'translate (' + (-axisBuffer) + ', 0)');


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
