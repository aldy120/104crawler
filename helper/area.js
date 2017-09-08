// https://www.104.com.tw/public/function01/utf8/jsonArea.js
var MongoClient = require('mongodb').MongoClient;
var request = require('request');



var uri = 'mongodb://comopanyApi:cz0dgWNMmP2vkDGY@cluster0-shard-00-00-hyjpb.mongodb.net:27017,cluster0-shard-00-01-hyjpb.mongodb.net:27017,cluster0-shard-00-02-hyjpb.mongodb.net:27017/company-api?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
MongoClient.connect(uri, function (err, db) {
  var col = db.collection('area');
  request('https://www.104.com.tw/public/function01/utf8/jsonArea.js',
    function (error, response, body) {
      var area = JSON.parse(body.match(/'\{.*\}';/)[0].replace(/[';]/g, ''));
      col.insertOne(area, function(err, r) {
        if (err) console.log(err);
        db.close();
      });
    });
});