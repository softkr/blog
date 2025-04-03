---
title: 'MongoDB Replica Set 인증키 설정 가이드'
description: 'MongoDB Replica Set 구성 시 인증키 생성 및 권한 설정 방법'
tags:
  - MongoDB
  - ReplicaSet
  - Security
  - Docker
series: 'MongoDB 시리즈'
date: 2024-12-13
---

# MongoDB Replica Set 인증키 설정 가이드

## 인증키의 중요성

MongoDB Replica Set 구성 시 멤버 간 보안 통신을 위해 인증키가 필요합니다. 이 키는 Replica Set의 모든 멤버가 공유하며, 상호 인증에 사용됩니다.

## 인증키 생성 및 설정 과정

### 1. 인증키 생성
```bash
# 충분한 길이의 랜덤 키 생성
openssl rand -base64 756 > mongo_key.sec

# 키 파일 권한 설정 (읽기 전용)
chmod 400 mongo_key.sec
```

### 2. Docker 환경에서의 권한 문제

Docker 컨테이너에서 MongoDB를 실행할 때 키 파일 접근 권한으로 인한 오류가 자주 발생합니다.

#### 일반적인 오류 메시지
```
Error: KeyFile must have file permissions set to 400 (only owner may read)
```

#### 해결 방법
```bash
# MongoDB 시스템 사용자에게 키 파일 소유권 부여
sudo chown systemd-coredump mongo_key.sec
```

### 3. Docker Compose 설정 예시

```yaml
version: '3.8'

services:
  mongo1:
    image: mongo:latest
    command: mongod --keyFile /etc/mongodb/mongo_key.sec --replSet rs0 --bind_ip_all
    volumes:
      - ./mongo_key.sec:/etc/mongodb/mongo_key.sec:ro
      - mongo1_data:/data/db

  mongo2:
    image: mongo:latest
    command: mongod --keyFile /etc/mongodb/mongo_key.sec --replSet rs0 --bind_ip_all
    volumes:
      - ./mongo_key.sec:/etc/mongodb/mongo_key.sec:ro
      - mongo2_data:/data/db

  mongo3:
    image: mongo:latest
    command: mongod --keyFile /etc/mongodb/mongo_key.sec --replSet rs0 --bind_ip_all
    volumes:
      - ./mongo_key.sec:/etc/mongodb/mongo_key.sec:ro
      - mongo3_data:/data/db

volumes:
  mongo1_data:
  mongo2_data:
  mongo3_data:
```

## 주의사항

1. 키 파일은 반드시 안전한 방법으로 관리해야 합니다
2. 키 파일은 모든 Replica Set 멤버에서 동일한 내용이어야 합니다
3. 키 파일의 권한은 반드시 400(읽기 전용)이어야 합니다
4. Docker 환경에서는 볼륨 마운트 시 `:ro` 옵션을 사용하여 읽기 전용으로 마운트합니다

## 보안 강화 팁

1. 정기적으로 키를 교체합니다
2. 키 파일은 버전 관리 시스템에 직접 포함시키지 않습니다
3. 운영 환경에서는 보안 키 관리 시스템 사용을 고려합니다
4. 키 파일 백업은 암호화하여 별도로 보관합니다

## 트러블슈팅

만약 권한 설정 후에도 문제가 계속되면 다음을 확인하세요:

1. SELinux 설정 확인
2. Docker 볼륨 마운트 권한 확인
3. 호스트 시스템의 사용자/그룹 ID 확인
4. Docker 컨테이너 내부의 MongoDB 프로세스 권한 확인
