var mongoose = require('mongoose');
var dbConnect = require('./config');
var db = mongoose.createConnection('mongodb://' + dbConnect.dbUrl);

var Schema = mongoose.Schema;

var myInfoScheme = new Schema({
    userHref: {type: String, required:true},
    date: {type: String, required:true},
    favorite: {type: Number, required:true},
    follower: {type: Number, required:true}
});

module.exports = db.model('myInfo', myInfoScheme);
