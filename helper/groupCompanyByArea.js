// 把小區域id整理出來，避開500頁限制
var fs = require('fs');

var area = fs.readFileSync('../data/area.txt');
area = JSON.parse(area);

var smallAreaIds = [];
area.n.forEach(function(big) {
  big.n.forEach(function(small) {
    smallAreaIds.push(small.no);
  })
});

var smallAreaUrls = smallAreaIds.map(id => 'https://www.104.com.tw/cust/list/index/?page=1&order=1&mode=s&jobsource=checkc&area=' + id);

fs.writeFileSync('../data/groupByAreaUrls.txt', JSON.stringify(smallAreaUrls));