nvm use v0.12.7
sleep 2s
node --perf-basic-prof test2.js &
sleep 36s
forever start server.js
sleep 40s
forever stopall
node --perf-basic-prof test1.js &
sleep 40s
forever start server.js
sleep 40s
forever stopall
