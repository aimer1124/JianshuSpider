var myInfo = require('../model/myInfo');
var myPageHref = '/users/552f687b314b';

exports.getInfo = function (callback) {
    myInfo.find({'userHref': myPageHref}).limit(7).sort({ date: -1 }).exec(callback);
};
