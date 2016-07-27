var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var articleScheme = new Schema({
    title: String,
    articleHref: String,
    author: String,
    authorHref: String
});

module.exports = db.model('article', articleScheme);
