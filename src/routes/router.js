'use strict';

var util = require('util');
var express = require('express');
var router = express.Router();
var dummyjson = require('../data/tracking_nodes');
var expressValidator = require('express-validator');
var processData = require('../data/archive');
var postArchive = require('../data/post_archive');
var fs = require('fs');


var validInput = function(req) {
  var errors = {};
  req.body.node.forEach(function(value, index) {
    if(value.node_type == null || value.node_type == '') {
      errors.message = 'Node type is required';
    }

    value.visits.forEach(function(value, index) {
      if(value.lat == null || value.lat == '') {
        errors.message = 'Latitude is required';
      } else if(value.long == null || value.long == '') {
        errors.message = 'Longitude is required';
      } else if(value.time == null || value.time == '') {
        errors.message = 'Time is required';
      } else if(value.device == null || value.device == '') {
        errors.message = 'Device is required';
      } else if(value.rssi == null) {
        errors.message = 'RSSI is required';
      }
    });

  });
  console.log(errors);
  if(Object.keys(errors).length === 0) {
    return true;
  }  else {
    return false;
  }
}

//Authentication
// Mandatory 'X-Auth-Token: Tracker1234' headerm
// Response 403 code on forbidden (invalid token)
// Response 400 code on malformed input data (all fields required)
router.use('/api/track', function(req, res, next) {
  var authToken = req.get('X-Auth-Token');

  if(!authToken || authToken !== 'Tracker1234') {
    res.status(403).send({
      status: 'forbidden'
    });
  } else if(!validInput(req)) {
    res.status(400).send({
      status: 'validation_error'
    });
  } else {
    next();
  }
});



// Input data from remote tracking nodes at '/api/track'
router.post('/api/track', function(req, res, next) {
  var data = processData(req.body);
  postArchive(data);
});



// Processed data from '/api/track' to archive server at '/api/archive'
  // Only accepts 'POST'
router.post('/api/archive', function(req, res, next) {
  console.log(req.body);
  res.status(200).send({
    status: 'ok'
  });
});


// Frontend viewer at '/viewer'
  // Serve Google maps view with last 100 unique visits
router.get('/viewer', function(req, res, next) {
  var localData = fs.readFileSync(__dirname + '/../data/local_data_storage.json', {encoding: 'utf8'});
  var localJson = JSON.parse(localData);

// Return last 100 visits
  var markerArray = [];
  for(var i = 0; i < 3; i++) {
    markerArray.push(localJson.node[i]);
  }

  res.json(markerArray);

});
  


module.exports = router;
