var myInfo = require('../model/myInfo');
var myPageHref = '/users/552f687b314b';

exports.getInfo = function (callback) {
    myInfo.find({'userHref': myPageHref}).limit(7).sort({ date: -1 }).exec(callback);
};

exports.getToday = function (today, callback) {
    myInfo.find({date: today}, callback);
};

exports.saveInfo = function (today, following, follower, callback) {
    myInfo.create({
        userHref: myPageHref,
        date: today,
        following: following,
        follower: follower
    }, callback);
};

exports.updateInfo = function (today, following, follower, callback) {
    myInfo.update({date: today}, {following: following, follower: follower}, callback);
};