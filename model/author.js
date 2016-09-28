var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var authorScheme = new Schema({
    id: {type:String, required:true},
    author: {type:String, required:true},
    following: {type:Number, required:true},
    follower: {type:Number, required:true}
});

module.exports = db.model('author', authorScheme);
