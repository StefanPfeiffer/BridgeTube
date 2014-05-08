var fs = require('fs');
var path = require('path');

var plotCounter = 1;

PlotProvider = function(){};
PlotProvider.prototype.dummyData = [];

PlotProvider.prototype.findAll = function(callback) {
  callback( null, this.dummyData )
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

PlotProvider.prototype.save = function(plots, callback) {
  var plot = null;

  if( typeof(plots.length)=="undefined")
    plots = [plots];

  for( var i =0;i< plots.length;i++ ) {
    plot = plots[i];
    plot._id = plotCounter++;
    plot.created_at = new Date();

    if( plot.comments === undefined )
      plot.comments = [];

    for(var j =0;j< plot.comments.length; j++) {
      plot.comments[j].created_at = new Date();
    }
    this.dummyData[this.dummyData.length]= plot;
  }
  callback(null, plots);
};

var results = [];

function callback (err, list) {
  if (err) {
    console.log(err);
  } else {
    for (var i = 0; i < results.length; i++) {
      new PlotProvider().save([
          {title: 'Plot ' + (i+1), body: results[i]}
        ], function(error, plots){});
    };
  }
}

function parseFiles (err, files) {
  if (err) {
    return callback(err, list);
  } else {
    for (var i = 0; i < files.length; i++) {
      if (path.extname(files[i]) == ".csv") {
        results.push(files[i]);
      }
    };
    callback(null, results);
  }
}

fs.readdir("data/", parseFiles);

exports.PlotProvider = PlotProvider;
