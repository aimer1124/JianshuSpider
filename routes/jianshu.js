var express = require('express');
var router = express.Router();
var request = require('superagent');
var cheerio = require('cheerio');
var eventProxy = require('eventproxy');

/* GET Jinshu home page.
* showPage控制显示什么数据
* */
router.get('/', function(req, res, next) {
    var articleTitle = [];
    var userInfo = [];

    request.get('http://www.jianshu.com/')
        .end(function (err,gres) {
            if (err){
                return next(err);
            }
            console.log('首页获取结束');
            var $ = cheerio.load(gres.text);
            $('.article-list li').each(function (idx, article) {
                var $article = $(article);
                articleTitle.push({
                    articleTitle: $article.find('.title a').text(),
                    author: $article.find('.author-name').text(),
                    authorLink: 'http://www.jianshu.com' + $article.find('.author-name').attr('href'),
                    href: 'http://www.jianshu.com' + $article.find('.title a').attr('href')
                })
            });

            var ep = new eventProxy();
            ep.after('authorInfo_html',articleTitle.length,function (userInfors) {
                articleInfors = userInfors.map(function (userInfo) {
                    var articleTitle = userInfo[0];
                    var articleUrl = userInfo[1];
                    var authorHtml = userInfo[2];
                    var authorUrl = userInfo[3];
                    var $ = cheerio.load(authorHtml);
                    var author = $('.basic-info').find('h3').text();
                    var following = $('.clearfix').find('b').eq(0).text();
                    var follower = $('.clearfix').find('b').eq(1).text();
                    return ({
                        articleTitle: articleTitle,
                        articleUrl: articleUrl,
                        author: author,
                        authorUrl: authorUrl,
                        following: following,
                        follower: follower
                    });
                });

                res.render('jianshu', { title: '简书',articleTitle: articleTitle,showPage:0,articleInfors: articleInfors });
            });

            articleTitle.forEach(function (article) {
                console.log('获取:' + article.authorLink + '中');
                request.get(article.authorLink)
                    .end(function (err, res) {
                        console.log('获取:' + article.authorLink + '完成');
                        var $ = cheerio.load(res.text);
                        console.log('Init following is :' + $('.clearfix li b').eq(0).text());
                        ep.emit('authorInfo_html',[article.articleTitle,article.href,res.text,article.authorLink]);
                    });
            });
        });
});

module.exports = router;
