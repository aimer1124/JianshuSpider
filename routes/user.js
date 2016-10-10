var express = require('express');
var router = express.Router();
var user = require('../proxy/user');

/* GET user listing. */
router.get('/', function(req, res, next) {
    user.getUsers(function (err, users) {
        res.render('user', {users: users});
    });
});

module.exports = router;
