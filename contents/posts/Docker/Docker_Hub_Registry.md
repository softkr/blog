---
title: 'Docker Hub 서버 구축 가이드'
description: 'Docker Hub와 유사한 기능을 제공하는 사설 Docker Registry 서버를 구축하는 방법에 대한 종합 가이드'
tags:
  - Docker
  - DevOps
  - Registry
  - Automation
series: 'Docker 개발 시리즈'
date: 2024-12-09
---

# Docker Hub 서버 구축 문서

## 1. Docker Hub 서버 구축 개요
Docker Hub는 컨테이너 이미지를 저장하고 관리할 수 있는 레지스트리 서비스입니다. Docker Hub와 유사한 기능을 제공하는 자체 Docker Registry 서버를 구축하면 조직 내에서 이미지 관리를 중앙화하고 보안을 강화할 수 있습니다.  

이 문서에서는 Docker의 오픈소스 레지스트리 `docker-registry`를 사용하여 Docker Hub와 유사한 기능을 제공하는 사설 Docker Registry를 구축하는 과정을 안내합니다.

## 2. 사전 준비

### 필수 조건
- **서버 환경**: Linux 서버 (Ubuntu, CentOS 등)
- **Docker**: 최신 버전 설치
- **도메인**: 레지스트리 서버 접근용 도메인 (옵션)
- **SSL 인증서**: HTTPS 통신을 위한 인증서 (Let's Encrypt 또는 상용 인증서 사용 가능)

## 3. Docker Registry 설치

### Step 1: Docker 설치
```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

### Step 2: Docker Registry 컨테이너 실행
```bash
docker run -d \
  --name registry \
  -p 5000:5000 \
  -v /opt/registry/data:/var/lib/registry \
  registry:2
```

- `-p 5000:5000`: 호스트의 5000번 포트를 레지스트리 컨테이너에 매핑
- `/opt/registry/data`: 이미지 데이터를 저장할 디렉토리
- `registry:2`: Docker의 공식 Registry 이미지

## 4. HTTPS 및 인증 설정

### Step 1: SSL 인증서 준비
1. Let's Encrypt로 SSL 인증서 발급:
   ```bash
   sudo apt install -y certbot
   sudo certbot certonly --standalone -d <your-domain>
   ```
2. 인증서 위치:
   - 인증서 파일: `/etc/letsencrypt/live/<your-domain>/fullchain.pem`
   - 키 파일: `/etc/letsencrypt/live/<your-domain>/privkey.pem`

### Step 2: Nginx 설치 및 설정
Nginx를 사용하여 HTTPS를 설정합니다.
1. Nginx 설치:
   ```bash
   sudo apt install -y nginx
   ```
2. Nginx 설정 파일 생성:
   ```bash
   sudo nano /etc/nginx/sites-available/registry
   ```
   아래 내용을 추가:
   ```nginx
   server {
       listen 443 ssl;
       server_name <your-domain>;

       ssl_certificate /etc/letsencrypt/live/<your-domain>/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/<your-domain>/privkey.pem;

       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }

   server {
       listen 80;
       server_name <your-domain>;

       location / {
           return 301 https://$host$request_uri;
       }
   }
   ```
3. Nginx 설정 활성화:
   ```bash
   sudo ln -s /etc/nginx/sites-available/registry /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

## 5. 사용자 인증 추가 (옵션)

### Step 1: 사용자 인증 파일 생성
```bash
sudo apt install apache2-utils
sudo htpasswd -c /opt/registry/auth/htpasswd <username>
```

### Step 2: Registry 컨테이너 실행 시 인증 활성화
Docker Registry 컨테이너를 다시 실행합니다:
```bash
docker run -d \
  --name registry \
  -p 5000:5000 \
  -v /opt/registry/data:/var/lib/registry \
  -v /opt/registry/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" \
  registry:2
```

## 6. 클라이언트 설정

### Step 1: Docker 클라이언트 인증
사용자 인증 정보를 Docker에 저장:
```bash
docker login <your-domain>
```

### Step 2: Docker 이미지 푸시
1. 태그 지정:
   ```bash
   docker tag <local-image> <your-domain>/<repository>:<tag>
   ```
2. 이미지 푸시:
   ```bash
   docker push <your-domain>/<repository>:<tag>
   ```

## 7. 모니터링 및 로그 관리

### Step 1: 로그 확인
```bash
docker logs registry
```

### Step 2: Log Rotation 설정
Docker 로그가 과도하게 커지지 않도록 설정:
```bash
docker run -d \
  --name registry \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  -p 5000:5000 \
  -v /opt/registry/data:/var/lib/registry \
  registry:2
```

## 8. 참고 자료
- Docker Registry 공식 문서: [Docker Registry Docs](https://docs.docker.com/registry/)
- Nginx 설정 가이드: [Nginx Docs](https://nginx.org/en/docs/)
