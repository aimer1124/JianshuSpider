var user = require('../model/user');

exports.getUsers = function (callback) {
    user.find({}).limit(20).sort({ follower: -1}).exec(callback);
};

exports.getUserById = function (id, callback) {
    user.find({id: id}, callback);
};

exports.findUserByName = function (name, callback) {
    var findContent = { 'author': { $regex:  name}};
    user.find(findContent, callback);
};


exports.saveUser = function (article, following, follower, callback) {
    user.create({
        id: article.authorHref,
        author: article.author,
        following: following,
        follower: follower
    }, callback)
};

exports.updateUser = function (article, following, follower, callback) {
    user.update({id: article.authorHref}, {following: following, follower: follower},callback)
};