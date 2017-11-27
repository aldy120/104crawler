// 新增公司資料到資料庫
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

var uri = 'mongodb://comopanyApi:cz0dgWNMmP2vkDGY@cluster0-shard-00-00-hyjpb.mongodb.net:27017,cluster0-shard-00-01-hyjpb.mongodb.net:27017,cluster0-shard-00-02-hyjpb.mongodb.net:27017/company-api?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
var companies = fs.readFileSync('companies.txt', {encoding: 'utf8'});
companies = JSON.parse(companies);
MongoClient.connect(uri, function (err, db) {
  var col = db.collection('companyInfo');
  col.insertMany(companies).then(() => db.close());
})
