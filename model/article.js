var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var articleScheme = new Schema({
    title: {type:String, required:true},
    articleHref: {type:String, required:true},
    author: {type:String, required:true},
    authorHref: {type:String, required:true}
});

module.exports = db.model('article', articleScheme);
