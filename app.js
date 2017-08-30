/**
 * Module dependencies.
 */
var express = require('express');
var connect = require('connect');
var bodyParser = require('body-parser');
var app = express();
var formidable = require('formidable');
var port = process.env.PORT || 8060;

// Configuration
app.use(express.static(__dirname + '/public'));
app.use(connect.cookieParser());
app.use(connect.logger('dev'));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// CORS for localhost testing
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Routes
require('./routes/routes.js')(app);

app.listen(port);
console.log('The App runs on port ' + port);