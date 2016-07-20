var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var articleScheme = new Schema({
    title: String,
    articleHref: String,
    author: String,
    authorHref: String
});

module.exports = mongoose.model('article', articleScheme);
