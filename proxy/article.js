var article = require('../model/article');

exports.getAllArticles = function (callback) {
    article.find({}).limit(20).sort({ _id: -1}).exec(callback);
};

exports.findByHref = function (articleHref, callback) {
    article.find({ "articleHref": articleHref}, callback)
};

exports.saveArticle = function (articleInfo, callback) {
    article.create({
        title: articleInfo.articleTitle,
        articleHref: articleInfo.articleHref,
        author: articleInfo.author,
        authorHref: articleInfo.authorHref
    }, callback);
};