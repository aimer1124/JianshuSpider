var request = require('superagent');

exports.getPageContent = function (url, callback) {
    // console.log("Get URL : " + url);
    request.get('http://www.jianshu.com' + url)
            .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36")
            .end(callback);
};
