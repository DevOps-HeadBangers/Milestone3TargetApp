var fs = require("fs");
fs.readFile('test.tap', 'utf8', function(err, data) {
    // if (err) throw err;
    var index = data.indexOf("not ok");
    if(index != -1){
    	console.log("Failed test cases present. Failing the build...");
    	process.exit(1);
    }
});