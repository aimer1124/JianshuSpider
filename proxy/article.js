var article = require('../model/article');

exports.getAllArticles = function (callback) {
    article.find({},callback)
};

exports.findByHref = function (articleHref, callback) {
    article.find({articleHref: articleHref}, callback)
};

exports.save = function (articleInfo, callback) {
    article.create({
        title: articleInfo.articleTitle,
        articleHref: articleInfo.articleHref,
        author: articleInfo.author,
        authorHref: articleInfo.authorHref
    },callback);
};