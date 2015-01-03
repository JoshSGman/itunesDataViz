
var _ = require('lodash');
var moment = require('moment');
var utility = require('./utility');
var GenrePie = require('./genre-pie');


var width = 960;
var height = 600;
var radius = Math.min(width, height) / 2;


var svg = d3.select('body')
            .append('svg')
            .attr('height', height)
            .attr('width', width)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                  

d3.csv("../itunes.csv", function(err, data){
  
  // Convert the data to camelCase  
  var formatted = data.map(function(d){ 
    var cased = utility.toCamelCase(d);
    cased.dateAdded = new Date(cased.dateAdded);
    cased.lastPlayed = cased.lastPlayed ? new Date(cased.lastPlayed) : null;
    return cased;
  });
  
  var byPlays = utility.groupByPlays(formatted);  
  var byLastPlayed = utility.groupByLastPlayed(formatted);
  var byDateAdded = utility.groupByDateAdded(formatted);

  var genrePie = new GenrePie(svg, formatted);

});







