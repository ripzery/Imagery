var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

var getContentByNameLists = function (folder, contents) {
    var contentList = [];
    contents.forEach(function (f) {
        contentList.push({name: f});
    });

    var contentContainer = {
        rootPath: "/images/" + folder + "/",
        images: contentList
    };

    return JSON.stringify(contentContainer);
}

var getCoverFromContents = function (folder, contents) {
    return "/images/" + folder + "/" + contents[0];
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Ripzery\'s API'});
});

router.get('/images', function (req, res, next) {
    var availableDirs = getDirectories(__dirname + '/../public/images');
    if (req.query.type != null && availableDirs.indexOf(req.query.type) != -1) {
        var folder = req.query.type;
        fs.readdir(__dirname + '/../public/images/' + folder, function (error, contents) {
            res.writeHead(200);
            res.write(getContentByNameLists(folder, contents));
            res.end();
        });
    } else if (req.query.type != null) {
        res.writeHead(200);
        res.write("That folder doesn't existed...");
        res.end();
    } else {
        res.writeHead(200);
        res.write("Please specify \"type\" parameter");
        res.end();
    }

});

router.post('/getTypes', function (req, res, next) {
    var availableDirs = getDirectories(__dirname + '/../public/images');
    var folderList = [];
    var cover = "";
    availableDirs.forEach(function (f) {
        fs.readdir(__dirname + '/../public/images/' + f, function (error, contents) {
            cover = getCoverFromContents(f, contents);
            folderList.push({name: f, cover: cover});

            if (folderList.length == availableDirs.length) {
                var returnData = JSON.stringify({"folders": folderList});
                res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
                res.write(returnData);
                res.end();
            }
        });
    });
});

router.get('/upload', upload.array('photos', 100), function (req, res, next) {
    res.render('index', {title: 'Ripzery\'s API'});
    // res.writeHead(200, {"Content-Type": "application/json"});
    // var returnData = {
    //     isSuccess: !!req.files && req.files.length > 0
    // };
    //
    // if (req.files.length == 0) {
    //     returnData.errorMsg = "Please upload at least 1 file"
    // } else {
    //     returnData.files = req.files;
    //
    //     returnData.files.map(function (file) {
    //         mv("public/uploads/" + file.originalname, 'public/images/' + req.body.folder + '/' + file.originalname, {mkdirp: true}, function (err) {
    //             // console.log(err)
    //         });
    //
    //         file.destination = 'images/' + req.body.folder + '/';
    //         file.path = "images/" + req.body.folder + "/" + file.originalname;
    //         file.fullPath = "https://api.ripzery.com/" + file.path;
    //         return file
    //     });
    // }
    //
    // res.write(toJsonString(returnData));
    // res.end();
});

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter(function (file) {
        return fs.statSync(path.join(srcPath, file)).isDirectory();
    });
}

module.exports = router;
