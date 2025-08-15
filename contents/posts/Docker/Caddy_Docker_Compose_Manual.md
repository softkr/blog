---
title: 'Caddy Docker Compose 사용'
description: 'Docker Compose를 이용한 Caddy 웹서버 설정 및 사용법'
tags:
  - Docker
  - Caddy
series: 'Caddy 시리즈'
date: 2024-12-08
---

# Caddy Docker Compose 사용

### 목차

1. [소개](#1-소개)
2. [필요한 파일 준비](#2-필요한-파일-준비)
3. [docker-compose.yml 작성](#3-docker-composeyml-작성)
4. [Caddyfile 작성](#4-caddyfile-작성)
5. [Docker Compose 명령어](#5-docker-compose-명령어)
6. [HTTPS 설정 및 확인](#6-https-설정-및-확인)
7. [참고 자료](#7-참고-자료)

---

### 1. 소개

**Caddy**는 Docker Compose를 통해 간편하게 실행할 수 있는 HTTP/HTTPS 웹 서버입니다. Docker를 활용하면 Caddy의 실행과 관리를 더욱 쉽게 자동화할 수 있습니다.

---

### 2. 필요한 파일 준비

Caddy를 Docker Compose로 실행하려면 아래 파일들이 필요합니다:

1. **docker-compose.yml**
2. **Caddyfile**

---

### 3. docker-compose.yml 작성

`docker-compose.yml` 파일은 Caddy 컨테이너의 실행 환경을 정의합니다.

```yaml
version: '3.8'

services:
  caddy:
    image: caddy:latest
    container_name: caddy_server
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./site:/usr/share/caddy
      - caddy_data:/data
      - caddy_config:/config
    restart: unless-stopped

volumes:
  caddy_data:
  caddy_config:
```

---

### 4. Caddyfile 작성

Caddyfile은 Caddy 서버의 동작을 정의하는 설정 파일입니다.

#### **1) 기본 설정 예제**

```caddyfile
example.com {
    root * /usr/share/caddy
    file_server
}
```

#### **2) HTTPS 리다이렉션**

```caddyfile
http://example.com {
    redir https://example.com{uri}
}
```

#### **3) 역방향 프록시**

```caddyfile
example.com {
    reverse_proxy 127.0.0.1:5000
}
```

---

### 5. Docker Compose 명령어

Docker Compose를 이용해 Caddy 서버를 실행 및 관리합니다.

#### **1) 컨테이너 시작**

```bash
docker-compose up -d
```

#### **2) 컨테이너 종료**

```bash
docker-compose down
```

#### **3) 컨테이너 로그 확인**

```bash
docker-compose logs -f caddy
```

#### **4) 컨테이너 상태 확인**

```bash
docker ps
```

#### **5) 설정 변경 후 재시작**

```bash
docker-compose up -d --force-recreate
```

---

### 6. HTTPS 설정 및 확인

Caddy는 Let's Encrypt를 통해 자동으로 HTTPS 인증서를 발급합니다.

1. **DNS 설정**
   - 도메인 네임의 DNS A/AAAA 레코드를 Caddy 서버의 IP 주소로 설정합니다.

2. **HTTPS 확인**
   - 브라우저에서 도메인을 입력하고 HTTPS 연결을 확인합니다.

---

### 7. 참고 자료

- [Caddy 공식 문서](https://caddyserver.com/docs/)
- [Caddy Docker Hub](https://hub.docker.com/_/caddy)
- [Docker Compose 공식 문서](https://docs.docker.com/compose/)
