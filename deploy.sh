ssh root@$1 <<EOF
  cd ~/Milestone3TargetApp
  git pull
  npm install --production
  forever restartall
  exit
EOF