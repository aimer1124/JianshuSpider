var request = require('superagent');

exports.getPageContent = function (url, callback) {
    request.get('http://www.jianshu.com' + url).end(callback);
};
