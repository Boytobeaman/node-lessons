var palletBoxKeywords = require('./palletBox');
var getNewArr = require('./getNewARR');

const minWordLength = 20;
const newKeywordArr = getNewArr(palletBoxKeywords, minWordLength)
console.log(newKeywordArr)
