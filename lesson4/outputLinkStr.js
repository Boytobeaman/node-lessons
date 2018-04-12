var url = require('url');
var adr = 'http://www.joinplastic.com/products/stackableBox/stackableBox.php';
var _ = require("lodash");
var tempArr =[2,3,4,5,7,8,9]
var mysql = require('mysql');

// console.log(_.sample(tempArr));
// console.log(_.take(_.shuffle(tempArr),4));
// console.log()


const getLinkStr = require('./getLinks');

var urlARR = [];

for (let index = 0; index < 4; index++) {
    var onelinkArr = getLinkStr.links(adr);
    urlARR.push(onelinkArr)
}

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
    urlARR.forEach(function (item,index) {
        var sql = "update " + tableName +" set backlinks="+item+" where id="+ index+";"
    })
})





