var express = require('express');
var app = express();
var storage = require('node-persist');
var request = require('request');

app.get('/setstatus', function (req, res) {
    result = setStatus(req,res);
    res.send(result);
});

function setStatus(req, res){
  //expected params, deviceid (string) and status (0 = shut, 1 = open)
  console.log('deviceid: ' + req.query.deviceid);
  console.log('status: ' + req.query.status);

  if (req.query.deviceid && req.query.status) {
    storage.setItemSync(req.query.deviceid,req.query.status);
    result = ("OK - device " + req.query.deviceid + " set to " + req.query.status);
  } else {
    result = ("Missing Params deviceid and status: " + req.originalUrl);
  }
  return result;
}

app.get('/setstatuses', function (req, res) {
    var result = "";
    if(req.query.temperature && req.query.temperature.length > 0) {
      req.query.deviceid = 'Temperature';
      req.query.status = req.query.temperature;
      result += setStatus(req,res)+"\n";
    }
    if(req.query.humidity && req.query.humidity.length > 0) {
      req.query.deviceid = 'Humidity';
      req.query.status = req.query.humidity;
      result += setStatus(req,res)+"\n";
    }
    if(req.query.smoke && req.query.smoke.length > 0) {
      req.query.deviceid = 'Smoke';
      req.query.status = req.query.smoke;
      var existing_status = storage.getItemSync(req.query.deviceid);
      if(existing_status != req.query.smoke){
        pushSmokeUpdate(req.query.smoke, "@bed");
        pushSmokeUpdate(req.query.smoke, "@neetika");
      }

      result += setStatus(req,res)+"\n";
    }
    if(req.query.panic && req.query.panic.length > 0) {
      req.query.deviceid = 'Panic';
      req.query.status = req.query.panic;
      var existing_status = storage.getItemSync(req.query.deviceid);
      if((existing_status != req.query.panic) && (req.query.panic == '1')){
        pushPanic("@bed");
        pushPanic("@neetika");
      }

      result += setStatus(req,res)+"\n";
    }
    if(req.query.door && req.query.door.length > 0) {
      req.query.deviceid = 'Door';
      req.query.status = req.query.door;
      result += setStatus(req,res)+"\n";
    }
    if(req.query.light && req.query.light.length > 0) {
      req.query.deviceid = 'Light';
      req.query.status = req.query.light;
      result += setStatus(req,res)+"\n";
    }
    if(req.query.fan && req.query.fan.length > 0) {
      req.query.deviceid = 'Fan';
      req.query.status = req.query.fan;
      result += setStatus(req,res)+"\n";
    }
    res.send(result);
});

function pushSmokeUpdate(onfire, target){
                                             