var subdomain = require('express-subdomain');
var express = require('express');
var path = require('path');
var https = require('https');
var http = require('http');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
const routes = require('./routes/index');
var image = require('./routes/upload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// This line is from the Node.js HTTPS documentation.
var options = {
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('fullchain.pem')
};

// Create an HTTPS service identical to the HTTP service.

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(subdomain('api', routes));
app.use(subdomain('api', image));

https.createServer(options, app).listen(3002, function(){
    console.log("started !");
});

module.exports = app;
