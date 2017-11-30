var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

MongoClient.connect('mongodb://comopanyApi:cz0dgWNMmP2vkDGY@cluster0-shard-00-00-hyjpb.mongodb.net:27017,cluster0-shard-00-01-hyjpb.mongodb.net:27017,cluster0-shard-00-02-hyjpb.mongodb.net:27017/company-api?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', (err, db) => {
  var filter = {
    name: 'xxx'
  }
  db.collection('tag').find().toArray((err, docs) => {
    console.log(docs)
    db.close()
  })
})