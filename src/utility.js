
var _ = require('lodash');
var moment = require('moment');

var Utility = {

  formatGenres : function(genres){
    var formatted = {};

    _.each(genres, function(val, key, coll){
      var lKey = key.toLowerCase();
      formatted[lKey] = val.map(function(v){ 
        return v.toLowerCase();
      });

      formatted[lKey].forEach(function(v){
        var woChar = v.replace(/[^\w\s]/gi, '');
        var woSpace = v.replace(/[^\w\s]/gi, '').split(' ').join('');
        
        formatted[lKey].push(woChar);
        formatted[lKey].push(woSpace);        
      });

      formatted[lKey].push(lKey);
    });
    
    return formatted;
  },
  
  toCamelCase : function(obj){
    var newObj = {};

    _.each(obj, function(val, key, coll){      
      var newKey = key.split(' ')
                      .map(function(k, i){ 
                        return i > 0 ? k.slice(0, 1).toUpperCase() + k.slice(1).toLowerCase() : k.toLowerCase();
                      })
                      .join('');
      newObj[newKey] = val;
      if (val.constructor === Object) {
        toCamelCase(val);
      }
    });

    return newObj;
  },

  intoArray: function(coll){
    return _.map(coll, function(v, k){ 
      var data = {};
      data[k] = v; 
      return data;
    });
  },

  groupByGenre : function(data, genres){
    var reduced = data.reduce(function(total, row){
      var genre = row.genre.toLowerCase();
      var genreMatchArr = _.find(genres, function(val, key){      
        return _.any(val, function(g){
          return genre.indexOf(g) !== -1;
        });
      });

      var genreMatch = genreMatchArr ? genreMatchArr[genreMatchArr.length - 1] : null;

      if (genreMatch) {
        total[genreMatch] ? total[genreMatch].push(row) : total[genreMatch] = [row];      
      } else {
        total.other ? total.other.push(row) : total.other = [row];      
      }

      return total;

    }, {});

    return this.intoArray(reduced);
  },

  groupByPlays : function(data){
    var grouped = _.groupBy(data, "plays");
    var groupedArr = this.intoArray(grouped);
    var sorted = groupedArr.sort(function(a, b){
      return Object.keys(a)[0] - Object.keys(b)[0];
    });
    return sorted;
  },

  groupByLastPlayed : function(data){
    var sorted = data.sort(function(a, b){
      var aDate = moment(a.lastPlayed).valueOf();
      var bDate = moment(b.lastPlayed).valueOf();
      return aDate - bDate;      
    });
    return sorted;
  },

  groupByDateAdded : function(data){
    var sorted = data.sort(function(a, b){
      var aDate = moment(a.lastPlayed).valueOf();
      var bDate = moment(b.lastPlayed).valueOf();
      return aDate - bDate;      
    });
    return sorted;
  }

};

module.exports = Utility;

