var express = require('express');
var PlotProvider = require('./plotprovider-memory').PlotProvider;

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express['static'](__dirname + '/html'));
  app.use(express['static'](__dirname + '/data'));
  app.use(express['static'](__dirname + '/html/data'));
  app.use('/data', express.static(__dirname + '/data'));
  app.register('.html', require('jade'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var plotProvider= new PlotProvider();

app.get('/', function(req, res){
  plotProvider.findAll(function(error, docs){
    res.render('index.jade', { locals: {
      title: 'LNDW 14: BMBF Projekt VIVE Brückenüberwachung',
      plots:docs
      } 
    });
  })
});

app.get('/plot/:id', function(req, res) {
    res.sendfile('html/plot_' + req.params.id + '.html', {root: __dirname});
});

app.listen(80);