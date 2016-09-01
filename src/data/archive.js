'use strict';

var fs = require('fs');

var archiveDataContructor = function(nodeData) {
  var visitTimes = [];
  var rssis = [];
  var totalLat = 0;
  var totalLong = 0;

  if (nodeData.node_type === 1) {
    this.node_type = 'tracker';
  } else {
    this.node_type = 'internet_provider';
  }

  this.device = nodeData.visits[0].device;

  nodeData.visits.forEach(function(value, index) {
    visitTimes.push(value.time);
    rssis.push(value.rssi);
    totalLat += value.lat;
    totalLong += value.long;
  });

  this.time_start = Math.min.apply(Math, visitTimes);
  this.time_end = Math.max.apply(Math, visitTimes);
  this.rssi_min = Math.min.apply(Math, rssis);
  this.rssi_max = Math.max.apply(Math, rssis);

  this.sample_count = nodeData.visits.length;

  this.average_position = {
    latitude: totalLat / nodeData.visits.length,
    longitude: totalLong / nodeData.visits.length
  }
}


var archiveNodesData = function(nodeData) {
  var archiveData = new archiveDataContructor(nodeData);
  return archiveData;
}

// var removeDuplicateVisits(nodes) {
//   nodes.visits.forEach(function(value, index) {
//
//   });
// }

var processData = function(trackingNodes) {
  var archive = [];
  trackingNodes.node.forEach(function(value, index) {

    //var cleanedData = removeDuplicateVisits(value);

    if(value.node_type === 1 || value.node_type === 2) {
    //if 1 or 2
      // Archive data from 'tracker'
      // Archive data from 'internet-provider'
      archive.push(archiveNodesData(value));

    }
  });

  //Store all nodes in local file
  var stringifiedData = JSON.stringify(trackingNodes);
  fs.writeFileSync(__dirname + '/local_data_storage.json', stringifiedData);

  return archive;
};


// If duplicate visit, only send visit with strongest signal (rssi)

module.exports = processData;
