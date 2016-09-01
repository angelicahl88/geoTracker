'use strict';

var $ = require('jquery');
var L = require('leaflet');

function truncateCoords(coord) {
  return Math.floor(coord * 10000) / 10000;
}

// Create markers for each visit
var createMarkers = function(data) {
  var markerArray = [];
  data.visits.forEach(function(visit, index) {
    markerArray.push(
      L.marker([truncateCoords(visit.lat), truncateCoords(visit.long)])
        .bindPopup('<h2>RSSI: ' + visit.rssi + '</h2>')
    );
  });
  return markerArray;
};

//Create a LayerGroup for each node
var createLayerGroup = function(nodes) {
  nodes.forEach(function(node, index) {
    L.featureGroup(createMarkers(node))
      .addTo(map);
  });
};

//Instantiate a Leaflet Map
var map = L.map('map', {
  center:[59.4, 18.15],
  zoom: 10
});

//Load tileLayer and add to map
L.tileLayer('http://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.Icon.Default.imagePath = '../styles/css/images';

//Get node visit data from /viewer
$.get('/viewer')
  .done(function(response) {
    createLayerGroup(response);
  })
  .fail(function(err) {
    console.log(err.message);
  });
