var express = require('express');
var router = express.Router();

var request = require('superagent');
var cheerio = require('cheerio');
var myPageHref = '/users/552f687b314b';
var myInfoSchema = require('../model/myInfo');

/* GET home page. */
router.get('/', function(req, res, next) {
  myInfoSchema.find({'date': new Date().toDateString()},function (err, result) {
    if (result.length == 0){
      request.get('http://www.jianshu.com' + myPageHref).end(function (err, res) {
        var $ = cheerio.load(res.text);
        var following = $('.clearfix').find('b').eq(0).text();
        var follower = $('.clearfix').find('b').eq(1).text();
        myInfoSchema.create({
          userHref: myPageHref,
          date: new Date().toDateString(),
          following: following,
          follower: follower
        },function (err, result) {
          if (err) return next(err);
        });
      });
    }
  });
  myInfoSchema.find({'userHref': '/users/552f687b314b'},function (err, result) {
    var myInfo = [];
    result.forEach(function (info) {
      // console.log('Date:' + info.date);
      myInfo.push({
        date: info.date,
        following: info.following,
        follower: info.follower
      });
    });
    res.render('index', { title: '简书爬虫' ,info: myInfo});
  });


});

module.exports = router;
