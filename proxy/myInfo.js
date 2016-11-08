var myInfo = require('../model/myInfo');
var myPageHref = '/users/552f687b314b';

exports.getInfo = function (callback) {
    myInfo.find({'userHref': myPageHref}).limit(30).sort({ date: -1 }).exec(callback);
};

exports.getToday = function (today, callback) {
    myInfo.find({date: today}, callback);
};

exports.saveInfo = function (today, favorite, follower, callback) {
    myInfo.create({
        userHref: myPageHref,
        date: today,
        favorite: favorite,
        follower: follower
    }, callback);
};

exports.updateInfo = function (today, favorite, follower, callback) {
    myInfo.findOneAndUpdate({date: today}, {favorite: favorite, follower: follower}, callback);
};