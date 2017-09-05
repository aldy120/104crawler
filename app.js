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
        // console.log('=====')
        // console.log(links);
        // console.log('=====')
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
          // phone: $('dd').slice(6, 7).text(),
          // fax: $('dd').slice(7, 8).text(),

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
// if you want to crawl some website with 2000ms gap between requests
for (var i = 1; i <= 500; i++) {
  c.queue(`https://www.104.com.tw/cust/?page=${i}&order=1&mode=s&jobsource=checkc`);
}
// var companyPageUrl = 'https://www.104.com.tw/jobbank/custjob/index.php?r=cust&j=4870426e383640683c583a1d1d1d1d5f2443a363189j56&jobsource=checkc'
// companyPageUrl = 'https://www.104.com.tw/jobbank/custjob/index.php?r=cust&j=386043295e5c3f2030423a1d1d1d1d5f24437323189j56&jobsource=checkc'
// // 麵包店
// companyPageUrl = 'https://www.104.com.tw/jobbank/custjob/index.php?r=cust&j=643c446d3638406932343c653a40381b82b2b2b2a436e382664j52&jobsource=checkc'
// c.queue(companyPageUrl)

