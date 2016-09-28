var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/jianshu');

var Schema = mongoose.Schema;

var myInfoScheme = new Schema({
    userHref: {type: String, required:true},
    date: {type: String, required:true},
    following: {type: Number, required:true},
    follower: {type: Number, required:true}
});

module.exports = db.model('myInfo', myInfoScheme);
