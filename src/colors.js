
var Colors = {
  palette: function(){
    // Will serve as the color palette. 
    var colors = d3.scale.category20();
    return colors;
    // [
    //   // Dull Yellow
    //   "rgba(236, 208, 120, 1.0)", 
    //   // Dark Orange
    //   "rgba(217, 91, 67 1.0)", 
    //   // Burnt Red
    //   "rgba(192, 41, 66 1.0)", 
    //   // Eggplant
    //   "rgba(84, 36, 55, 1.0)",
    //   // Steel Blue
    //   "rgba(83, 119, 122, 1.0)"
    // ];
  }
};

module.exports = Colors;