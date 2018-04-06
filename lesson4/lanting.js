var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var async = require('async');
var mysql = require('mysql');
var path = require('path');

var palletBoxKeywords = require('./palletBox');
var getNewArr = require('./getNewARR');
const minWordLength = 20;
const newKeywordArr = getNewArr(palletBoxKeywords, minWordLength)

var baseURL = 'http://www.cnplasticpallet.com';

var keywordIndex = 0;

// app.get('/', function (req, resss, next) {
  //to get the first layer urls
var cnodeUrl = 'http://www.cnplasticpallet.com/plastic-pallet-box/';
  var firstLayURLs = [];
  firstLayURLs.push(cnodeUrl)
  for (let index = 2; index < 8; index++) {
    const url = cnodeUrl + `page-${index}/`;
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

    //collect the second layer urls
    var secondLayURLs = [];
    result.forEach(function (topic) {
      var $ = cheerio.load(topic[1], { decodeEntities: false });
      $('.pro_lb0 ul li').each(function (idx, element) {
        var $element = $(element);
        var href = $element.find(".fl a").attr('href');
        secondLayURLs.push(href);
      });
    });

    //send request for every second layer url
    async.mapLimit(secondLayURLs, 3, function (url, callback) {
      fetchUrl(url, callback);
    }, function (err, result) {
      console.log('second layer finished')

      //after get every second layer content,collect the info
      var productDetailArr = result.map(function (topicPair) {
        var topicUrl = topicPair[0];
        var topicHtml = topicPair[1];
        var $ = cheerio.load(topicHtml, { decodeEntities: false });
        var post_title;
        var external_long;
        var external_width;
        var external_height;
        var internal_long;
        var internal_width;
        var internal_height;
        var static_load;
        var dynamic_load;
        var volumn;
        var model;
        var img_path;
        if ($(".aliDataTable").length>0) {
          post_title = newKeywordArr[keywordIndex]
          keywordIndex++;
          var external_detail = $(".aliDataTable tbody tr").eq(1).find("td").eq(1).find("span").text().split("*");
          external_long = external_detail[0];
          external_width = external_detail[1];
          external_height = external_detail[2];
          var internal_detail = $(".aliDataTable tbody tr").eq(2).find("td").eq(1).find("span").text().split("*");
          internal_long = internal_detail[0];
          internal_width = internal_detail[1];
          internal_height = internal_detail[2];
          static_load = $(".aliDataTable tbody tr").eq(4).find("td").eq(1).find("span").text();
          dynamic_load = $(".aliDataTable tbody tr").eq(5).find("td").eq(1).find("span").text();
          volumn = $(".aliDataTable tbody tr").eq(6).find("td").eq(1).find("span").text().split("L")[0];
          model = $(".aliDataTable tbody tr").eq(0).find("td").eq(1).find("span").text();
        }else{
          post_title = null;
        }

        if ($(".prl .spec-scroll ul li").length>0) {
          $(".prl .spec-scroll ul li").each(function () {
            img_path += baseURL + $(this).find("img").attr("src");
          })
        }
       
        return ([
          post_title, //title
          external_long, 
          external_width,
          external_height,
          internal_long,
          internal_width,
          internal_height,
          static_load, 
          dynamic_load,
          volumn,
          model,
          img_path
        ]);
      
      });
      productDetailArr = productDetailArr.filter((i) => i[0] != null)

      var con = mysql.createConnection({
        host: "106.15.204.243",
        user: "root",
        password: "ABCsujie168168",
        database: "nodedb"
      });
      var tableName = "lantingpalletbox"
      con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO " + lantingpalletbox 
        + `(
          post_title,
          external_long,
          external_width,
          external_height,
          internal_long,
          internal_width,
          internal_height,
          static_load, 
          dynamic_load,
          volumn,
          model,
          img_path
        ) VALUES ?`;
        


        
        con.query(sql, [productDetailArr], function (err, result) {
          if (err) throw err;
          console.log("Number of records inserted: " + result.affectedRows);
        });
      });

      console.log('final:');
      console.log(productDetailArr);
    });
  })

  // })



// app.listen(3000, function () {
//   console.log('app is listening at port 3000');
// });




