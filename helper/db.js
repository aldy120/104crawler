// 無關
var MongoClient = require('mongodb').MongoClient;

var uri = 'mongodb://comopanyApi:cz0dgWNMmP2vkDGY@cluster0-shard-00-00-hyjpb.mongodb.net:27017,cluster0-shard-00-01-hyjpb.mongodb.net:27017,cluster0-shard-00-02-hyjpb.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
MongoClient.connect(uri, function (err, db) {
  err ? console.log(err) : console.log('connected');
  var cursor = db.collection('inventory').find({
    tags: 'red'
  });
  cursor.toArray().then(result => {
    console.log(result);
    db.close();
  });

})