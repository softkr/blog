---
title: 'Caddy 기본 사용'
description: 'Caddy 웹서버 사용을 위한 기본 설명서 '
tags:
  - Server
  - Caddy
series: 'Caddy 시리즈'
date: 2024-12-08
---

# Caddy 기본 사용

### 목차

1. [Caddy 소개](#1-caddy-소개)
2. [설치 방법](#2-설치-방법)
3. [기본 명령어](#3-기본-명령어)
4. [Caddyfile 구조](#4-caddyfile-구조)
5. [Caddyfile 예제](#5-caddyfile-예제)
6. [DNS 및 HTTPS 설정](#6-dns-및-https-설정)
7. [Caddy 관리](#7-caddy-관리)

---

### 1. Caddy 소개

**Caddy**는 HTTP/HTTPS 웹 서버로, 다음과 같은 특징을 갖습니다:

- 자동 HTTPS 지원
- 간단한 구성 파일 (Caddyfile)
- 빠르고 효율적인 성능
- 플러그인 지원

---

### 2. 설치 방법

#### **Linux**

```bash
# Caddy 설치
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /etc/apt/trusted.gpg.d/caddy-stable.asc
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

#### **macOS**

```bash
brew install caddy
```

#### **Windows**

- Windows용 실행 파일을 [공식 다운로드 페이지](https://caddyserver.com/download)에서 다운로드합니다.

---

### 3. 기본 명령어

#### **Caddy 실행**

```bash
caddy run
```

#### **Caddy 종료**

```bash
caddy stop
```

#### **Caddy 설정 파일 테스트**

```bash
caddy validate
```

#### **Caddy 설정 재로드**

```bash
sudo systemctl reload caddy
```

#### **Caddy 서비스 상태 확인**

```bash
sudo systemctl status caddy
```

---

### 4. Caddyfile 구조

Caddyfile은 도메인과 관련 설정을 지정하는 텍스트 파일입니다.

#### **기본 구조**

```plaintext
<도메인> {
    <지시자> <값>
    <지시자> {
        <세부 설정>
    }
}
```

---

### 5. Caddyfile 예제

#### **1) 기본 설정**

```caddyfile
example.com {
    root * /var/www/html
    file_server
}
```

#### **2) HTTPS 리다이렉션**

```caddyfile
http://example.com {
    redir https://example.com{uri}
}
```

#### **3) 여러 도메인 처리**

```caddyfile
example.com, www.example.com {
    root * /var/www/html
    file_server
}
```

#### **4) 역방향 프록시**

```caddyfile
example.com {
    reverse_proxy 127.0.0.1:5000
}
```

---

### 6. DNS 및 HTTPS 설정

#### **자동 HTTPS**

Caddy는 기본적으로 Let’s Encrypt를 사용하여 HTTPS를 자동으로 설정합니다.

#### **DNS 설정**

- 도메인 네임을 사용하려면 DNS A/AAAA 레코드가 서버의 IP 주소를 가리키도록 설정해야 합니다.

---

### 7. Caddy 관리

#### **서비스 시작**

```bash
sudo systemctl start caddy
```

#### **서비스 중지**

```bash
sudo systemctl stop caddy
```

#### **서비스 재시작**

```bash
sudo systemctl restart caddy
```

#### **로그 확인**

```bash
journalctl -u caddy --no-pager
```

---

### 참고 자료

- [Caddy 공식 문서](https://caddyserver.com/docs/)
- [Caddy 다운로드](https://caddyserver.com/download)

---
