module.exports = function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  err.name = 'not found';
  next(err);
}
