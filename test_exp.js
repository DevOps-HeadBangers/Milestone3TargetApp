var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;

var pid = process.pid;
console.log("pid: " + pid);
cmd = "sudo node Flame/flame_monkey.js " + pid;

console.log(cmd);
exec(cmd, function (error, stdout, stderr) {

    if (error !== null) {
        console.log('exec error: ' + error);
    }
    process.exit();
});
 
var path = "./uploads";
var max_size = -1;
var max_file_size_name = -1;

function findMaxFile(){
    fs.readdir(path, function(err, items) {
        for (var i=0; i<items.length; i++) {
            var file = path + '/' + items[i];
     
            //console.log("Start: " + file);
            fs.stat(file, generate_callback(file));
        }
        setTimeout(function(){

            if(max_size != -1){
                console.log("Max File Size Name: " + max_file_size_name);
                console.log("Max File Size: " + max_size);
            }
            else
                console.log("Folder was empty!");

        }, 2000);
    });
}
 
function generate_callback(file) {
    return function(err, stats) {
            //console.log(file);
            //console.log(stats["size"]);
            if(stats["size"] > max_size){

                max_size = stats["size"];
                max_file_size_name = file;
            }
        }
};

setTimeout(function(){
    findMaxFile();
}, 2000);
