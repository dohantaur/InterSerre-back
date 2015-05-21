var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');
var moment = require('moment')

var hierarchy = null;

function buildQuery() {
  var uri = 'http://130.211.103.49:8080/hostabee-1.0-SNAPSHOT/hive';
  return uri;
}

function formatForGlobalByRealm(payload) {
  var result = payload.result;
  var realms = [];
  var allFirstCharts = [];
  var globalTemp = {
    realm: 'Températures',
    data: []
  }
  var finalChart2;

  _.forEach(result, function(realm) {
    realm.value = parseInt(realm.value);
    realm.dateEvent = parseInt(moment(realm.dateEvent).format('x'));

    var isExist = false;
    _.forEach(realms, function(item, realmIndex) {
      if(item.id === realm.id) {
        isExist = true;
        var isSensorExist = false;
        _.forEach(item.sensors, function(sensor, sensorIndex) {
          if(sensor.id === realm.keyValue) {
            isSensorExist = true;
            realms[realmIndex].sensors[sensorIndex].data.push({date: realm.dateEvent, value: realm.value});
          }
        });
        if(!isSensorExist) {
          realms[realmIndex].sensors.push({id: realm.keyValue, data:[{date: realm.dateEvent, value: realm.value}]});
        }
      }
    });
    if(!isExist) {
      realms.push({
        id: realm.id,
        sensors: [{
          id: realm.keyValue,
          data: [{
            date: realm.dateEvent,
            value: realm.value
          }]
        }]
      });
    }
  });
  hierarchy = realms;

  realms.forEach(function(realm) {
    var obj = {
      realm: realm.id,
      data: [
        ['x1'],
        ['x2'],
        ['temperature'],
        ['lumiere']
      ]
    };
    realm.sensors.forEach(function(sensor) {
      sensor.data.forEach(function(data) {
        switch(sensor.id) {
          case('insideTemp'):
            obj.data[2].push(data.value);
            obj.data[0].push(data.date);
            if(realm.id === 'AplaiaR1')
              globalTemp.data.push({
                realm: realm.id,
                date: data.date,
                value: data.value
              });
          break;
          case('light'):
            obj.data[3].push(data.value);
            obj.data[1].push(data.date);
          break;
          default:
          break;
        }
      });
    });
    allFirstCharts.push(obj);
  });

  _.forEach(allFirstCharts, function(item, index) {
    allFirstCharts[index].data = {
      xs: {
        temperature: 'x1',
        lumiere: 'x2'
      },
      /*types: {
        temperature: 'line',
        lumiere: 'line',
      },*/
      //xFormat: '%Y-%m-%d %H:%M:%S',
      columns: item.data,
    }
    allFirstCharts[index].axis = {
      x: {
        type: 'timeseries',
        format: '%Y-%m-%d %H:%M:%S',
        show: false
      },
    }
  });
  finalChart2 = {
    json: globalTemp.data,
    keys: {
        x: 'date',
        value: ['value']
    },
    //xFormat: '%Y-%m-%d %H:%M:%S',
  }
  allFirstCharts.push({
    realm: globalTemp.realm,
    data: finalChart2,
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d %H:%M:%S',
        }
      }
    }
  });
  return(allFirstCharts);
}

router.route('/')
  .get(function(req, res) {
    var options = {
      url: buildQuery(),
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
        return res.json(formatForGlobalByRealm(JSON.parse(body)));
      }
    });
  })

module.exports = router;
