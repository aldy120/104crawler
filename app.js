var Crawler = require('crawler');
var cheerio = require('cheerio');
var util = require('util');
var fs = require('fs');

var companies = [];

var c = new Crawler({
  rateLimit: 1000,
  maxConnections: 1,
  callback: function (error, res, done) {
    if (error) {
      console.log(error)
    } else {
      var $ = res.$;
      if (isCompanyListPage($)) {
        addMorePagesFromPageOne($, res.options.uri);
        var companyList = createCompanyList($);
        companyList.forEach(addToCrawlerQueue);
        console.log('read company list page')
        console.log(`added ${companyList.length} company to crawler queue`);
      } else if (isCompanyInfoPage($)) {
        saveCompnayInfoPage($);
        console.log('company saved: ' + $('title').text());
      }

    }
    done();
    function addMorePagesFromPageOne($, uri) {
      var current = $('a.page-num.active').text();
      current = parseInt(current);
      
      if (current === 1) {
        var total = $('div.page-total').text().match(/\d+/g)[0];
        total = parseInt(total);
        var i = 2;
        while(i <= total) {
          var targetUri = uri.replace(/page=\d+/, 'page=' + i);
          c.queue(targetUri);
          console.log('add list: ' + targetUri);
          i++;
        }
      }
      
    }
    function isCompanyListPage($) {
      return $('title').text().indexOf(' - 104 人力銀行') !== -1;
    }
    function isCompanyInfoPage($) {
      return $('title').text().indexOf('＜公司簡介及所有工作機會＞─104人力銀行') !== -1;
    }
    function createCompanyList($) {
      var result = [];
      var links = $('#search-result a[target="_blank"]');
      links = filterCompanyPage(links);
      links.each(function (i, link) {
        result.push(link.attribs.href);
      });
      return result;
      function filterCompanyPage(links) {
        var result = [];
        console.log('links.length: ' + links.length);
        links.each(function (i, link) {
          if (/checkc$/.test(link.attribs.href)) {
            result.push(link);
          }
        });
        return cheerio(result);
      }
    }
    function saveCompnayInfoPage($) {
      company = {
        name: $('title').text().replace('＜公司簡介及所有工作機會＞─104人力銀行', ''),
        // 公司介紹
        profile: {
          industry: $('dd').slice(0, 1).text(),
          category: $('dd').slice(1, 2).text(),
          employee: $('dd').slice(2, 3).text(),
          capital: $('dd').slice(3, 4).text(),
          contact: $('dd').slice(4, 5).text(),
          address: $('dd').slice(5, 6).text().replace('地圖', '').trim()

        },
      };
      // 環境照片
      if ($('#environment').find('img').length) {
        company.environment = [];
        $('#environment').find('img').each(function(i, img) {
          var pic = {
            url: img.attribs.src
          };
          if ($('#environment').find('img').slice(i, i + 1).parent().next().text() !== '') {
            pic.description = $('#environment').find('img').slice(i, i + 1).parent().next().text();
          }
          company.environment.push(pic);
        })
      }
      // 公司 logo
      if ($('.logo_comp02 img').attr('src')) {
        company.logoUrl = $('.logo_comp02 img').attr('src');
      }
      // 公司網址
      if ($('dd').slice(8, 9).prev().text() === '公司網址：') {
        company.profile.website = $('dd').slice(8, 9).text();
      }
      // 公司簡介
      if ($('.intro').slice(1, 2).find('p').slice(0, 1).prev().text() === '公司簡介') {
        company.information = $('.intro').slice(1, 2).find('p').slice(0, 1).text();
      }
      // 主要商品／服務項目
      if ($('.intro').slice(1, 2).find('p').slice(1, 2).prev().text() === '主要商品／服務項目') {
        company.service = $('.intro').slice(1, 2).find('p').slice(1, 2).text();
      }
      // 福利制度
      if ($('.intro').slice(1, 2).find('p').slice(2, 3).prev().text() === '福利制度') {
        company.welfare = $('.intro').slice(1, 2).find('p').slice(2, 3).text();
      }
      // 經營理念
      if ($('.intro').slice(1, 2).find('p').slice(3, 4).prev().text() === '經營理念') {
        company.philosophy = $('.intro').slice(1, 2).find('p').slice(3, 4).text();
      }
      companies.push(company);
    }
    function addToCrawlerQueue(x, i) {
      c.queue(x);
      console.log('addToCrawlerQueue: ' + x);
    }
  }
})
c.on('drain', function() {
  console.log('companies.length: ' + companies.length);
  fs.writeFileSync('companies.txt', JSON.stringify(companies, null, 2))
  // add to database
})

// c.queue('https://www.104.com.tw/cust/list/index/?page=1&order=1&mode=s&jobsource=checkc&area=6001003000');
var urls = fs.readFileSync('./data/groupByAreaUrls.txt', 'utf8');
urls = JSON.parse(urls);
urls.forEach(url => c.queue(url));