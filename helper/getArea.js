var request = require('request');
var fs = require('fs');
var assert = require('assert');

request('http://54.250.241.79:10010/company/area', function(error, response, body) {
  assert.equal(error, null);
  fs.writeFileSync('../data/area.txt', body);
})