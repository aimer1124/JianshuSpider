var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var authorScheme = new Schema({
    id: String,
    author: String,
    following: Number,
    follower: Number
});

module.exports = db.model('author', authorScheme);
