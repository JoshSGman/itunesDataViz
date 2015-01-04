
var _ = require('lodash');
var moment = require('moment');
var utility = require('./utility');
var GenrePie = require('./genre-pie');


var width = 960;
var height = 600;
var radius = Math.min(width, height) / 2;

var csv = false;
var formatted = [];

var genrePie;
var pieSvg = d3.select('.genre-pie-chart')
            .append('svg')
            .attr('height', height)
            .attr('width', width)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var availableYears = [];
var availableYearsSelect = document.querySelector('.available-years-select');
                  

d3.csv("../itunes.csv", function(err, data){
  
  csv = true;
  // Convert the data to camelCase
  formatted = data.map(function(d){ 
    var cased = utility.toCamelCase(d);
    cased.dateAdded = new Date(cased.dateAdded);
    cased.lastPlayed = cased.lastPlayed ? new Date(cased.lastPlayed) : null;
    return cased;
  });
  
  var byPlays = utility.groupByPlays(formatted);  
  var byLastPlayed = utility.groupByLastPlayed(formatted);
  var byDateAdded = utility.groupByDateAdded(formatted);

  availableYears = utility.grabAvailableYears(byDateAdded); 

  availableYears.forEach(function(y){
    var option = document.createElement('option');
    option.innerHTML = y;
    availableYearsSelect.appendChild(option);
  });

  genrePie = new GenrePie(pieSvg, formatted);
});


availableYearsSelect.addEventListener('change', function(e){
  var year = e.target.value;
  var filtered = utility.filterYear(formatted, year);  
  genrePie.update(pieSvg, filtered);
});










