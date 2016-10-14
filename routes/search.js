var express = require('express');
var router = express.Router();
var article = require('../proxy/article');

/* Search. */
router.get('/', function(req, res, next) {
    res.render('search', {});
});

router.post('/', function (req, res, next) {
    var searchContent = req.body.searchContent;
    article.findByTitle(searchContent, function (err, result) {
        res.render('search', {searchContent: searchContent, result: result});
    });
});

module.exports = router;
