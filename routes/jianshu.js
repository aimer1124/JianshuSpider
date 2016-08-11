var express = require('express');
var router = express.Router();
var request = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var articleSchema = require('../model/article');
var authorSchema = require('../model/author');

/* GET Jinshu home page.
* */

router.get('/',function (req, res,next){
    var results = [];
    articleSchema.find({},function (err, result) {
        if (err) return next(err);
        result.forEach(function (article) {
            results.push({
                articleTitle: article.title,
                articleHref: article.articleHref,
                author: article.author,
                authorHref: article.authorHref
            });
        });
        res.render('jianshu', {results: results});
    });
    // var articles = new article();
    // res.render('jianshu', {results: articles.getAllArticles()});
});

router.get('/sync', function(req, res, next) {
    var articleTitles = [];
    var results = [];

    request.get('http://www.jianshu.com/')
        .end(function (err,gres) {
            if (err){
                return next(err);
            }
            console.log('首页获取结束');
            var $ = cheerio.load(gres.text);
            $('.article-list li').each(function (idx, article) {
                var $article = $(article);
                articleTitles.push({
                    articleTitle: $article.find('.title a').text(),
                    author: $article.find('.author-name').text(),
                    authorHref: $article.find('.author-name').attr('href'),
                    articleHref: $article.find('.title a').attr('href')
                })
            });

            var conCurrencyCount = 0;
            var fetchUrl = function (article, callback) {
                var delay = parseInt((Math.random() * 10000000) % 2000,10);
                conCurrencyCount++;
                console.log('并发数:' + conCurrencyCount + ',访问的页面是:' + article.authorHref + ',控制的延迟:' + delay);
                request.get('http://www.jianshu.com' + article.authorHref)
                    .end(function (err, res) {
                        if (err){
                            return next(err);
                        }
                        var $ = cheerio.load(res.text);
                        var author = $('.basic-info').find('h3').text();
                        var following = $('.clearfix').find('b').eq(0).text();
                        var follower = $('.clearfix').find('b').eq(1).text();
                        results.push({
                            articleTitle: article.articleTitle,
                            articleHref: article.articleHref,
                            author: author,
                            authorHref: article.authorHref,
                            following: following,
                            follower: follower
                        });
                        articleSchema.find({articleHref:article.articleHref},function (err, findArticle) {
                            if (findArticle.length == 0) {
                                articleSchema.create({
                                    title: article.articleTitle,
                                    articleHref: article.articleHref,
                                    author: article.author,
                                    authorHref: article.authorHref
                                },function(err, result) {
                                    if (err) return next(err);
                                });
                            }
                        });
                        authorSchema.find({id:article.authorHref},function (err, findAuthor) {
                            if (findAuthor.length == 0) {
                                authorSchema.create({
                                    id: article.authorHref,
                                    author: article.author,
                                    following: following,
                                    follower: follower
                                },function(err, result) {
                                    if (err) return next(err);
                                });
                            }
                        });
                    });
                setTimeout(function () {
                    conCurrencyCount--;
                    callback(null,article + ' html content');
                },delay);
            };

            async.mapLimit(articleTitles,5,function (article, callback) {
                fetchUrl(article,callback);
            },function (err, result) {
                console.log('获取数据结束');
                var resultsAllArticles = [];
                articleSchema.find({},function (err, result) {
                    if (err) return next(err);
                    result.forEach(function (article) {
                        resultsAllArticles.push({
                            articleTitle: article.title,
                            articleHref: article.articleHref,
                            author: article.author,
                            authorHref: article.authorHref
                        });
                    });
                    res.render('jianshu', {results: resultsAllArticles});
                });
            });

        });
});

module.exports = router;
