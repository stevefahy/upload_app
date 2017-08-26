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

// Routes
require('./routes/routes.js')(app);

app.listen(port);
console.log('The App runs on port ' + port);