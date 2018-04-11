var url = require('url');
var adr = 'http://www.joinplastic.com/products/stackableBox/stackableBox.php';
var _ = require("lodash");
var tempArr =[2,3,4,5,7,8,9]

// console.log(_.sample(tempArr));
// console.log(_.take(_.shuffle(tempArr),4));
// console.log()


const getLinkStr = require('./getLinks');


console.log(getLinkStr.links(adr))





