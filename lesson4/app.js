var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var express = require('express');
var app = express();
var ep = new eventproxy();
var async = require('async');

var mysql = require('mysql');

// app.get('/', function (req, resss, next) {
  //to get the first layer urls
  var cnodeUrl = 'http://www.pudish.cn/zhouzhuanxiang/';
  var firstLayURLs = [];
  firstLayURLs.push(cnodeUrl)
  for (let index = 2; index < 22; index++) {
    const url = cnodeUrl + `zhouzhuanxiang_${index}.shtml`;
    firstLayURLs.push(url);
  }
  var fetchUrl = function (url, callback) {

    console.log("url为" + url);
    superagent.get(url)
      .end(function (err, res) {
        console.log('fetch ' + url + ' successful');
        callback(null, [url, res.text]);
      });
  }
  //to get the html content(that contains the second layer urls) in every first layer urls
  async.mapLimit(firstLayURLs, 3, function (url, callback) {
    fetchUrl(url, callback);
  }, function (err, result) {
    console.log('first layer final')
    console.log(JSON.stringify(result));

    //collect the second layer urls
    var secondLayURLs = [];
    result.forEach(function (topic) {
      var $ = cheerio.load(topic[1]);
      $('.cp ul li').each(function (idx, element) {
        var $element = $(element);
        var href = url.resolve(cnodeUrl, $element.find(".img a").attr('href'));
        secondLayURLs.push(href);
      });
    });

    //send request for every second layer url
    async.mapLimit(secondLayURLs, 3, function (url, callback) {
      fetchUrl(url, callback);
    }, function (err, result) {
      console.log('second layer finished')
      console.log(JSON.stringify(result));

      //after get every second layer content,collect the info
      var productDetailArr = result.map(function (topicPair) {
        var topicUrl = topicPair[0];
        var topicHtml = topicPair[1];
        var $ = cheerio.load(topicHtml);
        // return ({
        //   title: $('.cp h1').text().trim(),
        //   href: topicUrl,
        //   desc: $('#c1 p span').text().trim(),
        // });
        return ([
          $('.cp h1').text().trim(),
          topicUrl,
          $('#c1').html()
        ]);
      
      });

      var con = mysql.createConnection({
        host: "106.15.204.243",
        user: "root",
        password: "ABCsujie168168",
        database: "nodedb"
      });
      con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO products (title, href, description) VALUES ?";
        
        con.query(sql, [productDetailArr], function (err, result) {
          if (err) throw err;
          console.log("Number of records inserted: " + result.affectedRows);
        });
      });

      console.log('final:');
      console.log(productDetailArr);
      resss.send(productDetailArr);
    });
  })

  // })



// app.listen(3000, function () {
//   console.log('app is listening at port 3000');
// });




