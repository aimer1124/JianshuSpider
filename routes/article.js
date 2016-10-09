var express = require('express');
var router = express.Router();

var article = require('../proxy/article');

/* GET Jianshu home page.
* */

router.get('/',function (req, res,next){
    article.getAllArticles(function (err, articles) {
        if (err) return next(err);
        res.render('article', {articles: articles});
    });

});

module.exports = router;
