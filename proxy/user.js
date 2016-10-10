var user = require('../model/user');

exports.getUsers = function (callback) {
    user.find({}).limit(20).sort({ follower: -1}).exec(callback);
};
