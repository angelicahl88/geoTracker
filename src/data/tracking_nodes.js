'use strict';

var dummyjson = require('dummy-json'),
    fs = require('fs'),
    http = require('http');

var deviceHash = {
  deviceHash: function() {
    var hash = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0 ; i < 16; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }
};

var template = fs.readFileSync(__dirname + '/template.hbs', {encoding: 'utf8'});

var result = dummyjson.parse(template, {helpers: deviceHash});
var jsonData = JSON.parse(result);

var reqOptions = {
    port: 9090,
    path: '/api/track',
    method: 'POST',
    headers: {
      'X-Auth-Token': 'Tracker1234',
      'Content-Type': 'application/json'
    }
};

var request = http.request(reqOptions, function(res) {

  res.setEncoding('utf8');

  res.on('data', function(chunk) {
    console.log('body' + chunk);
  });

  res.on('end', function() {
    console.log('no more data in the response');
  });

});

request.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
request.write(result);
request.end();
