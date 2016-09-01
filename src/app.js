// Develop a REST API Server to gather and process visitor data. Provide GoogleMaps viewer frontend for previewing last 100 unique visits

  'use strict';

  var express = require('express');
  var app = express();
  var router = require('./routes/router.js');

  var jsonParser = require('body-parser').json;
  var morgan = require('morgan');
  var expressValidator = require('express-validator');

  app.use(morgan('dev'));
  app.use(jsonParser());
  app.use(expressValidator());


  //--CORS handler not included as project is locally hosted--//

  app.use('/', express.static('public'));
  app.use('/', router);

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
