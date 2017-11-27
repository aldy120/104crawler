// remove original tag and create new tag format api in with companyApi
// 因為asynchronous的關係，有可能導致順序不一，變成先建立tag，在移除所有tags。這樣似乎不太妙。
var MongoClient = require('mongodb').MongoClient
var request = require('request')
var assert = require('assert')
var ObjectID = require('mongodb').ObjectID

var uri = 'mongodb://comopanyApi:cz0dgWNMmP2vkDGY@cluster0-shard-00-00-hyjpb.mongodb.net:27017,cluster0-shard-00-01-hyjpb.mongodb.net:27017,cluster0-shard-00-02-hyjpb.mongodb.net:27017/company-api?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
MongoClient.connect(uri, (err, db) => {
  var query = {
    tags: {$exists: true}
  }
  var cursor = db.collection('companyInfo').find(query)

  cursor.forEach(
    function ({tags, _id}) {
      if (typeof tags[0] !== 'string') {
        return
      }
      // drop tags in database
      db.collection('companyInfo').updateOne({
        _id: new ObjectID(_id)
      }, {
        $unset: {tags: ''}
      })
      // add tag
      tags.forEach((tagName) => {
        
        request({
          method: 'POST',
          uri: `http://54.199.222.132/company/${_id}/tag`,
          json: true,
          body: {
            name: tagName
          }
        }, function (error, response, body) {
          if (error) {
            return console.error('upload failed:', error);
          }
          console.log('Upload successful!  Server responded with:', body);
        })
      })
    }, function (err) {
      assert.equal(null, err)
      return db.close()
    }
  )
})
