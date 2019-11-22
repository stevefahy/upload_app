var fs = require('fs');
var formidable = require('formidable');
var fsextra = require('fs-extra');
var util = require('util');

// configuration ===============================================================
// Check for local or production environment

var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
// Samsung Series 9 laptop
//if (addresses == '192.168.192.54') {
// Dell XPS 13
if (addresses == '192.168.192.59' || addresses == '192.168.43.199' || addresses == '10.70.216.59' || addresses == '192.168.43.62') {
    // Local
    var dirname = "../upload_dir/images";
    var route_folder = '/upload';
} else {
    // Remote
    var dirname = "/home/steve/upload_dir/images";
    var route_folder = '/';
}


module.exports = function(app) {

    app.get('/', function(req, res) {
        res.end("Node-File-Upload");

    });

    app.post(route_folder, function(req, res) {
        var file_name = req.param('name');
        if (file_name != undefined) {
            // Base64 String upload (Android app)
            var b64string = req.param('image');
            var buf = Buffer.from(b64string, 'base64');
            var newPath = dirname + "/" + file_name;
            fs.writeFile(newPath, buf, function(err) {
                if (err) {
                    //console.log('error');
                    res.json({ 'response': "error" });
                } else {
                    res.json({ 'response': "saved", 'file': file_name });
                }
            });
        } else {
            // Multipart form upload (Web)
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                //console.log(util.inspect({ fields: fields, files: files }));
            });
            form.on('end', function(fields, files) {
                for (var i = 0; i < this.openedFiles.length; i++) {
                    /* Temporary location of our uploaded file */
                    var temp_path = this.openedFiles[i].path;
                    /* The file name of the uploaded file */
                    var file_name = this.openedFiles[i].name;
                    /* Location where we want to copy the uploaded file */
                    var newPath = dirname + "/" + file_name;
                    fsextra.copy(temp_path, newPath, file_name, function(err) {
                        if (err) {
                            //console.error(err);
                            res.json({ 'response': "error" });
                        } else {
                            res.json({ 'response': "saved", 'file': file_name });
                        }
                    });
                }
            });
            return;
        }
    });

    app.get('/uploads/:file', function(req, res) {
        file = req.params.file;
        file = file.substr(1, file.length);
        var dirname = "/home/steve/upload_dir/images";

        var img = fs.readFile(dirname + "/" + file, function(err, content) {
            if (err) {
                //console.log(err);
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                res.write(content);
                res.end();
            }
        });

    });
};