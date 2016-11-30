var schedule = require('node-schedule');

var myPageHref = '/users/552f687b314b';
var moment = require('moment');
var today = moment(new Date()).format("YYYY-MM-DD");
var cheerio = require('cheerio');
var async = require('async');
var sleep = require('sleep');

var getURL = require('../proxy/getURL');
var articleProxy = require('../proxy/article');
var userProxy = require('../proxy/user');
var myInfoProxy = require('../proxy/myInfo');
var collectionsProxy = require('../proxy/collections');

function articleInfo() {

    var articleTitles = [];
    // console.log('获取数据开始');
    getURL.getPageContent('/', function (err, gres, next) {

        if (err) {
            console.log("访问首页失败");
        } else {
            var $ = cheerio.load(gres.text);
            $('.article-list li').each(function (idx, article) {
                var $article = $(article);
                articleTitles.push({
                    articleTitle: $article.find('.title a').text(),
                    author: $article.find('.author-name').text(),
                    authorHref: $article.find('.author-name').attr('href'),
                    articleHref: $article.find('.title a').attr('href')
                });
            });

            var conCurrencyCount = 0;
            var fetchUrl = function (article, callback) {
                var delay = parseInt((Math.random() * 10000000) % 2000, 10);
                conCurrencyCount++;
                // console.log('并发数:' + conCurrencyCount + ',访问的页面是:' + article.authorHref + ',控制的延迟:' + delay);
                getURL.getPageContent(article.authorHref, function (err, res) {
                    if (err) {
                        console.log('访问页面:' + article.authorHref + '失败');
                    } else {
                        var $ = cheerio.load(res.text);
                        var favorite = $('.clearfix').find('b').eq(4).text();
                        var follower = $('.clearfix').find('b').eq(1).text();


                        articleProxy.findByHref(article.articleHref, function (err, findArticle) {
                            if (findArticle.length == 0) {
                                articleProxy.saveArticle(article);
                            }
                        });

                        userProxy.getUserById(article.authorHref, function (err, findAuthor) {
                            if (findAuthor.length == 0) {
                                userProxy.saveUser(article, favorite, follower, function (err) {
                                    if (err) console.log(err);
                                });
                            } else {
                                userProxy.updateUser(article, favorite, follower, function (err) {
                                    if (err) console.log(err);
                                })
                            }
                        });
                    }
                });
                setTimeout(function () {
                    conCurrencyCount--;
                    callback(null, article + ' html content');
                }, delay);
            };

            async.mapLimit(articleTitles, 5, function (article, callback) {
                fetchUrl(article, callback);
            }, function (err) {
                if (err) return next(err);
                // console.log('获取数据结束');
            });
        }
    });
}

function getMyInfo() {
    myInfoProxy.getToday(today, function (err, result) {
        getURL.getPageContent(myPageHref, function (err, res) {
            if (err) {
                console.log('访问页面:' + myPageHref + '失败');
            } else {
                var $ = cheerio.load(res.text);
                var favorite = $('.clearfix').find('b').eq(4).text();
                var follower = $('.clearfix').find('b').eq(1).text();

                if (result.length == 0) {
                    myInfoProxy.saveInfo(today, favorite, follower, function (err) {
                        if (err) return next(err);
                    });
                } else {
                    myInfoProxy.updateInfo(today, favorite, follower, function (err) {
                        if (err) return next(err);
                    })
                }
            }
        });
    });
}

function getCollections() {
    var now = moment().format('x');

    for(var count = 0; count < 50; count++){
        sleep.sleep(1);
        getURL.getPageContent("/collections?page=" + count + "&_=" + now, function (err, res) {
            if (err) {
                console.log('访问页面:' + "/collections?page=" + count + "&_=" + now + '失败');
            } else {
                var $ = cheerio.load(res.text);
                if ($('div').find('h1').text() == "您要找的页面不存在") {
                    console.log('页面不存在');
                    count = 50;
                } else {
                    $('#all-collections li .collections-info').each(function (idx, collectionEle) {
                        var href = $(collectionEle).find('h5 a').attr('href');
                        var articleCount = $(collectionEle).find('.blue-link').text();
                        var follower = getCollectionFollower($(collectionEle).find('p').last().text());
                        var collection = [];
                        collection.push({
                            id: href.split('/')[href.split('/').length - 1].toString(),
                            title: $(collectionEle).find('h5 a').text(),
                            articleCount: articleCount.split('篇')[0],
                            follower: follower,
                            description: $(collectionEle).find('.description').text()
                        });
                        collectionsProxy.saveAndUpdateCollections(collection[0],function (err) {
                            if (err)
                                console.log('保存失败'+ err);
                        });
                    });
                }
            }
        })
    }

}


function getCollectionFollower(content) {
    var splitContent = content.split('·')[content.split('·').length - 1];
    var follower = splitContent.split('人')[0];
    if (follower.indexOf('K') > -1) {
        return follower.split('K')[0] * 1000;
    }else {
        return follower;
    }
}

function syncMyInfoAndArticle() {

    //every 5 Minutes
    schedule.scheduleJob("*/5 * * * *", function () {
        console.log('Sync myInfo and article...');
        articleInfo();
        getMyInfo();
    });

}

function syncCollections() {

    //every 4 Hours
    schedule.scheduleJob("* * */6 * *", function () {
        console.log('Sync collections...');

        getCollections();
    });
}

function syncData() {

    syncMyInfoAndArticle();

    syncCollections();
}

exports.syncData = syncData;
