// 資本額與員工人數換成數字
var MongoClient = require('mongodb').MongoClient;

var uri = 'mongodb://comopanyApi:cz0dgWNMmP2vkDGY@cluster0-shard-00-00-hyjpb.mongodb.net:27017,cluster0-shard-00-01-hyjpb.mongodb.net:27017,cluster0-shard-00-02-hyjpb.mongodb.net:27017/company-api?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

MongoClient.connect(uri, function (err, db) {
  var col = db.collection('companyInfo')
  col.find({}).forEach(function (company) {
    var employee = company.profile.employee;
    var capital = company.profile.capital;
    if (!isNaN(parseInt(employee))) {
      employee = parseInt(employee);
    } else {
      employee = -1;
    }
    if (capital === '暫不提供') {
      capital = -1;
    } else {
      capital = chineseToNumber(capital);
    }

    col.update({
      _id: company._id
    }, {
      $set: {
        'profile.employee': employee,
        'profile.capital': capital
      }
    });
  }, function(err) {
    if(err) console.log(err);
    db.close();
  });
})

function chineseToNumber(chinese) {
  var number = 0;
  var match;
  if (match = /\d+億/.exec(chinese)) {
    number += parseInt(match[0]) * 1e8;
  }
  if (match = /\d+萬/.exec(chinese)) {
    number += parseInt(match[0]) * 1e4;
  }
  return number;
}