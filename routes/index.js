var express = require('express');
var router = express.Router();
var moment = require('moment');
var today = moment(new Date()).format("YYYY-MM-DD");
var request = require('superagent');
var cheerio = require('cheerio');

var convertString = require('../util/convertString');
var myPageHref = '/users/552f687b314b';
var myInfoSchema = require('../model/myInfo');

/* GET home page. */
router.get('/', function(req, res, next) {
  myInfoSchema.find({'date': today},function (err, result) {
    if (result.length == 0){
      request.get('http://www.jianshu.com' + myPageHref).end(function (err, res) {
        var $ = cheerio.load(res.text);
        var following = $('.clearfix').find('b').eq(0).text();
        var follower = $('.clearfix').find('b').eq(1).text();
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
  myInfoSchema.find({'userHref': myPageHref},function (err, result) {
    var myInfo = [];
    var myArticle = [];

    result.forEach(function (info) {
      // console.log('Date:' + info.date);
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
                reading: convertString($article.find('.list-footer a').eq(0).text()),
                comment: convertString($article.find('.list-footer a').eq(1).text()),
                favorite: convertString($article.find('.list-footer span').text())
            })
          });
          res.render('index', {info: myInfo,myArticle: myArticle});
        });
  });

});

module.exports = router;
