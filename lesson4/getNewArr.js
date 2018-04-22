function getNewArr(rawArray,minWordLength) {
    var PBArray = [];
    while (rawArray.length > 0) {
        const first = rawArray[0];
        if (first.length < minWordLength && rawArray.length > 1) {
            for (let index = 1; index < rawArray.length; index++) {
                if (rawArray[index].length < minWordLength) {
                    var newStr = first + ' ' + rawArray[index];
                    PBArray.push(newStr);
                    rawArray.splice(index, 1);
                    rawArray.splice(0, 1);
                    break
                } else if (index == rawArray.length - 1) {
                    PBArray.push(first);
                    rawArray.splice(0, 1)
                }
            }
        } else {
            PBArray.push(first);
            rawArray.splice(0, 1)
        }
        // console.log(PBArray)
        // console.log(rawArray)
    }
    return PBArray;
}

module.exports = getNewArr;