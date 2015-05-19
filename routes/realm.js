var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');

function generateId(realmId, sensorName) {
    return realmId + '-' + sensorName;
}

function parseResult(payload, params) {
  var decoded = JSON.parse(payload);
  var contextElement = decoded.contextElement;
  var realm = {
    id: contextElement.id,
    sensors: []
  };
  _.forEach(contextElement.attributes, function(elem) {
    var sensor = {
      name: elem.name,
      lastValue: elem.value,
      id: generateId(contextElement.id, elem.name)
    }
    _.forEach(elem.metadatas, function(metadata) {
      console.log(metadata);
      sensor[metadata.name] =metadata.value;
    });
    realm.sensors.push(sensor);
  });

  return {realm: realm};
}

router.route('/:id')
  .get(function(req, res, next) {
    var options = {
      url: 'http://195.220.224.8:1026/v1/contextEntities/' + req.params.id,
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
        console.log('RESULT 2');
      }
      if(body) {
        return res.json(parseResult(body));
      }
      return;
    });
  })

module.exports = router;
