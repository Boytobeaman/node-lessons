var _ = require('lodash');
var arr =
    [
        { "key": "key3", "value": "value3", "createTime": "124596216" },
        { "key": "key4", "value": "value4", "createTime": "124596286" },
        { "key": "key5", "value": "value5", "createTime": "124596289" },
        { "key": "key1", "value": "value1", "createTime": "124573216" },
        { "key": "key2", "value": "value2", "createTime": "124593216" },
        
    ]

var bb = _.sortBy(arr, function (item) {
    return item.key;
});
console.log(bb)