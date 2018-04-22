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
newKeywordArr = _.drop(newKeywordArr, 115);

// to generate dynamic backlinks,using getLinkStr.links()
const getLinkStr = require('./getLinks');
const publishURL = "https://www.plastic-crate.co.uk/";


var product_detail_pic = `
        <h3>Plastic pallet boxes shipping</h3>
        <img class="alignnone size-full wp-image-355" src="https://www.plastic-crate.co.uk/wp-content/uploads/2018/04/bulk-plastic-boxes-shipment.png" alt="bulk plastic boxes" width="752" height="802" />
        <h3>Plastic pallet boxes loading</h3>
        <img class="alignnone size-full wp-image-353" src="https://www.plastic-crate.co.uk/wp-content/uploads/2018/04/bulk-storage-bins-feature.png" alt="bulk storage bins" width="1001" height="593" />
        <h3>Plastic pallet boxes manufacturer</h3>
        <img class="alignnone size-full wp-image-354" src="https://www.plastic-crate.co.uk/wp-content/uploads/2018/04/plastic_pallet_box_manufacturer.png" alt="plastic pallet box" width="919" height="532" />
        `;

var con = mysql.createConnection({
  host: "106.15.204.243",
  user: "root",
  password: "ABCsujie168168",
  database: "nodedb"
});
var tableName = "lantingpalletboxplasticcratecouk"
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  for (let index = 0; index < 59; index++) {
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




