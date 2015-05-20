var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var serveStatic = require('serve-static');
var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser')
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
};

app.use('/static', serveStatic(__dirname + '/public/static'));
app.use('/assets', serveStatic(__dirname + '/public/assets'));
app.use(require('./middlewares/serve-static'));

var greenhouse = require('./routes/green-house');
var realm = require('./routes/realm');

app.use('/api/realms', realm);
app.use('/api/greenHouses', greenhouse);


app.get('/', function(req, res) {
  res.send({'index': 'coucou'});
})

app.listen(port, function() {
  console.log('Express app started on port ' + port);
});

app.use(require('./middlewares/handle-error'));
app.use(function(err, req, res, next) {
    if(err) {
      return res.status(err.status).json(err);
    }
});

module.exports = app;
