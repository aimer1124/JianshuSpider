var express = require('express');
var router = express.Router();

var collections = require('../proxy/collections');

/* GET Jianshu home page.
 * */

router.get('/',function (req, res,next){
    collections.getAllCollections(function (err, collections) {
        if (err) return next(err);
        res.render('collections', {result: collections});
    });
});

module.exports = router;
