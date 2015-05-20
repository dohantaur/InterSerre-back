var _ = require('lodash');
var config = require('./../config');
var path = require('path');

module.exports = function(req, res, next) {
  var isApi = _.startsWith(req.path, '/api');
  if(! isApi) {
    return res.sendFile(path.resolve(__dirname , '../public/index.html'));
  }
  next();
}
