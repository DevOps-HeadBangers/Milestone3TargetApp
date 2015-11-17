ssh root@$1 <<EOF
  cd ~/File-upload-in-Node
  git pull
  npm install --production
  forever restartall
  exit
EOF