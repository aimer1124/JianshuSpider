var express = require('express');
var router = express.Router();
var article = require('../proxy/article');
var user = require('../proxy/user');

/* Search. */
router.get('/', function(req, res, next) {
    res.render('search', {});
});

router.post('/', function (req, res, next) {
    var searchContent = req.body.searchContent;
    var searchType = req.body.searchType;
    switch(searchType){
        case 'article':
            article.findByTitle(searchContent, function (err, result) {
                if (err) return next(err);
                res.render('search', {searchContent: searchContent, searchType: searchType, result: result});
            });
            break;
        case 'author':
            user.findUserByName(searchContent, function (err, result) {
                if (err) return next(err);
                res.render('search', {searchContent: searchContent, searchType: searchType, result: result});
            });
            break;
        default:
            res.render('error', {
                message: "未找到匹配的类型",
                error: ''
            });
    }
});

module.exports = router;
