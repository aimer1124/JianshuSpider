function getLatestNumberWithSpace(string) {
    var splittedString = string.split(' ');
    return splittedString[splittedString.length-1]
}

exports.getLatestNumberWithSpace = getLatestNumberWithSpace;