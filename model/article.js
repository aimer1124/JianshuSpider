var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var articleScheme = new Schema({
    title: String,
    href: String
});

module.exports = mongoose.model('article', articleScheme);
