var fs = require('fs');
var formidable = require('formidable');
var fsextra = require('fs-extra');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.end("Node-File-Upload");

    });

    app.post('/upload', function(req, res) {
        var dirname = "/home/steve/upload_dir/images";
        if (req.param('image') != undefined) {
            // Base64 String upload (Android app)
            var b64string = req.param('image');
            var buf = Buffer.from(b64string, 'base64');
            var newPath = dirname + "/" + req.param('name');
            fs.writeFile(newPath, buf, function(err) {
                if (err) {
                    res.json({ 'response': "Error" });
                } else {
                    res.json({ 'response': "Saved" });
                }
            });
        } else {
            // Multipart form upload (Web)
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {

            });
            // TODO update for multiple files?
            form.on('end', function(fields, files) {
                /* Temporary location of our uploaded file */
                var temp_path = this.openedFiles[0].path;
                /* The file name of the uploaded file */
                var file_name = this.openedFiles[0].name;
                /* Location where we want to copy the uploaded file */
                //var newPath = dirname + "/uploads/" + file_name;
                var newPath = dirname + "/" + file_name;
                fsextra.copy(temp_path, newPath, function(err) {
                    if (err) {
                        console.error(err);
                        res.json({ 'response': "Error" });
                    } else {
                        console.log("success!");
                        res.json({ 'response': "Saved" });
                    }
                });
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
                console.log(err);
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                res.write(content);
                res.end();
            }
        });

    });
};