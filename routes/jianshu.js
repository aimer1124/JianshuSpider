var express = require('express');
var router = express.Router();
var request = require('superagent');
var cheerio = require('cheerio');
// var eventProxy = require('eventproxy');
var async = require('async');
var articleScheme = require('../model/article');

/* GET Jinshu home page.
* */
router.get('/', function(req, res, next) {
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
                    authorLink: 'http://www.jianshu.com' + $article.find('.author-name').attr('href'),
                    href: 'http://www.jianshu.com' + $article.find('.title a').attr('href')
                })
            });

            var conCurrencyCount = 0;
            var fetchUrl = function (article, callback) {
                var delay = parseInt((Math.random() * 10000000) % 2000,10);
                conCurrencyCount++;
                console.log('并发数:' + conCurrencyCount + ',访问的页面是:' + article.authorLink + ',控制的延迟:' + delay);
                request.get(article.authorLink)
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
                            articleUrl: article.href,
                            author: author,
                            authorUrl: article.authorLink,
                            following: following,
                            follower: follower
                        });
                        articleScheme.create({
                            title: article.articleTitle,
                            href: article.href
                        },function(err, result) {
                            if (err) return next(err);
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

                res.render('jianshu', { title: '简书', results: results});
            });

        });
});

module.exports = router;
