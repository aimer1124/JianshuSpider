var schedule = require('node-schedule');

var myInfoSchema = require('../model/myInfo');
var myPageHref = '/users/552f687b314b';
var moment = require('moment');
var today = moment(new Date()).format("YYYY-MM-DD");
var request = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var authorSchema = require('../model/author');

var articleProxy = require('../proxy/article');

function articleInfo() {

    var articleTitles = [];
    console.log('获取数据开始');
    request.get('http://www.jianshu.com/')
        .end(function (err,gres) {
            if (err){
                return next(err);
            }
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
                // console.log('并发数:' + conCurrencyCount + ',访问的页面是:' + article.authorHref + ',控制的延迟:' + delay);
                request.get('http://www.jianshu.com' + article.authorHref)
                    .end(function (err, res) {
                        if (err){
                            return next(err);
                        }

                        var $ = cheerio.load(res.text);
                        var following = $('.clearfix').find('b').eq(0).text();
                        var follower = $('.clearfix').find('b').eq(1).text();


                        articleProxy.findByHref(article.articleHref,function (err, findArticle) {
                            if (findArticle.length == 0) {
                                articleProxy.saveArticle(article);
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
            });
        });
}

function myInfo(){
    myInfoSchema.find({'date': today},function (err, result) {
        if (result.length == 0){
            request.get('http://www.jianshu.com' + myPageHref).end(function (err, res) {
                var $ = cheerio.load(res.text);
                var following = $('.clearfix').find('b').eq(0).text();
                var follower = $('.clearfix').find('b').eq(1).text();

                console.log('Sync myinfo : { data:' + today + ', following: ' + following + ', follower: ' + follower + '}');

                myInfoSchema.create({
                    userHref: myPageHref,
                    date: today,
                    following: following,
                    follower: follower
                },function (err, result) {
                    if (err) return next(err);
                });
            });
        }
    });
}

function syncData() {
    var rule = new schedule.RecurrenceRule();
    //10AM every day
    rule.second = 10;

    schedule.scheduleJob(rule, function () {
        myInfo();
        articleInfo();
    });
}

exports.syncData = syncData;
