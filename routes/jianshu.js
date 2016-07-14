var express = require('express');
var router = express.Router();
var request = require('superagent');
var cheerio = require('cheerio');

/* GET Jinshu home page.
* showPage控制显示什么数据
* */
router.get('/', function(req, res, next) {
    var articleTitle = [];
    request.get('http://www.jianshu.com/')
        .end(function (err,gres) {
            if (err){
                return next(err);
            }
            var $ = cheerio.load(gres.text);
            $('.article-list li').each(function (idx, article) {
                var $article = $(article);
                articleTitle.push({
                    articleTitle: $article.find('.title a').text(),
                    author: $article.find('.author-name').text(),
                    href: 'http://www.jianshu.com'+$article.find('.title a').attr('href')
                })
            });
            res.render('jianshu', { title: '简书',articleTitle: articleTitle,showPage:0 });
        });
});

module.exports = router;
