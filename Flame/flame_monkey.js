var sys = require('sys')
var exec = require('child_process').exec;

var child;

//get this pid from redis
pid = process.argv[2];
fileN = process.argv[3];
var archive_filename = -1;

console.log('pid: ' + pid)
var cmd1_sleep_time = 30;
var cmd1 = "sudo chown root: /tmp/perf-"+ pid +".map";
function start(){
	child = exec(cmd1, function (error, stdout, stderr){

		console.log(cmd1);
		console.log(stdout);

		var cmd2 = "sudo perf record -F 99 -p "+pid+" -g -- sleep "+ cmd1_sleep_time;
		console.log(cmd2);
		
		exec(cmd2, function (error, stdout, stderr){

			console.log(stdout);
			//exec("find . -iname '*.svg' -type f | xargs -I '{}' mv {} ./Flame/arch/");
			if(archive_filename != -1){
				exec("mv "+archive_filename+" arch/"+archive_filename);
			}
			//setTimeout(function(){

				actual_generation();
			//}, 65000);
			
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

							exec("cp "+filename+" "+fileN);
							exec("mv out.nodestacks01 Flame/out.nodestacks01");
							exec("mv perf.data Flame/perf.data");
							exec("rm v8.log");
							process.exit();
							//start();
						}, 1500);

					});

				},1000);

			});	

		},500);
	});
}

start();

/*sudo chown root: /tmp/perf-9857.map
sudo perf record -F 99 -p 10692 -g -- sleep 30
sudo chown root: perf.data
sudo perf script > out.nodestacks01
FlameGraph/stackcollapse-perf.pl < out.nodestacks01 | FlameGraph/flamegraph.pl > out.nodestacks01.svg*/