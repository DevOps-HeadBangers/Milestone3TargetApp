ssh root@192.241.255.167 <<EOF
  cd ~/File-upload-in-Node
  git pull
  npm install --production
  forever restartall
  exit
EOF