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

// if this keyword is too short,we combine two keywords into one
// as we use this keyword for post title/post url
var getNewArr = require('./getNewARR');
// we can set how many characters this word should at least have.
const minWordLength = 20; 
var newKeywordArr = getNewArr(palletBoxKeywords, minWordLength);
newKeywordArr = _.drop(newKeywordArr, 58);

// to generate dynamic backlinks,using getLinkStr.links()
const getLinkStr = require('./getLinks');
const publishURL = "https://www.cnboxstore.com/";


var product_detail_pic = `
        <h3>Plastic pallet bins shipping</h3>
        <img class="alignnone wp-image-336 size-full" src="https://www.cnboxstore.com/wp-content/uploads/2018/04/shipping_plastic_pallet_boxes.png" alt="plastic pallet boxes" width="752" height="802" />
        <h3>Plastic bulk container loading</h3>
        <img class="alignnone wp-image-335 size-full" src="https://www.cnboxstore.com/wp-content/uploads/2018/04/plastic_pallet_box_feature.png" alt="plastic pallet boxes feature" width="1001" height="593" />
        <h3>Plastic pallet boxes manufacturer</h3>
        <img class="alignnone size-full wp-image-334" src="https://www.cnboxstore.com/wp-content/uploads/2018/04/plastic_bulk_container_manufacturer.png" alt="plastic bulk container manufacturers" width="919" height="532" />
        `;

var con = mysql.createConnection({
  host: "106.15.204.243",
  user: "root",
  password: "ABCsujie168168",
  database: "nodedb"
});
var tableName = "lantingpalletboxcnboxstore"
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  for (let index = 0; index < 58; index++) {
    const post_title = newKeywordArr[index];
    const backlinks = getLinkStr.links(publishURL);
    var sql = `
        update ${tableName}
        set post_title= '${post_title}',
        product_detail_pic= '${product_detail_pic}',
        backlinks= '${backlinks}'
        where id= '${index}';`
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  }
  
});




