var express = require('express');
var router = express.Router();
var articleSchema = require('../model/article');

/* GET Jinshu home page.
* */

router.get('/',function (req, res,next){
    var results = [];
    articleSchema.find({},function (err, result) {
        if (err) return next(err);
        result.forEach(function (article) {
            results.push({
                articleTitle: article.title,
                articleHref: article.articleHref,
                author: article.author,
                authorHref: article.authorHref
            });
        });
        res.render('jianshu', {results: results});
    });
});

module.exports = router;
