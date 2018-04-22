var url = require('url');
var addr = 'http://www.joinplastic.com/products/stackableBox/stackableBox.php';
var _ = require("lodash");
var tempArr =[2,3,4,5,7,8,9]
var mysql = require('mysql');



const getLinkStr = require('./getLinks');
const output = getLinkStr.links(addr)
console.log(output);

var urlARR = [];


// var con = mysql.createConnection({
//     host: "106.15.204.243",
//     user: "root",
//     password: "ABCsujie168168",
//     database: "nodedb"
// });
// var tableName = "lantingpalletbox180411"
// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//     urlARR.forEach(function (item,index) {
//         var sql = "update " + tableName +" set backlinks="+item+" where id="+ index+";"
//     })
// })