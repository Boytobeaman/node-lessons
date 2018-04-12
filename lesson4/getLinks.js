var url = require('url');
// to get customize links for other sites
// promotion category like folding/stacking/pallet box/moving dolly
var total_promote_cat = [];

var foldingcrates_OBJ = require('./keywords/foldingcrates');
total_promote_cat.push(foldingcrates_OBJ)

var stackingcrates_OBJ = require('./keywords/stackingcrates');
total_promote_cat.push(stackingcrates_OBJ)

var palletbox_OBJ = require('./keywords/palletbox');
total_promote_cat.push(palletbox_OBJ)

var movingcrates_OBJ = require('./keywords/movingcrates');
total_promote_cat.push(movingcrates_OBJ)

var movingdolly_OBJ = require('./keywords/movingdolly');
total_promote_cat.push(movingdolly_OBJ)

var getRandomArrValue = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

// get a disorganized arr compared to previous one
var disorganizeArr = function (arr) {
    return arr.sort(() => Math.random() - 0.5);
};


module.exports = {
    internal: function (address) {
        var target_host = url.parse(address, true).host;
        var prefix = 'We also offer ';
        var suffix = 'We will try our best to serve you!<br>';
        var element = "";
        var newDisorderedArr = disorganizeArr(total_promote_cat.concat());
        for (let index = 0; index < newDisorderedArr.length; index++) {
            var websites = disorganizeArr(newDisorderedArr[index].websites.concat());
            websites.forEach(function (value) {
                if (url.parse(value, true).host == target_host) {
                    element += `<a href="${value}" target="_blank">${getRandomArrValue(newDisorderedArr[index].keywords)}</a>,`
                }
            })
        }
        return element != "" ? prefix + element + suffix:element;
    }, 
    outbound: function (address) {
        var target_host = url.parse(address, true).host;
        var prefix = 'You can also buy ';
        var suffix = 'Welcome to our store!<br>';
        var element = "";
        var newDisorderedArr = disorganizeArr(total_promote_cat.concat());
        for (let index = 0; index < newDisorderedArr.length; index++) {
            var websites = disorganizeArr(newDisorderedArr[index].websites.concat());
            for (let websitesIndex = 0; websitesIndex < websites.length; websitesIndex++) {
                if (url.parse(websites[websitesIndex], true).host != target_host) {
                    element += `<a href="${websites[websitesIndex]}" target="_blank">${getRandomArrValue(newDisorderedArr[index].keywords)}</a>,`
                    break
                }
            }
        }
        return element != "" ? prefix + element + suffix: element;
    },
    links: function (address) {
        return this.internal(address) + this.outbound(address);
    }
};