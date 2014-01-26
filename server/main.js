var fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    db;

// Create the "uploads" folder if it doesn't exist
fs.exists(__dirname + '/uploads', function (exists) {
    if (!exists) {
        console.log('Creating directory ' + __dirname + '/uploads');
        fs.mkdir(__dirname + '/uploads', function (err) {
            if (err) {
                console.log('Error creating ' + __dirname + '/uploads');
                process.exit(1);
            }
        })
    }
});

// Connect to database
var url = "mongodb://localhost:27017/PictureFeed";
MongoClient.connect(url, {native_parser: true}, function (err, connection) {
    if (err) {
        console.log("Cannot connect to database " + url);
        process.exit(1);
    }
    db = connection;
});

exports.getImages = function(req, res, next) {
    var images = db.collection('images');

    images.find().sort({ _id: -1 }).limit(20).toArray(function (err, data) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(data);
    });
};

exports.addImage = function(req, res, next) {

    console.log("upload");

    var file = req.files.file,
        filePath = file.path,
//        fileName = file.name, file name passed by client. Not used here. We use the name auto-generated by Node
        lastIndex = filePath.lastIndexOf("/"),
        tmpFileName = filePath.substr(lastIndex + 1),
        image = req.body,
        images = db.collection('images');

    image.fileName = tmpFileName;
    console.log(tmpFileName);

    images.insert(image, function (err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(image);
    });

};