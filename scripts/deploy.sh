#!/bin/bash
set -e

APP_DIR="/home/ec2-user/test-mini6"

dnf install -y java-17-amazon-corretto nginx

cd "$APP_DIR"

pkill -f 'java -jar' || true

nohup java -jar Backend/bookapp/build/libs/*.jar > backend.log 2>&1 &

rm -rf /usr/share/nginx/html/*
cp -r Frontend/dist/* /usr/share/nginx/html/

systemctl enable nginx
systemctl restart nginx

