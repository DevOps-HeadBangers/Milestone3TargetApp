var express = require("express"); // include express module
var multer = require('multer'); // include multer module
var app = express(); // get express object
var sio = require('socket.io')
  , http = require('http');
var upload = multer({  
    dest: './uploads/'
});
var SMSClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

var highestUploadSize = 0;
var numberOfUploads = 0;
var totalUploadSize = 0;
var MAX_UPLOAD = 10000000;
var refDate = 0;
bigUploadCount = 0;

var app1 = http.createServer(function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end();
    })
  , io = sio.listen(app1);

app.use(multer({ 
    dest: './uploads/',
    rename: function(fieldname, filename) {
	return filename + Date.now();
    },
    onFileUploadStart: function(file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function(file) {
	numberOfUploads++;
	totalUploadSize += file.size;

	if(file.size > 1000000){
		console.log("Encountered big upload!");
		bigUploadCount++;

		if(file.size > highestUploadSize)
			highestUploadSize = file.size		

		if(refDate == 0)
			refDate = new Date();
		else{
			now = new Date();
			if (((now.getTime() - refDate.getTime())/1000 < 60)){
				if(bigUploadCount > 2){
					sendSMS("File Size greater than 1MB uploaded under 1 minute!");
					bigUploadCount = 0;
					refDate = new Date();
				}
			}
			else{
				refDate = now;
			}
		}
	}

	if((totalUploadSize * 100)/MAX_UPLOAD > 80)
		sendSMS("Image storage reached greater than 80%. Immediate action required.");
		
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

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Example app listening at port %s', port);
});


setInterval( function () 
{
	io.sockets.emit('heartbeat', 
	{ 
        name: "Image Upload Status", highestUploads: highestUploadSize, numberOfUploads: numberOfUploads
   });

}, 2000);

app1.listen(4005);

function sendSMS(message){

	SMSClient.sendMessage({

	    to: process.env.MY_PHONE_NO,
	    from: process.env.MY_TWILIO_NO,
	    body: message

	}, function(err, responseData) {

	    if (!err) {
		console.log("Application Owner alerted!!!");
		console.log(responseData.body);

	    }
	});

}

module.exports = server;
