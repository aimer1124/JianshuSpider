var request = require('superagent');

exports.getPageContent = function (url, callback) {
    request.get(url).end(callback);
};
