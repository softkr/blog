---
title: 'AWS EC2를 통해 RDS SSH 터널링 설정 가이드'
description: 'AWS EC2 서버를 통해 RDS 데이터베이스에 접속하고, 로컬에서 안전하게 접근할 수 있도록 SSH 터널링을 설정하는 방법'
tags:
  - AWS
  - EC2
  - RDS
  - SSH
  - Tunneling
series: 'AWS 보안 시리즈'
date: 2024-12-13
---

# AWS EC2를 통해 RDS SSH 터널링 설정 가이드

이 가이드는 AWS EC2 서버를 통해 RDS 데이터베이스에 접속하고, 로컬에서 안전하게 접근할 수 있도록 SSH 터널링을 설정하는 방법을 설명합니다.

---

## 사전 준비
1. **EC2 서버 정보**:
   - 공용 IP (예: `54.123.45.67`)
   - SSH 키 파일 (예: `aws-key.pem`)
   - 사용자 (`ec2-user`, `ubuntu` 등)

2. **RDS 정보**:
   - 엔드포인트 (예: `mydb.xxxxx.us-east-1.rds.amazonaws.com`)
   - 포트 (`3306`은 MySQL, `5432`는 PostgreSQL)
   - 데이터베이스 사용자명 및 비밀번호

3. **로컬 머신**:
   - 터널링에 사용할 로컬 포트 (예: `3306`)

---

## 1단계: EC2 서버로 SSH 접속
로컬 머신에서 EC2 서버로 SSH 접속:
```bash
ssh -i /path/to/aws-key.pem ec2-user@54.123.45.67
```

---

## 2단계: EC2에서 RDS 연결 테스트
EC2 서버에서 RDS 서버에 연결 가능한지 확인합니다.

### (1) Ping 테스트 (허용되는 경우):
```bash
ping mydb.xxxxx.us-east-1.rds.amazonaws.com
```

### (2) 데이터베이스 연결 테스트:
#### MySQL의 경우:
```bash
mysql -h mydb.xxxxx.us-east-1.rds.amazonaws.com -P 3306 -u <db_user> -p
```

#### PostgreSQL의 경우:
```bash
psql -h mydb.xxxxx.us-east-1.rds.amazonaws.com -p 5432 -U <db_user> <db_name>
```

---

## 3단계: SSH 터널링 설정
EC2 서버를 통해 로컬 머신에서 RDS에 접근할 수 있도록 SSH 터널링을 설정합니다.

### 명령어:
```bash
ssh -i /path/to/aws-key.pem -L <local_port>:<rds_endpoint>:<db_port> ec2-user@<ec2_public_ip>
```

### 예제:
```bash
ssh -i aws-key.pem -L 3306:mydb.xxxxx.us-east-1.rds.amazonaws.com:3306 ec2-user@54.123.45.67
```

- **`3306`**: 로컬 머신에서 사용할 포트
- **`mydb.xxxxx.us-east-1.rds.amazonaws.com`**: RDS 엔드포인트
- **`3306`**: RDS 포트 (여기서는 MySQL)

---

## 4단계: 로컬에서 데이터베이스 접속
SSH 터널링이 설정되면 로컬 머신에서 RDS 데이터베이스에 접속합니다.

### MySQL 클라이언트를 사용하는 경우:
```bash
mysql -h 127.0.0.1 -P 3306 -u <db_user> -p
```

### PostgreSQL 클라이언트를 사용하는 경우:
```bash
psql -h 127.0.0.1 -p 3306 -U <db_user> <db_name>
```

### GUI 클라이언트를 사용하는 경우:
- 호스트: `127.0.0.1`
- 포트: `3306`
- 사용자명: 데이터베이스 사용자명
- 비밀번호: 데이터베이스 비밀번호

---

## 5단계: SSH Config로 자동화
매번 명령어를 실행하지 않으려면 SSH 설정 파일을 활용할 수 있습니다.

### 구성 예제:
`~/.ssh/config` 파일에 아래 내용을 추가:
```plaintext
Host aws-ec2
    HostName 54.123.45.67
    User ec2-user
    IdentityFile /path/to/aws-key.pem
    LocalForward 3306 mydb.xxxxx.us-east-1.rds.amazonaws.com:3306
```

### 실행:
```bash
ssh aws-ec2
```

---

## 문제 해결
### 문제 1: EC2에서 RDS 연결 실패
#### 원인:
- RDS 보안 그룹이 EC2 서버의 프라이빗 IP를 허용하지 않을 수 있음.
#### 해결:
- RDS 보안 그룹에 아래와 같은 인바운드 규칙 추가:
  - **타입**: MySQL/Aurora 또는 PostgreSQL
  - **프로토콜**: TCP
  - **포트 범위**: `3306` (또는 `5432`)
  - **소스**: EC2 프라이빗 IP (예: `172.31.0.5/32`)

### 문제 2: 로컬에서 RDS 연결 실패
#### 원인:
- SSH 터널링이 제대로 설정되지 않음.
#### 해결:
- 터널링 상태 확인:
  ```bash
  netstat -an | grep 3306
  ```
- 다른 포트를 사용해 충돌 방지:
  ```bash
  ssh -i aws-key.pem -L 3307:mydb.xxxxx.us-east-1.rds.amazonaws.com:3306 ec2-user@54.123.45.67
  ```

---

## 요약
1. **EC2에 SSH 접속**:
   ```bash
   ssh -i aws-key.pem ec2-user@54.123.45.67
   ```

2. **EC2에서 RDS 연결 테스트**:
   ```bash
   mysql -h mydb.xxxxx.us-east-1.rds.amazonaws.com -P 3306 -u <db_user> -p
   ```

3. **SSH 터널링 설정**:
   ```bash
   ssh -i aws-key.pem -L 3306:mydb.xxxxx.us-east-1.rds.amazonaws.com:3306 ec2-user@54.123.45.67
   ```

4. **로컬에서 데이터베이스 접속**:
   ```bash
   mysql -h 127.0.0.1 -P 3306 -u <db_user> -p
   ```

---

## 참고 자료
- AWS EC2 문서
- AWS RDS 문서
