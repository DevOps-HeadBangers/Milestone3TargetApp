var request = require('supertest');
var app = require('./server');


function uploadMockImage(imgName){
    console.log('--------------------------------');
    console.log('Recieving mock users request!!!');
    console.log('--------------------------------');

    request(app)
            .post('/api/photo')
            .field('filename', 'mock file')
            .attach('file', imgName)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                app.close();
            });
}

setInterval(function(){
    
    imgID = Math.floor((Math.random() * 6) + 1);
    imageName = 'img/'+imgID+'.jpg';
    uploadMockImage(imageName); 
}, 12000);
