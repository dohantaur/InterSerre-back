var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');

function parseResult(payload) {
  var decoded = JSON.parse(payload);
  var contextElements = decoded.contextResponses;
  var greenHouses = [];
  _.forEach(contextElements, function(element) {
    var elem = element.contextElement;
    var greenHouse = {
      id: elem.id,
    };
    _.forEach(elem.attributes, function(attribute) {
      greenHouse[attribute.name] = attribute.value;
    })
    var tmp = greenHouse.diversity;
    delete greenHouse.diversity;
    greenHouse.type = tmp;
    greenHouses.push(greenHouse);
  })
  return {greenHouses: greenHouses};
}

router.route('/')
  .get(function(req, res, next) {
    var options = {
      url: 'http://195.220.224.8:1026/v1/contextEntityTypes/GreenHouse',
      headers: {
        'accept' : 'application/json',
      }
    };

    request.get(options, function(err, result, body) {
      if(err) {
        console.log(err);
        return res.json({error: err});
      }
      if(result) {
        console.log('RESULT');
      }
      if(body) {
        //console.log(body);
        return res.json(parseResult(body));
      }
    });
  })

module.exports = router;
