// Develop a REST API Server to gather and process visitor data. Provide GoogleMaps viewer frontend for previewing last 100 unique visits

// Input data from remote tracking nodes at '/api/track'
  // If duplicate visit, only send visit with strongest signal (rssi)
  // Archive data from 'tracker'
  // Archive data from 'internet-provider'
  // locally store data from mobile
  // locally store data from drone


// Processed data from '/api/track' to archive server at '/api/archive'
  // Only accepts 'POST'
  // Mandatory 'X-Auth-Token: Tracker1234' header
  // Response 'status: ok'
  // Response JSON
  // Response 200 code on success
  // Response 403 code on forbidden (invalid token)
  // Response 400 code on malformed input data (all fields required)

// Frontend viewer at '/viewer'
  // Serve Google maps view with last 100 unique visits
  // Visits grouped on markers
  // Truncate position to 4 decimal places (not rounding)


  'use strict';

  var express = require('express');
  var app = express();
  var router = require('./routes/router.js');

  var jsonParser = require('body-parser').json;
  var morgan = require('morgan');

  app.use(morgan('dev'));
  app.use(jsonParser());

  // Connect to database
  require('./models/database');

  //--CORS handler not included as project is locally hosted--//

  app.use('/', express.static('public'));
  app.use('/events', router);

  // Error handlers
  app.use(function(req, res, next) {
    var err = new Error('The page you were are looking for was not found');
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message
      }
    });
  });

  // Port setup
  var port = process.env.PORT || 9090;

  app.listen(port, function() {
    console.log('The server is now listening on port ' + port + '. Code on!');
  });
