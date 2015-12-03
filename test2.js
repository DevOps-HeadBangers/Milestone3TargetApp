// TAPE test cases
var fs = require('fs');
var test = require('tape');
var request = require('supertest');
var app = require('./server');
var sys = require('sys');
var exec = require('child_process').exec;
var result;
var pid = process.pid;
console.log("pid: " + pid);
cmd = "sudo node Flame/flame_monkey.js " + pid + " test2.svg";

console.log(cmd);
exec(cmd, function (error, stdout, stderr) {

    if (error !== null) {
        console.log('exec error: ' + error);
    }
    
});

    test('File upload test cases1', function(t) {
    request(app)
        .post('/api/photo')
        .field('filename', 'test file')
        .attach('file', 'img/1.jpg')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            // t.error(err, 'No error');
            t.same(res.status, 200, 'should upload file');
            result = res.status;
            t.end();
            app.close();
            process.exit();
        });
        /*setTimeout(function(){

           exec("kill " + pid, function(error, stdout, stderr){
               app.close();
                process.exit();   
           })
            
            
            
        }, 35000);*/
    });


       
