var request = require('superagent');

exports.getPageContent = function (url, callback) {
    // console.log(url);
    request.get('http://www.jianshu.com' + url)
        .end(callback);
};
