// https://www.104.com.tw/public/function01/utf8/jsonIndust.js
var MongoClient = require('mongodb').MongoClient;
var request = require('request');
function insertIndustry(db, callback) {
  request('https://www.104.com.tw/public/function01/utf8/jsonIndust.js', function (error, response, body) {
    var industry = JSON.parse(body.match(/\{.*\]\}/)[0]);
    db.collection('industry').insertOne(industry, function(err, r) {
      if (err) console.log(err);
      callback();
    });
  })
}


var uri = 'mongodb://comopanyApi:cz0dgWNMmP2vkDGY@cluster0-shard-00-00-hyjpb.mongodb.net:27017,cluster0-shard-00-01-hyjpb.mongodb.net:27017,cluster0-shard-00-02-hyjpb.mongodb.net:27017/company-api?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
MongoClient.connect(uri, function (err, db) {
  insertIndustry(db, function () {
    db.close();
  })
})