var fs = require('fs');
var path = require('path');

var plotCounter = 1;

PlotProvider = function(){};
PlotProvider.prototype.dummyData = [];

PlotProvider.prototype.findAll = function(callback) {
  parseFiles(fs.readdirSync("data/"));
  callback( null, this.dummyData );
};

PlotProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.dummyData.length;i++) {
    if( this.dummyData[i]._id == id ) {
      result = this.dummyData[i];
      break;
    }
  }
  callback(null, result);
};

PlotProvider.prototype.save = function(plots, c, callback) {
  var plot = null;

  if( typeof(plots.length)=="undefined")
    plots = [plots];

  for( var i =0;i< plots.length;i++ ) {
    plot = plots[i];
    plot._id = plotCounter++;
    plot.created_at = new Date();

    this.dummyData[c]= plot;
  }
  callback(null, plots);
};


function fillData (err, results) {
  if (err) {
    console.log(err);
  } else {
    for (var i = 0; i < results.length; i++) {
      var ts_string = results[i].substring(0,results[i].indexOf(".csv"));
      var secs = +ts_string;
      var ts = new Date(0);
      ts.setUTCSeconds(secs);
      new PlotProvider().save([
          {title: 'Plot ' + (i+1), body: isNaN(ts) ? results[i] : ts}
        ], i, function(error, plots){});
    };
  }
}

function parseFiles (files) {
  var results = [];
  plotCounter = 1;
  for (var i = files.length; i >= 0; i--) {
    if (path.extname(files[i]) == ".csv") {
      results.push(files[i]);
    }
  };
  fillData(null, results);
}

exports.PlotProvider = PlotProvider;
