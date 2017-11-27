// 測試request功能用
var request = require('request')
// tsmc: 59b65ce0b8fb234d0494411f
// 石頭記: 59b65ce0b8fb234d0493f77b
var _id = "59b65ce0b8fb234d0493f77b"
var tagName = 'cool'
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