var collectionInfo = require('../model/collections');

exports.getAllCollections = function (callback) {
    collectionInfo.find({}).limit(20).sort({follower: -1}).exec(callback);
};

exports.saveAndUpdateCollections = function (collection, callback) {

    collectionInfo.find({"id": collection.id}, function (err, findCollection) {
        if (err) return next(err);
        if (findCollection.length == 0) {
            collectionInfo.create({
                id: collection.id,
                title: collection.title,
                articleCount: collection.articleCount,
                follower: collection.follower,
                description: collection.description
            }, callback);
        } else {
            collectionInfo.update({"id": collection.id}, {
                title: collection.title,
                articleCount: collection.articleCount,
                follower: collection.follower,
                description: collection.summary
            }, callback);
        }
    });
};