var express = require('express');
var router = express.Router();
var moment = require('moment');
var today = moment(new Date()).format("YYYY-MM-DD");
var request = require('superagent');
var cheerio = require('cheerio');

var syncData = require('../util/syncData');
syncData.syncData();

var convertString = require('../util/convertString');
var myPageHref = '/users/552f687b314b';
var myInfoSchema = require('../model/myInfo');

/* GET home page. */
router.get('/', function(req, res, next) {

  myInfoSchema.find({'userHref': myPageHref}).limit(7).sort({ date: -1 }).exec(function (err, result) {
    var myInfo = [];
    var myArticle = [];

    result.forEach(function (info) {
      myInfo.push({
        date: info.date,
        following: info.following,
        follower: info.follower
      });
    });
    request.get('http://www.jianshu.com' + myPageHref)
        .end(function (err, resT) {
          var $ = cheerio.load(resT.text);
          $('.article-list li').each(function (idx, article) {
            var $article = $(article);
            myArticle.push({
                article: $article.find('.title a').text(),
                publishDate: $article.find('.time').attr('data-shared-at').split('T')[0],
                articleHref: $article.find('.title a').attr('href').split(' '),
                reading: convertString.getLatestNumberWithSpace($article.find('.list-footer a').eq(0).text()),
                comment: convertString.getLatestNumberWithSpace($article.find('.list-footer a').eq(1).text()),
                favorite: convertString.getLatestNumberWithSpace($article.find('.list-footer span').text())
            })
          });
          res.render('index', {info: myInfo,myArticle: myArticle});
        });
  });

});

module.exports = router;
