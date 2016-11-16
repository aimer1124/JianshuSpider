var mongoose = require('mongoose');
var dbConnect = require('./config');
var db = mongoose.createConnection('mongodb://' + dbConnect.dbUrl);

var Schema = mongoose.Schema;

var collectionsScheme = new Schema({
    id: {type: String, required: true},
    title: {type: String, required: true},
    articleCount: {type: Number, required: true},
    follower: {type: Number, required: true},
    description: {type: String}
});

module.exports = db.model('collections', collectionsScheme);