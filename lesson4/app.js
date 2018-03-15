var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var express = require('express');
var app = express();
var ep = new eventproxy();


app.get('/', function (req, resss, next) {
  var cnodeUrl = 'http://www.pudish.cn/zhouzhuanxiang/';
  var firstLayURLs = [];
  firstLayURLs.push(cnodeUrl)
  for (let index = 2; index < 22; index++) {
    const url = cnodeUrl + `zhouzhuanxiang_${index}.shtml`;
    firstLayURLs.push(url);
  }

  for (let index = 0; index < firstLayURLs.length; index++) {
    superagent.get(firstLayURLs[index])
      .end(function (err, res) {
        console.log('fetch ' + firstLayURLs[index] + ' successful');
        ep.emit('firstLayhtml', [firstLayURLs[index], res.text]);
      });
    
  }
  
  ep.after('firstLayhtml', firstLayURLs.length, function (topics) {

    var secondLayURLs = [];
    topics.forEach(function (topic) {
      var $ = cheerio.load(topic[1]);
        $('.cp ul li').each(function (idx, element) {
          var $element = $(element);
          var href = url.resolve(cnodeUrl, $element.find(".img a").attr('href'));
          secondLayURLs.push(href);
        });
    });

    secondLayURLs.forEach(function (secondLayURL) {
      superagent.get(secondLayURL)
        .end(function (err, res) {
          console.log('fetch ' + secondLayURL + ' successful');
          ep.emit('secondLay_html', [secondLayURL, res.text]);
        });
    });



    ep.after('secondLay_html', secondLayURLs.length, function (topics) {
      topics = topics.map(function (topicPair) {
        var topicUrl = topicPair[0];
        var topicHtml = topicPair[1];
        var $ = cheerio.load(topicHtml);
        return ({
          title: $('.cp h1').text().trim(),
          href: topicUrl,
          desc: $('#c1 p span').text().trim(),
        });
      });

      console.log('final:');
      console.log(topics);
      resss.send(topics);
    });


  })
   
 
})
app.listen(3000, function () {
  console.log('app is listening at port 3000');
});