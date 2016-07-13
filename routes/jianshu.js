var express = require('express');
var router = express.Router();
var request = require('superagent');
var cheerio = require('cheerio');

/* GET Jinshu home page. */
router.get('/', function(req, res, next) {
    var articleTitle = [];
    request.get('http://www.jianshu.com/')
        .end(function (err,gres) {
            if (err){
                return next(err);
            }
            var $ = cheerio.load(gres.text);
            $('li .title').each(function (idx, title) {
                var $title = $(title);
                articleTitle.push({articleTitle:$title.text()})
            });
            res.render('jianshu', { title: '简书',articleTitle: articleTitle });
        });

});

module.exports = router;
