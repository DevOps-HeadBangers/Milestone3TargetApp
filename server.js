var express = require("express"); // include express module
var multer = require('multer'); // include multer module
var app = express(); // get express object
var sio = require('socket.io'),
    http = require('http');
var upload = multer({
    dest: './uploads/'
});
var SMSClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
var nodemailer = require('nodemailer');
var redis = require('redis')
var fs = require('fs')

var highestUploadSize = 0;
var numberOfUploads = 0;
var totalUploadSize = 0;
var MAX_UPLOAD = 10000000;
var refDate = 0;
bigUploadCount = 0;
canary_fail = false;

var app1 = http.createServer(function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end();
    }),
    io = sio.listen(app1);

var client = redis.createClient(6379, process.argv[2], {})

client.set("M3_EMAIL", "No");

var mailOptions = {
    from: 'Fred Foo ✔ <' + process.env.M3_GMAIL + '>',
    to: process.env.M3_GMAIL,
    subject: 'Flicker Milestone 3 Update For - ✔',
    html: '<b>New image has been uploaded!!! ✔</b>'
};

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

        if (file.size > highestUploadSize)
            highestUploadSize = file.size

        if (file.size > 1000000) {
            console.log("Encountered big upload!");
            bigUploadCount++;

            if (refDate == 0)
                refDate = new Date();
            else {
                now = new Date();
                if (((now.getTime() - refDate.getTime()) / 1000 < 60)) {
                    if (bigUploadCount > 2) {
                        //sendSMS("File Size greater than 1MB uploaded under 1 minute!");
                        bigUploadCount = 0;
                        refDate = new Date();
                    }
                } else {
                    refDate = now;
                }
            }
        }

        if ((totalUploadSize * 100) / MAX_UPLOAD > 80)
            //sendSMS("Image storage reached greater than 80%. Immediate action required.");

        client.get("M3_EMAIL", function(err, reply) {

		    console.log("Email sent: " + reply);
		    if(reply.toUpperCase() === "YES"){
		    	mailOptions.subject = 'Flicker Milestone 3 Update For - ' + file.originalname;
		        mailOptions.html = '<b>'+ file.originalname + ' image has been uploaded!!! ✔</b>';
		        emailUpdate();
		    }
		});

        
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
}));


// call get method
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/monitor', function(req, res) {
    res.sendFile(__dirname + "/www/index.html");
});


app.get('/test1', function(req, res) {
    var img = fs.readFile('./test1.svg', function(err, data) {
    res.writeHead(200, {'content-type':'image/svg'});
    res.end(data);
    });
});

app.get('/test2', function(req, res) {
    var img = fs.readFile('./test2.svg', function(err, data) {
    res.writeHead(200, {'content-type':'image/svg'});
    res.end(data);
    });
});


app.get('/test3', function(req, res) {
    var img = fs.readFile('./test3.svg', function(err, data) {
    res.writeHead(200, {'content-type':'image/svg'});
    res.end(data);
    });
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

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Example app listening at port %s', port);
});


setInterval(function() {
    io.sockets.emit('heartbeat', {
        name: "Image Upload Status",
        highestUploads: highestUploadSize,
        numberOfUploads: numberOfUploads,
        status: canary_fail
    });

}, 2000);

app1.listen(4005);


function sendSMS(message) {

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

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.M3_GMAIL,
        pass: process.env.M3_PASS
    }
});


function emailUpdate(){
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);

	});
}

module.exports = server;