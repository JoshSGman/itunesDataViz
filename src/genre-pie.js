
var numeral = require('numeral');

var Colors = require('./colors');
var Utility = require('./utility');
var colors = Colors.palette();

// Genres
var genres = {
  "Alternative" : [
    "College Rock",
    "Goth Rock",
    "Grunge",
    "Indie Rock",
    "New Wave",
    "Punk",
  ], 
  "Blues" : [
    "Chicago Blues",
    "Classic Blues",
    "Contemporary Blues",
    "Country Blues",
    "Delta Blues",
    "Electric Blues",
    "Acoustic Blues"
  ],
  "Childrens' Music" : [],
  "Christian & Gospel" : [],
  "Classical" : [
    "Avant-Garde",
    "Baroque",
    "Chamber Music",
    "Chant",
    "Choral",
    "Classical Crossover",
    "Early Music",
    "Impressionist",
    "Medieval",
    "Minimalism",
    "Modern Composition",
    "Opera",
    "Orchestral",
    "Renaissance",
    "Romantic",
    "Wedding Music",
    "High Classical"
  ],
  "Comedy" : [
    "Novelty",
    "Standup Comedy"
  ], 
  "Country" : [
    "Alternative Country",
    "Americana",
    "Bluegrass",
    "Contemporary Bluegrass",
    "Contemporary Country",
    "Country Gospel",
    "Honky Tonk",
    "Outlaw Country",
    "Traditional Bluegrass",
    "Traditional Country",
    "Urban Cowboy"
  ],
  "Dance" : [
    "Breakbeat",
    "Exercise",
    "Garage",
    "Hardcore",
    "House",
    "Jungle/Drum’n’bass",
    "Techno",
    "Trance"
  ],
  "Electronic" : [
    "Ambient",
    "Downtempo",
    "Electronica",
    "IDM/Experimental",
    "Industrial"
  ],
  "Essentials" : [],
  "Fitness & Workout" : [],
  "Greatest Hits" : [],
  "Hip-Hop/Rap" : [  
    "Alternative Rap",
    "Dirty South",
    "East Coast Rap",
    "Gangsta Rap",
    "Hardcore Rap",
    "Hip-Hop",
    "Latin Rap",
    "Old School Rap",
    "Rap",
    "Underground Rap",
    "West Coast Rap",        
  ],
  "Holiday" : [
    "Chanukah",
    "Christmas",
    "Christmas: Children’s",
    "Christmas: Classic",
    "Christmas: Classical",
    "Christmas: Jazz",
    "Christmas: Modern",
    "Christmas: Pop",
    "Christmas: R&B",
    "Christmas: Religious",
    "Christmas: Rock",
    "Easter",
    "Halloween",
    "Holiday: Other",
    "Thanksgiving"
  ],
  "New Artists" : [],
  "Jazz" : [
    "Big Band",
    "Avant-Garde Jazz",
    "Contemporary Jazz",
    "Crossover Jazz",
    "Dixieland",
    "Fusion",
    "Latin Jazz",
    "Mainstream Jazz",
    "Ragtime",
    "Smooth Jazz",
    "Hard Bop",
    "Trad Jazz",
    "Cool"
  ],
  "Latino" : [
    "Latin",
    "Latin Jazz",
    "Contemporary Latin",
    "Pop Latino",
    "Raíces",
    "Reggaeton y Hip-Hop",
    "Baladas y Boleros",
    "Alternativo & Rock Latino",
    "Regional Mexicano",
    "Salsa y Tropical"
  ],
  "Live Music" : [],
  "Metal" : [
    "Death Metal/Black Metal",
    "Hair Metal",
    "Metal"
  ],
  "Pop" : [
    "Adult Contemporary",
    "Britpop",
    "Pop/Rock",
    "Soft Rock",
    "Teen Pop"
  ],
  "R&B/Soul" : [
    "Contemporary R&B",
    "Disco",
    "Doo Wop",
    "Funk",
    "Motown",
    "Neo-Soul",
    "Quiet Storm",
    "Soul"
  ],
  "Reggae" : [
    "Dancehall",
    "Roots Reggae",
    "Dub",
    "Ska"
  ],
  "Rock" : [
    "Adult Alternative",
    "American Trad Rock",
    "Arena Rock",
    "Blues-Rock",
    "British Invasion",    
    "Glam Rock",    
    "Hard Rock",    
    "Jam Bands",
    "Prog-Rock/Art Rock",
    "Psychedelic",
    "Rock & Roll",
    "Rockabilly",
    "Roots Rock",
    "Singer/Songwriter",
    "Southern Rock",
    "Surf",
    "Tex-Mex"
  ],
  "Singer/Songwriter" : [],
  "Soundtrack" : [
    "Foreign Cinema",
    "Musicals",
    "Original Score",
    "Soundtrack",
    "TV Soundtrack"
  ],
  "World" : [
    "Afro-Beat",
    "Afro-Pop",
    "Cajun",
    "Celtic",
    "Celtic Folk",
    "Contemporary Celtic",
    "Drinking Songs",
    "Indian Pop",
    "Japanese Pop",
    "Klezmer",
    "Polka",
    "Traditional Celtic",
    "Worldbeat",
    "Zydeco",
    "Caribbean",
    "South America",
    "Middle East",
    "North America",
    "Hawaii",
    "Australia",
    "Japan",
    "France",
    "Africa",
    "Asia",
    "Europe",
    "South Africa"
  ]
};

var width = 960;
var height = 600;
var radius = Math.min(width, height) / 2;

var formattedGenres = Utility.formatGenres(genres);

var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 60);   

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      var key = Object.keys(d)[0];      
      return d[key].length;      
    });

var totalSeconds = 1500;

var GenrePie = function(svg, data){

  var byGenre = Utility.groupByGenre(data, formattedGenres);

  var totalSongs = byGenre.reduce(function(total, g){
    var key = Object.keys(g)[0];
    return total += g[key].length;
  }, 0);

  var accruedSeconds = 0;

  this.g = svg.selectAll(".arc")
      .data(pie(byGenre))
      .enter().append("g")
      .attr("class", "arc");

  this.path = this.g.append("path")      
                  .attr('class', 'arcs')
                  .attr("stroke", "white")
                  .style("fill", function(d) {          
                    return colors(d.value); 
                  })
                  .transition()
                  .delay(function(d, i) {
                    var accrued = accruedSeconds;
                    accruedSeconds += (d.value / totalSeconds) * totalSeconds;
                    return accrued; 
                  })
                  .duration(function(d, i){
                    return (d.value / totalSeconds) * totalSeconds; 
                  })
                  .attrTween('d', function(d) {
                       var i = d3.interpolate(d.startAngle, d.endAngle);
                       return function(t) {
                           d.endAngle = i(t);
                         return arc(d);
                       };
                  });

  this.g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .attr('class', 'arc-text')
      .style("text-anchor", "middle")
      .text(function(d) {   
        var percent = d.value / totalSongs * 100;        
        return percent > 4 ? d.value : ""; 
      });


  var legendRectSize = 10;
  var legendSpacing = 5;

  this.legend = svg.selectAll('.pie-legend')
                  .data(byGenre)
                  .enter()
                  .append('g')
                  .attr('class', 'pie-legend')
                  .attr('transform', function(d, i){                    
                    var horz = -1.8 * legendRectSize;
                    return 'translate(' + horz + ', -1000)';
                  });

  this.legend
    .append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function(d){         
      var key = Object.keys(d)[0];
      return colors(d[key].length); 
    })
    .style('stroke', 'white'); 

  this.legend
    .append('text')
    .attr('class', 'pie-legend-text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing + 5)
    .text(function(d) { 
      var key = Object.keys(d)[0];

      var percent = numeral(d[key].length / totalSongs).format('0.00%');
      return key.toUpperCase() + ' - ' + percent; 
    }); 

  this.legend
    .transition()
    .delay(function(d, i) {      
      return i * totalSeconds/byGenre.length; 
    })
    .duration(function(){
      return totalSeconds/byGenre.length;
    })         
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * colors.domain().length / 1.65;
      var horz = -6 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });

};

GenrePie.prototype.update = function(svg, data){

  var accruedSeconds = 0;

  var byGenre = Utility.groupByGenre(data, formattedGenres);

  var totalSongs = byGenre.reduce(function(total, g){
    var key = Object.keys(g)[0];
    return total += g[key].length;
  }, 0);


  this.g.remove();

  this.g = svg.selectAll(".arc")
      .data(pie(byGenre))
      .enter().append("g")
      .attr("class", "arc");

  this.path = this.g.append("path")      
                  .attr('class', 'arcs')
                  .attr("stroke", "white")
                  .style("fill", function(d) {          
                    return colors(d.value); 
                  })
                  .transition()
                  .delay(function(d, i) {
                    var accrued = accruedSeconds;
                    accruedSeconds += d.value / totalSongs * totalSeconds;
                    return accrued; 
                  })
                  .duration(function(d, i){
                    return d.value / totalSongs * totalSeconds; 
                  })
                  .attrTween('d', function(d) {
                       var i = d3.interpolate(d.startAngle, d.endAngle);
                       return function(t) {
                           d.endAngle = i(t);
                         return arc(d);
                       };
                  });

  this.g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .attr('class', 'arc-text')
      .style("text-anchor", "middle")
      .text(function(d) {   
        var percent = d.value / totalSongs * 100;        
        return percent > 4 ? d.value : ""; 
      });


  var legendRectSize = 10;
  var legendSpacing = 5;

  this.legend.remove();

  this.legend = svg.selectAll('.pie-legend')
                  .data(byGenre)
                  .enter()
                  .append('g')
                  .attr('class', 'pie-legend')
                  .attr('transform', function(d, i){                    
                    var horz = -1.8 * legendRectSize;
                    return 'translate(' + horz + ', -1000)';
                  });

  this.legend
    .append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function(d){         
      var key = Object.keys(d)[0];
      return colors(d[key].length); 
    })
    .style('stroke', 'white'); 

  this.legend
    .append('text')
    .attr('class', 'pie-legend-text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing + 5)
    .text(function(d) { 
      var key = Object.keys(d)[0];
      var percent = numeral(d[key].length / totalSongs).format('0.00%');
      return key.toUpperCase() + ' - ' + percent; 
    }); 

  this.legend
    .transition()
    .delay(function(d, i) {      
      return i * totalSeconds/byGenre.length; 
    })
    .duration(function(){
      return totalSeconds/byGenre.length;
    })         
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * colors.domain().length / 1.65;
      var horz = -6 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });
};

module.exports = GenrePie;