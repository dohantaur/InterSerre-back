var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser')
app.use(bodyParser.json());

// Connect to mongodb
/*var connect = function () {
  //var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);*/

var greenhouse = require('./routes/green-house');
var realm = require('./routes/realm');

app.use('/realms', realm);
app.use('/greenhouses', greenhouse);


app.get('/', function(req, res) {
  res.send({'index': 'coucou'});
})

app.listen(port, function() {
  console.log('Express app started on port ' + port);
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    err.name = 'not found';
    next(err);
});

app.use(function(err, req, res, next) {
    if(err) {
      console.log(err);
      return res.status(err.status).json(err);
    }
});
