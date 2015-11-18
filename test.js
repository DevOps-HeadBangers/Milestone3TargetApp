// TAPE test cases

var test = require('tape');
var request = require('supertest');
var app = require('./server');

test('File upload test cases', function(t) {
    request(app)
        .post('/api/photo')
        .field('filename', 'test file')
        .attach('file', 'image.png')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            // t.error(err, 'No error');
            t.same(res.status, 200, 'should upload file');
            t.end();
            app.close();
            process.exit();
        });
});