'use strict';

var express = require('express');
var router = express.Router();
var dummyjson = require('../data/tracking_nodes');
var expressValidator = require('express-validator');
var processData = require('../data/archive');
var postArchive = require('../data/post_archive');



var validInput = function(req) {
  return true;
  // req.checkBody('lat').notEmpty();
  // // req.checkBody(field.long).notEmpty()
  // // req.checkBody(field.time).notEmpty()
  // // req.checkBody(field.device).notEmpty()
  // // req.checkBody(field.rssi).notEmpty()
  //
  // var errors = req.validationErrors();
  //
  // if(errors) {
  //   console.log('there were some errors' + errors);
  //   return false;
  // } else {
  //   return true;
  // }

  // for (var i = 0; i < req.body.node.length; i++) {
  //   var visit = req.body.node[i];
  //
  //   for(var j = 0; j < visit.visits.length; j ++) {
  //
  //     var field = visit.visits[j];
  //     req.checkBody('node[1].node_type').notEmpty();
  //     // req.checkBody(field.long).notEmpty()
  //     // req.checkBody(field.time).notEmpty()
  //     // req.checkBody(field.device).notEmpty()
  //     // req.checkBody(field.rssi).notEmpty()
  //
  //     var errors = req.validationErrors();
  //
  //     if(errors) {
  //       console.log('there were some errors' + errors);
  //       return false;
  //     } else {
  //       return true;
  //     }
  //
  //   }
  //
  // }

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
  res.json(dummyjson);
});
  // Visits grouped on markers
  // Truncate position to 4 decimal places (not rounding)


module.exports = router;
