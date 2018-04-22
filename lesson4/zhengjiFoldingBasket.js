var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var _ = require("lodash");

var async = require('async');
var mysql = require('mysql');
var path = require('path');

// to publish pallet Box products
var palletBox_obj = require('./keywords/palletBox');
var palletBoxKeywords = palletBox_obj.keywords;

// to publish folding basket products
var foldingCrates_obj = require('./keywords/foldingCrates');
var keywordsToUse = foldingCrates_obj.keywords;

// if this keyword is too short,we combine two keywords into one
// as we use this keyword for post title/post url
var getNewArr = require('./getNewARR');
// we can set how many characters this word should at least have.
const minWordLength = 20; 
var newKeywordArr = getNewArr(keywordsToUse, minWordLength)
//will get 108 keywords(20180422)
//get rid of the keywords that had already been used
newKeywordArr = _.drop(newKeywordArr, 33);

// to generate dynamic backlinks,using getLinkStr()
const getLinkStr = require('./getLinks');
const publishURL = "https://www.plastic-crate.co.uk";

//crawl url
var baseURL = 'http://www.znkia.com';

var keywordIndex = 0;

// app.get('/', function (req, resss, next) {
  //to get the first layer urls
// var cnodeUrl = 'http://www.znkia.com/slzdk.html';
var cnodeUrl = 'http://www.znkia.com/slzdx.html';
  var firstLayURLs = [];
  firstLayURLs.push(cnodeUrl)
  for (let index = 2; index < 11; index++) {
    const url = baseURL + `/slzdx-${index}.html`;
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
      $('.pro-list-s .pd_list_dl').each(function (idx, element) {
        var $element = $(element);
        var href = $element.find("dt a").attr('href');
        secondLayURLs.push(href);
      });
    });

    //send request for every second layer url
    async.mapLimit(secondLayURLs, 2, function (url, callback) {
      fetchUrl(url, callback);
    }, function (err, result) {
      console.log('second layer finished')

      //after get every second layer content,collect the info
      
      var productDetailArr = result.map(function (topicPair) {
        var topicUrl = topicPair[0];
        var topicHtml = topicPair[1];
        var $ = cheerio.load(topicHtml, { decodeEntities: false });
        var post_title;
        var model;
        var external_long;
        var external_width;
        var external_height;
        var internal_long;
        var internal_width;
        var internal_height;
        var foldedHeight;
        var volumn;
        var weight;
        var img_path = '';
        var backlinks = getLinkStr.links(publishURL);
        var product_category = "folding-crate";
        var product_tag = "folding-plastic-boxes";

        post_title = newKeywordArr[keywordIndex]
        keywordIndex++;
        console.log("get url kkkkkk"+topicUrl)
        if ($(".prodeta-r .ul_p em em").length > 0) {
          var resDataArr = $(".prodeta-r .ul_p em em").html().split("<br>");
        }else{
          var resDataArr = $(".prodeta-r .ul_p em").html().split("<br>");
        }
        
        model = resDataArr[0].split("：")[1].trim();
        var longData = resDataArr[1].split("：")[1].trim().split("*");
        external_long = longData[0];
        external_width = longData[1];
        external_height = longData[2];
        var interLongData = resDataArr[2].split("：")[1].trim().split("*");
        internal_long = interLongData[0];
        internal_width = interLongData[1];
        internal_height = interLongData[2];
        foldedHeight = resDataArr[3].split("：")[1].trim().split("*")[2];
        volumn = (internal_long * internal_width * internal_height / 1000000).toFixed(2)
        var weightDataLabel = resDataArr[4].split("：")[0].trim();
        if (weightDataLabel.indexOf("自重")>0) {
          var weightData = resDataArr[4].split("：")[1].trim();
          if (weightData.indexOf("/KG") > 0) {
            weight = weightData.split("/KG")[0];
          } else if (weightData.indexOf("kg") > 0) {
            weight = weightData.split("kg")[0];
          } else {
            weight = weightData.split("KG")[0];
          }
        }else{
          weight="";
        }
        
        if ($(".prodeta-roll .prodeta-con ul li").length>0) {
          $(".prodeta-roll .prodeta-con ul li").each(function () {
            var imgSrc = $(this).find("img").attr("src");
            if (imgSrc) {
              img_path += baseURL + imgSrc +",";
            }
          })
        }
       
        return ([
          post_title, //title
          model,
          external_long, 
          external_width,
          external_height,
          internal_long,
          internal_width,
          internal_height,
          foldedHeight,
          volumn,
          weight,
          img_path,
          backlinks,
          product_category,
          product_tag
        ]);
      
      });
      productDetailArr = productDetailArr.filter((i) => i[0] != null)

      var con = mysql.createConnection({
        host: "106.15.204.243",
        user: "root",
        password: "ABCsujie168168",
        database: "nodedb"
      });
      var tableName = "ZJForPlasticcratecouk"
      con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO " + tableName 
        + `(
          post_title,
          model,
          external_long, 
          external_width,
          external_height,
          internal_long,
          internal_width,
          internal_height,
          foldedHeight,
          volumn,
          weight,
          img_path,
          backlinks,
          product_category,
          product_tag
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

/* 
CREATE TABLE tablename(
  id INT AUTO_INCREMENT PRIMARY KEY, 
  post_title VARCHAR(255),
  model VARCHAR(255),
  external_long VARCHAR(255),
  external_width VARCHAR(255),
  external_height VARCHAR(255),
  internal_long VARCHAR(255),
  internal_width VARCHAR(255),
  internal_height VARCHAR(255),
  foldedHeight VARCHAR(255),
  volumn VARCHAR(255),
  weight VARCHAR(255),
  img_path LONGTEXT,
  backlinks LONGTEXT
)
  
  
  
*/



