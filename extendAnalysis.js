var fs = require('fs'),
    xml2js = require('xml2js');

var threshold = 10;

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/checkstyle-result.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        var errorCount = result.checkstyle.file[0].error.length;
        if(errorCount > threshold){
        	console.log("Lint error exceeded threshold. Failing the build...");
        	process.exit(1);
        }
    });
});