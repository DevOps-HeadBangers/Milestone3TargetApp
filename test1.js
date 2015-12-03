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
cmd = "sudo node Flame/flame_monkey.js " + pid + " test1.svg";

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
            t.end();
            //app.close();
            //process.exit();
        });
});

function test2(){
    var path = "./sample";

    fs.readdir(path, function(err, items) {
        for (var i=0; i<items.length; i++) {
            var file = path + '/' + items[i];
            fs.stat(file, generate_callback(file));
        }
    });
}

function generate_callback(file) {
    return function(err, stats) {
            console.log(file);
            test2_run(file);
        }
};

function test2_run(filename){
    test('File upload test cases all', function(t) {
        request(app)
            .post('/api/photo')
            .field('filename', 'test file')
            .attach('file', filename)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                // t.error(err, 'No error');
                t.same(res.status, 200, 'should upload file');
                t.end();
                //app.close();
                //process.exit();
            });
    });
}

test2();

test('File upload test cases2', function(t) {
    request(app)
        .post('/api/photo')
        .field('filename', 'test file')
        .attach('file', 'img/2.jpg')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            // t.error(err, 'No error');
            t.same(res.status, 200, 'should upload file');
            t.end();
            //app.close();
            //process.exit();
        });
});

test('File upload test cases3', function(t) {
    request(app)
        .post('/api/photo')
        .field('filename', 'test file')
        .attach('file', 'img/3.jpg')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            // t.error(err, 'No error');
            t.same(res.status, 200, 'should upload file');
            t.end();
            //app.close();
            //process.exit();
        });
});

test('File upload test cases4', function(t) {
    request(app)
        .post('/api/photo')
        .field('filename', 'test file')
        .attach('file', 'img/4.jpg')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            // t.error(err, 'No error');
            t.same(res.status, 200, 'should upload file');
            t.end();
            //app.close();
            //process.exit();
        });
});

test('File upload test cases5', function(t) {
    request(app)
        .post('/api/photo')
        .field('filename', 'test file')
        .attach('file', 'img/5.jpg')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            // t.error(err, 'No error');
            t.same(res.status, 200, 'should upload file');
            //result = res.status;
            t.end();
            //app.close();
            //process.exit();
        });
});

test('File upload test cases6', function(t) {
    request(app)
        .post('/api/photo')
        .field('filename', 'test file')
        .attach('file', 'img/6.jpg')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            // t.error(err, 'No error');
            t.same(res.status, 200, 'should upload file');
            t.end();
            //app.close();
            //process.exit();
        });
});

test('File upload test cases7', function(t) {
    request(app)
        .post('/api/photo')
        .field('filename', 'test file')
        .attach('file', 'img/7.png')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            // t.error(err, 'No error');
            t.same(res.status, 200, 'should upload file');
            result = res.status;
            t.end();
            //app.close();
            //process.exit();
        });
        
     /*   setTimeout(function(){

            if(result == 200)
            {
                app.close();
                process.exit();
            }
            else
                console.log("Not Ok!");

        }, 33000);*/

});
