#!/bin/bash

echo ">>> 백엔드 배포 스크립트 시작"

# 1. 새로운 jar 파일이 복사된 폴더로 이동
cd /home/ec2-user/app

# 2. 현재 기존에 실행 중인 Spring Boot 프로세스(Java)의 PID(번호) 찾기
CURRENT_PID=$(pgrep -f "java -jar")

# 3. 만약 기존 서버가 켜져 있다면 안전하게 종료 (포트 충돌 방지)
if [ -z "$CURRENT_PID" ]; then
    echo ">>> 현재 구동 중인 백엔드 서버가 없으므로 종료를 건너뜁니다."
else
    echo ">>> 현재 구동 중인 백엔드 서버를 종료합니다. (PID: $CURRENT_PID)"
    kill -15 $CURRENT_PID
    sleep 5
fi

# 4. 새로운 jar 파일 찾아 실행하기 (백그라운드 구동)
echo ">>> 새 백엔드 애플리케이션을 구동합니다."
JAR_NAME=$(ls -tr *.jar | tail -n 1)

# 기존 코드
# nohup java -jar $JAR_NAME > /home/ec2-user/app/app.log 2>&1 &

# 변경한 코드 (/usr/bin/java 절대 경로 지정)
nohup /usr/bin/java -jar $JAR_NAME > /home/ec2-user/app/app.log 2>&1 &

echo ">>> 백엔드 배포 스크립트 완료"
