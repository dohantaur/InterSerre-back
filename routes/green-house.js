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

function serializeRequest(greenHouse) {
  var payload = {
    "contextElements": [
      {
        "type": "GreenHouse",
        "isPattern": "false",
        "id": greenHouse.id,
        "attributes": [
          {
            "name": "cultivation",
            "type": "string",
            "value": greenHouse.cultivation
          },
          {
            "name": "width",
            "type": "string",
            "value": greenHouse.width
          },{
            "name": "height",
            "type": "string",
            "value": greenHouse.height
          },{
            "name": "cultivation",
            "type": "string",
            "value": greenHouse.cultivation
          },
          {
            "name": "observation",
            "type": "string",
            "value": greenHouse.observation
          },
          {
            "name": "diversity",
            "type": "string",
            "value": greenHouse.type
          },
          {
            "name": "step",
            "type": "string",
            "value": greenHouse.step,
          },
        ]
      }
    ],
    "updateAction": "APPEND"
  }
  return payload;
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
        return res.json({error: err});
      }
      if(result) {
      }
      if(body) {
        //console.log(body);
        return res.json(parseResult(body));
      }
    });
  });
router.route('/:id')
  .put(function(req, res) {
    var bodyTransform = req.body.greenHouse;
    bodyTransform.id = req.params.id;
    var options = {
      url: ' http://195.220.224.8:1026/ngsi10/updateContext',
      headers: {
        'accept' : 'application/json',
      },
      json: serializeRequest(req.body.greenHouse)
    };
    request.post(options, function(err, result, body) {
      if(err) {
        return res.status(500).json({error: err});
      }
      if(body) {
        console.log(body);
        return res.json(req.body);
      }
      if(result) {
        return res.json(result);
      }
    });
  });

module.exports = router;
