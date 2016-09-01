var http = require('http');


var postArchiveData = function(data) {

  var reqOptions = {
      port: 9090,
      path: '/api/archive',
      method: 'POST',
      headers: {
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

  var stringData = JSON.stringify(data);
  // write data to request body
  request.write(stringData);
  request.end();
}

module.exports = postArchiveData;
