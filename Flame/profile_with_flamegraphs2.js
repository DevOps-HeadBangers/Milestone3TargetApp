var sys = require('sys')
var exec = require('child_process').exec;

var child;

var archive_filename = -1;
var cmd1_sleep_time = 60;

//Run test and gets its PID
exec("sudo node --perf-basic-prof test2.js &", function (error, stdout, stderr) {

	sys.print("Stdout: " + stdout);
	start(pid);
	sys.print('stderr: ' + stderr);

	if (error !== null) {
    	console.log('exec error: ' + error);
  	}
});


function start(pid){
	
	var cmd1 = "sudo chown root: /tmp/perf-"+ pid +".map";
	child = exec(cmd1, function (error, stdout, stderr){

		console.log(cmd1);
		console.log(stdout);

		var cmd2 = "sudo perf record -F 99 -p "+pid+" -g -- sleep "+ cmd1_sleep_time;
		console.log(cmd2);
		
		exec(cmd2, function (error, stdout, stderr){

			console.log(stdout);

			// Move existing svg to arch folder
			exec("mv *.svg Flame/arch/*.svg");

			// move svg is running in loop to arch
			if(archive_filename != -1){
				exec("mv "+archive_filename+" arch/"+archive_filename);
			}
			actual_generation();
			
		});
	});
}

function actual_generation(){

	var cmd3 = "sudo chown root: perf.data";
	var cmd4 = "sudo perf script > out.nodestacks01";
	var d = new Date();
	var filename = d.getTime() + ".svg";
	archive_filename = filename;
	var cmd5 = "sudo Flame/FlameGraph/stackcollapse-perf.pl < out.nodestacks01 | Flame/FlameGraph/flamegraph.pl > "+ filename;
				//var cmd6 = "cat out.nodestacks01";

	console.log(cmd3);
	exec(cmd3, function (error, stdout2, stderr){

		console.log(stdout2);
		setTimeout(function(){

			console.log(cmd4);
			exec(cmd4, function (error, stdout3, stderr){

				console.log(stdout3);
				setTimeout(function(){

					console.log(cmd5);
					exec(cmd5, function (error, stdout4, stderr){

						console.log(stdout4);
						setTimeout(function(){

							exec("mv out.nodestacks01 Flame/out.nodestacks01");
							exec("mv perf.data Flame/perf.data");
							exec("rm v8.log");
							process.exit();
							//start();
						}, 500);

					});

				},1000);

			});	

		},500);
	});
}


/*sudo chown root: /tmp/perf-9857.map
sudo perf record -F 99 -p 10692 -g -- sleep 30
sudo chown root: perf.data
sudo perf script > out.nodestacks01
FlameGraph/stackcollapse-perf.pl < out.nodestacks01 | FlameGraph/flamegraph.pl > out.nodestacks01.svg*/