var express = require("express"); // include express module
var multer = require('multer'); // include multer module
var app = express(); // get express object
var upload = multer({  
    dest: './uploads/'
});

app.use(multer({ 
    dest: './uploads/',
    rename: function(fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function(file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function(file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
}));


// call get method
app.get('/', function(req, res) {    
    res.sendFile(__dirname + "/index.html");
});

// call post method
app.post('/api/photo', function(req, res) {

    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

module.exports = app;