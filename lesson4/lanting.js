var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var async = require('async');
var mysql = require('mysql');
var path = require('path');

// to publish pallet Box products
var palletBox_obj = require('./keywords/palletBox');
var palletBoxKeywords = palletBox_obj.keywords;

// if this keyword is too short,we combine two keywords into one
// as we use this keyword for post title/post url
var getNewArr = require('./getNewARR');
// we can set how many characters this word should at least have.
const minWordLength = 20; 
const newKeywordArr = getNewArr(palletBoxKeywords, minWordLength)

// to generate dynamic backlinks,using getLinkStr()
const getLinkStr = require('./getLinks');
const publishURL = "https://www.palletboxsale.com/";
const preparedImgArr = [
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/plastic_bulk_bins_for_sale.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/pallet_boxes_plastic.png",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/fruit_pallet_box.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/folding_plastic_pallet_boxes.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/large-storage-boxes-with-lids.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/pallet_box.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/plastic_pallet_and_container.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/plastic-box-pallets-for-sale.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/plastic-pallet-boxes-for-sale.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/plastic-pallet-storage-boxes.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/small_plastic_boxes_bulk.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/extra_large_plastic_storage_containers.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/plastic-pallet-containers.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/pallet-bins-for-sale.jpg",
  "https://www.palletboxsale.com/wp-content/uploads/2018/04/bulk-tote-containers.jpg"
]

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

      var product_detail_pic =`
        <h3>Plastic pallet boxes shipping</h3>
        <img class="wp-image-404 size-full" src="https://www.palletboxsale.com/wp-content/uploads/2018/04/plastic_pallet_boxes_shipping.png" alt="plastic pallet boxes" width="752" height="802" />
        <h3>Plastic pallet boxes loading</h3>
        <img class="alignnone wp-image-403 size-full" src="https://www.palletboxsale.com/wp-content/uploads/2018/04/plastic_pallet_box_loading.png" alt="plastic pallet boxes feature" width="1001" height="593" />
        <h3>Plastic pallet boxes manufacturer</h3>
        <img class="alignnone wp-image-402 size-full" src="https://www.palletboxsale.com/wp-content/uploads/2018/04/plastic_bulk_container_company.png" alt="plastic bulk container manufacturers" width="919" height="532" />
        `;
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
        var backlinks = getLinkStr(publishURL);

        post_title = newKeywordArr[keywordIndex]
        keywordIndex++;
        var prr_desc = $(".prr>p").text();
        if (prr_desc.indexOf("1200x1000x975")) {
          external_long = 1200;
          external_width = 1000;
          external_height = 975;
          internal_long = 1110;
          internal_width = 910;
          internal_height = 790;
          volumn = 800;
          weight = 66;
          model = "PB-1210B1";
        } else if (prr_desc.indexOf("1200x1000x810")) {
          external_long = 1200;
          external_width = 1000;
          external_height = 810;
          internal_long = 1110;
          internal_width = 910;
          internal_height = 800;
          volumn = 700;
          weight = 43;
          model = "PB-1210-COLLAPSIBLE";
        } else{
          external_long = 1200;
          external_width = 1000;
          external_height = 760;
          internal_long = 1110;
          internal_width = 910;
          internal_height = 750;
          volumn = 610;
          weight = 37;
          model = "PB-1210-SOLID";
        }
        var material = "100% HDPE";
        static_load = "4 T";
        dynamic_load = "1 T";

        if ($(".prl .spec-scroll ul li").length>0) {
          $(".prl .spec-scroll ul li").each(function () {
            if ($(this).find("img").attr("bimg")) {
              img_path += baseURL + $(this).find("img").attr("bimg") +",";
            }
          })
        }else{
          img_path = _.take(_.shuffle(preparedImgArr), 4).join();
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
          weight,
          model,
          img_path,
          product_detail_pic,
          backlinks,
          material
        ]);
      
      });
      productDetailArr = productDetailArr.filter((i) => i[0] != null)

      var con = mysql.createConnection({
        host: "106.15.204.243",
        user: "root",
        password: "ABCsujie168168",
        database: "nodedb"
      });
      var tableName = "lantingpalletbox180411"
      con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO " + tableName 
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
          weight,
          model,
          img_path,
          product_detail_pic,
          backlinks,
          material
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





