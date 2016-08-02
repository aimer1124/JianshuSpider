var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var myInfoScheme = new Schema({
    userHref: String,
    date: String,
    following: Number,
    follower: Number
});

module.exports = db.model('myInfo', myInfoScheme);
