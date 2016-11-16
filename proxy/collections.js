var collectionInfo = require('../model/collections');

exports.getAllCollections = function (callback) {
    collectionInfo.find({}).limit(20).sort({follower: -1}).exec(callback);
};

exports.saveAndUpdateCollections = function (collection, callback) {

    collectionInfo.find({"id": collection.id}, function (err, findCollection) {
        if (err) console.log(err);
        if (findCollection.length == 0) {
            // console.log('Not find collection:' + collection.id + ', title:' + collection.title + ', save it.');
            collectionInfo.create({
                id: collection.id,
                title: collection.title,
                articleCount: collection.articleCount,
                follower: collection.follower,
                description: collection.description
            }, callback);
        } else {
            // console.log('Find collection:' + collection.id + ', title:' + collection.title + ', follower:' + collection.follower + ', articleCount:' + collection.articleCount);
            collectionInfo.findOneAndUpdate({id: collection.id},
                {
                    id: collection.id,
                    title: collection.title,
                    articleCount: collection.articleCount,
                    follower: collection.follower,
                    description: collection.description
            }, callback);
        }
    });
};