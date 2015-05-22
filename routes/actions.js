var express = require('express');
var router = express.Router();
var request = require('request');
request.debug = true;
router.route('/')
  .post(function(req, res) {
    var options = {
      url: 'http://192.168.2.6:3000/action',
      headers: {
        "Content-Type" : 'application/json',
      },
      body: JSON.stringify({
       "name": "light",
       "key": "light",
       "sensor-type": "light",
       "area": "room3",
       "action": {
           "type": "manual",
           "value": req.body.sensorValue.toString()
       }
      })
    };
    request.post(options, function(err, result, body) {
      console.log(req.body)
      if(err) {
        console.log('ERR')
        console.log(err);
        return res.json({error: err});
      }
      if(result) {
        console.log('HEY')
        //console.log(result)
      }
      if(body) {
        console.log(body)
        console.log('HOLA')
        return res.json({ok: 200});
      }
    })
  });

module.exports = router;
