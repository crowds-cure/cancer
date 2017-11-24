
// iffy wrapper
(function() {

const baseURL='http://rsnacrowdquant.cloudapp.net:5984';
const measurementsURL = baseURL + '/measurements';
const measurementsDB = new PouchDB(measurementsURL);
const chronicleURL = baseURL + '/chronicle';
const chronicleDB = new PouchDB(chronicleURL);

// document ready?
document.addEventListener("DOMContentLoaded", function(e) {


    populateLeaderBoard();

});

function populateLeaderBoard() {

    measurementsDB.query('by/annotators', {
        reduce: true,
        group: true,
        level: 'exact',
    }).then (function(res) {

        var rows = res.rows;
        rows.sort(function(a, b) { return b.value - a.value; });

        d3.select('.leaderboard .annotator-count')
            .text(rows.length);

        displayTopAnnotators(rows);
    });

}

function displayTopAnnotators(rows) {
    var topAnnotatorCt = 10; // top N
    var topAnnotators = d3.select('.top-annotators');
    var annotatorContainer = topAnnotators.selectAll('.annotator')
        .data(rows)
      .enter()
      .filter(function(d, i) { return i < topAnnotatorCt; })
        .append('div')
        .classed('annotator', true);

    annotatorContainer
        .append('text')
        .text(function(d) {
            return d.key ? d.key : '< null >';
        });

    annotatorContainer
        .append('text')
        .text(function(d){
            return d.value;
        });
}


})(); // end iffy
