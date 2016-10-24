var fs = require('fs');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var mv = require('mv');
//
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(req.body.folder);
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({
    storage: storage
});

function toJsonString(object) {
    return JSON.stringify(object);
}

router.post('/upload', upload.array('photos', 100), function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var returnData = {
        isSuccess: !!req.files && req.files.length > 0
    };

    if (req.files.length == 0) {
        returnData.errorMsg = "Please upload at least 1 file"
    } else {
        returnData.files = req.files;

        returnData.files.map(function (file) {
            mv("public/uploads/" + file.originalname, 'public/images/' + req.body.folder + '/' + file.originalname, {mkdirp: true}, function (err) {
                // console.log(err)
            });

            file.destination = 'images/' + req.body.folder + '/';
            file.path = "images/" + req.body.folder + "/" + file.originalname;
            file.fullPath = "http://blog.ripzery.com:3000/" + file.path;
            return file
        });
    }

    res.write(toJsonString(returnData));
    res.end();
});

module.exports = router;
