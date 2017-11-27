// 存產業類別資料到檔案
var request = require('request');
var fs = require('fs');
var assert = require('assert');

request('http://54.250.241.79:10010/company/industry', function(error, response, body) {
  assert.equal(null, error);
  fs.writeFileSync('../data/industry.txt', body);
});
