var sloc = require('sloc');
var dir = require('node-dir');

dir.readFiles(__dirname, {
        match: /.js$/, 
        excludeDir: ['node_modules', 'coverage', '.git']
    }, function(err, content, filename, next) {
        if (err) throw err;
        var stats = sloc(content, 'js');
        console.log("For file " + filename);
        for (i in sloc.keys) {
            var k = sloc.keys[i];
            console.log(k + " : " + stats[k]);
        }
        var ratio = stats["comment"] / stats["source"];
        console.log("comment to code Ratio: " + ratio);
        next();
    },
    function(err, files) {
        if (err) throw err;
        //console.log('finished reading files:', files);
    });

// fs.readFile("index.js", "utf8", function(err, code) {

//     if (err) {
//         console.error(err);
//     } else {
//         var stats = sloc(code, "js");
//         for (i in sloc.keys) {
//             var k = sloc.keys[i];
//             console.log(k + " : " + stats[k]);
//         }

//         var ratio = stats["comment"] / stats["source"];
//         console.log("comment to code Ratio: " + ratio);

//     }
// });