---
title: 'MicroK8s 사용 가이드'
description: 'MicroK8s의 기본 개념과 사용법에 대한 초보자를 위한 종합 가이드'
tags:
  - Kubernetes
  - MicroK8s
series: 'Kubernetes 학습 시리즈'
date: 2024-12-09
---

# MicroK8s 사용 가이드

## MicroK8s란?

MicroK8s는 가볍고 빠른 완전한 기능을 갖춘 단일 패키지 Kubernetes입니다. 개발자의 워크스테이션부터 IoT 기기, CI/CD 환경까지 다양한 환경에서 사용할 수 있도록 설계되었습니다.

## 주요 특징

1. **간편한 설치와 관리**

   - 단일 명령어로 설치 가능
   - 자동 업데이트 지원
   - 최소한의 설정으로 즉시 사용 가능

2. **가벼운 리소스 사용**

   - 최소 시스템 요구사항이 낮음
   - 메모리 사용량 최적화
   - 빠른 시작 시간

3. **완전한 Kubernetes 호환성**
   - 표준 Kubernetes API 지원
   - 모든 Kubernetes 워크로드 실행 가능
   - 기존 Kubernetes YAML 파일 사용 가능

## 설치 방법

### Ubuntu에서 설치

```bash
sudo snap install microk8s --classic
```

### Windows에서 설치

1. Windows Subsystem for Linux (WSL) 설치
2. Ubuntu WSL 내에서 MicroK8s 설치

```bash
sudo snap install microk8s --classic
```

### macOS에서 설치

```bash
brew install ubuntu/microk8s/microk8s
```

## 기본 사용법

### 1. 상태 확인

```bash
microk8s status
```

### 2. 애드온 활성화

```bash
# DNS 활성화
microk8s enable dns

# 대시보드 활성화
microk8s enable dashboard

# 저장소 활성화
microk8s enable storage
```

### 3. kubectl 사용

```bash
# Pod 목록 조회
microk8s kubectl get pods

# 서비스 목록 조회
microk8s kubectl get services

# 디플로이먼트 생성
microk8s kubectl create deployment nginx --image=nginx
```

## 주요 애드온 소개

### 1. Dashboard

- Kubernetes 클러스터를 웹 인터페이스로 관리
- 리소스 모니터링 및 관리 기능 제공

```bash
microk8s enable dashboard
```

### 2. DNS

- 클러스터 내부 도메인 이름 해결
- 서비스 디스커버리 지원

```bash
microk8s enable dns
```

### 3. Registry

- 프라이빗 컨테이너 레지스트리
- 로컬 이미지 저장 및 관리

```bash
microk8s enable registry
```

## 문제 해결 가이드

### 1. 일반적인 문제

- **클러스터 상태 검사**

```bash
microk8s inspect
```

- **서비스 재시작**

```bash
microk8s stop
microk8s start
```

### 2. 로그 확인

```bash
microk8s kubectl logs <pod-name>
```

## 보안 설정

### 1. RBAC 활성화

```bash
microk8s enable rbac
```

### 2. 인증서 관리

```bash
microk8s refresh-certs
```

## 성능 최적화 팁

1. **리소스 제한 설정**

   - Pod에 적절한 리소스 제한 설정
   - 노드 리소스 모니터링

2. **캐시 설정**
   - 이미지 풀링 정책 최적화
   - 로컬 레지스트리 활용

## 프로덕션 환경 준비사항

1. **고가용성 설정**

   - 다중 노드 구성
   - 백업 전략 수립

2. **모니터링 설정**
   - Prometheus 활성화
   - Grafana 대시보드 구성

## 참고 자료

- [공식 MicroK8s 문서](https://microk8s.io/docs)
- [Kubernetes 공식 문서](https://kubernetes.io/docs)
- [MicroK8s GitHub](https://github.com/canonical/microk8s)

## 마치며

MicroK8s는 Kubernetes를 시작하는 가장 쉬운 방법 중 하나입니다. 이 가이드를 통해 기본적인 설정과 사용법을 익히고, 필요에 따라 심화 학습을 진행하시기 바랍니다.
