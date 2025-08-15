---
title: 'MongoDB Replica Set 구성 및 운영'
description: 'MongoDB Replica Set의 개념, 구성 방법 및 운영에 대해 알아봅니다'
tags:
  - MongoDB
  - ReplicaSet
series: 'MongoDB 시리즈'
date: 2024-12-13
---

# MongoDB Replica Set 구성 및 운영

## 개요

MongoDB Replica Set은 동일한 데이터를 가진 여러 MongoDB 인스턴스의 집합입니다. 이는 데이터의 고가용성과 장애 복구를 보장하는 핵심 기능입니다.

## Replica Set의 구조

### 기본 구성 요소

- **Primary**: 쓰기 작업을 처리하는 주 노드
- **Secondary**: 읽기 작업을 처리할 수 있는 복제 노드
- **Arbiter** (선택적): 투표만 참여하는 노드

### 최소 구성

- 3개의 데이터 노드 (1 Primary + 2 Secondary)
- 2개의 데이터 노드 + 1개의 Arbiter

## Docker Compose를 이용한 Replica Set 구성

```yaml
version: '3.8'

services:
  mongo1:
    image: mongo:latest
    container_name: mongo1
    command: mongod --replSet myReplicaSet --bind_ip_all
    ports:
      - '27017:27017'
    volumes:
      - mongo1_data:/data/db
    networks:
      - mongo_network

  mongo2:
    image: mongo:latest
    container_name: mongo2
    command: mongod --replSet myReplicaSet --bind_ip_all
    ports:
      - '27018:27017'
    volumes:
      - mongo2_data:/data/db
    networks:
      - mongo_network

  mongo3:
    image: mongo:latest
    container_name: mongo3
    command: mongod --replSet myReplicaSet --bind_ip_all
    ports:
      - '27019:27017'
    volumes:
      - mongo3_data:/data/db
    networks:
      - mongo_network

volumes:
  mongo1_data:
  mongo2_data:
  mongo3_data:

networks:
  mongo_network:
    driver: bridge
```

## Replica Set 초기화

### 1. Primary 노드 접속

```bash
docker exec -it mongo1 mongosh
```

### 2. Replica Set 구성 초기화

```javascript
rs.initiate({
  _id: 'myReplicaSet',
  members: [
    { _id: 0, host: 'mongo1:27017' },
    { _id: 1, host: 'mongo2:27017' },
    { _id: 2, host: 'mongo3:27017' },
  ],
});
```

### 3. Replica Set 상태 확인

```javascript
rs.status();
```

## Replica Set 운영

### 읽기 기본 설정

```javascript
// 읽기 기본 설정 확인
db.getMongo().getReadPrefMode();

// Secondary에서도 읽기 허용
db.getMongo().setReadPref('secondaryPreferred');
```

### 읽기 선호도 옵션

- **primary**: 기본값, Primary에서만 읽기
- **primaryPreferred**: Primary 우선, 불가능할 경우 Secondary
- **secondary**: Secondary에서만 읽기
- **secondaryPreferred**: Secondary 우선, 불가능할 경우 Primary
- **nearest**: 네트워크 지연시간이 가장 낮은 멤버

### 노드 관리 명령어

```javascript
// Replica Set 구성 확인
rs.conf();

// Secondary 노드 추가
rs.add('mongodb4:27017');

// Arbiter 노드 추가
rs.addArb('mongodbarbiter:27017');

// 노드 제거
rs.remove('mongodb4:27017');

// Primary 강제 변경
rs.stepDown();
```

## 모니터링 및 유지보수

### 복제 지연 모니터링

```javascript
// 복제 상태 확인
rs.printReplicationInfo();

// Secondary 복제 지연 확인
rs.printSecondaryReplicationInfo();
```

### 노드 상태 모니터링

```javascript
// 전체 상태 확인
rs.status();

// 멤버별 상태 확인
db.serverStatus().repl;
```

## 장애 상황 처리

### Primary 노드 장애

1. 자동으로 새로운 Primary 선출
2. 기존 Primary 복구 후 Secondary로 자동 전환

```javascript
// 수동으로 Primary 변경
rs.stepDown(300); // 300초 동안 Primary 역할 포기
```

### Secondary 노드 장애

1. 자동으로 복제 세트에서 제외
2. 복구 후 자동으로 데이터 동기화

```javascript
// 수동으로 Secondary 재시작
db.adminCommand({ replSetMaintenance: 1 }); // 유지보수 모드 시작
db.adminCommand({ replSetMaintenance: 0 }); // 유지보수 모드 종료
```

## 운영 시 주의사항

### 1. 네트워크 구성

- 멤버 간 안정적인 네트워크 연결 필요
- 방화벽 설정 확인
- Hostname 해석 가능 여부 확인

### 2. 디스크 관리

- 충분한 디스크 공간 확보
- 디스크 I/O 모니터링
- 정기적인 백업 수행

### 3. 보안 설정

```javascript
// 복제 세트 인증 설정
security:
  keyFile: /path/to/keyfile
  authorization: enabled
```

### 4. 성능 최적화

- Write Concern 설정
- Read Preference 적절히 구성
- 인덱스 동기화 상태 모니터링

## 모범 사례

1. **구성 크기**
   - 홀수 개의 노드로 구성
   - 최소 3개의 데이터 노드 권장

2. **지리적 분산**
   - 가용성 향상을 위해 다른 데이터센터에 분산
   - 네트워크 지연시간 고려

3. **모니터링**
   - 복제 지연 모니터링
   - 디스크 사용량 모니터링
   - 네트워크 상태 모니터링

4. **백업**
   - Secondary 노드에서 백업 수행
   - 정기적인 백업 및 복구 테스트

## 문제 해결

### 1. 복제 지연 발생 시

```javascript
// 복제 지연 확인
rs.printSecondaryReplicationInfo();

// 원인 분석
db.currentOp();
```

### 2. 선출 문제 발생 시

```javascript
// 선출 설정 확인
rs.config();

// 강제 선출
rs.reconfig(cfg, { force: true });
```

### 3. 데이터 동기화 문제

```javascript
// 초기 동기화 강제 실행
rs.resync();

// 동기화 상태 확인
rs.printReplicationInfo();
```

## 마치며

MongoDB Replica Set은 고가용성과 데이터 안정성을 보장하는 핵심 기능입니다. 적절한 구성과 모니터링, 그리고 문제 발생 시 신속한 대응이 중요합니다. 다음 글에서는 Sharding과 Replica Set을 함께 사용하는 방법에 대해 알아보도록 하겠습니다.
