var article = require('../model/article');

exports.getAllArticles = function (callback) {
    article.find({},callback)
};