---
title: 'Go 바이너리 크기 최적화'
description: 'Go 언어로 빌드된 바이너리 크기를 최적화하는 방법에 대한 설명서'
tags:
  - Go
  - Optimization
series: 'Go 최적화 시리즈'
date: 2024-12-09
---

# Go 언어로 빌드된 바이너리 크기 최적화

## 요약

### 기본 상태

Go 언어로 "Hello World" 프로그램을 빌드하면 기본적으로 약 2MB 정도의 바이너리가 생성됩니다. 이는 Go 런타임, 가비지 컬렉터, 그리고 다양한 표준 라이브러리가 포함되어 있기 때문입니다.

## 최적화 방법

### 1. 컴파일 옵션 사용

```bash
# 기본 빌드
go build -o app

# 크기 최적화 빌드
go build -ldflags="-s -w" -o app_optimized
```

- `-s`: 디버그 심볼 테이블 제거
- `-w`: DWARF 디버그 정보 제거

### 2. UPX 압축 사용

```bash
# UPX 설치
brew install upx  # macOS
sudo apt install upx  # Ubuntu

# 바이너리 압축
upx --best app_optimized
```

### 3. 불필요한 패키지 제거

```go
// main.go
import (
    "fmt"
    // 불필요한 패키지 제거
    // "net/http"
    // "encoding/json"
)
```

### 4. 최적화된 컴파일러 사용

```bash
# Go 1.18 이상에서 사용 가능
go build -gcflags="-l -B" -o app
```

## 실제 예제

### 1. 기본 빌드 크기

```bash
go build -o app
ls -lh app
# -rwxr-xr-x  1 user  staff   2.1M Dec  9 10:00 app
```

### 2. 최적화 후 크기

```bash
go build -ldflags="-s -w" -o app_optimized
upx --best app_optimized
ls -lh app_optimized
# -rwxr-xr-x  1 user  staff   1.2M Dec  9 10:01 app_optimized
```

## 주의사항

1. 디버깅 어려움

   - 최적화된 바이너리는 디버깅이 어려울 수 있음
   - 개발 환경에서는 최적화 옵션 사용을 피할 것

2. 성능 영향

   - 일부 최적화는 실행 속도에 영향을 줄 수 있음
   - 프로파일링을 통한 성능 검증 필요

3. 호환성 문제
   - 특정 플랫폼에서 최적화된 바이너리가 실행되지 않을 수 있음
   - 테스트 환경에서 충분한 검증 필요

## 추가 최적화 기법

### 1. TinyGo 사용

```bash
# TinyGo 설치
brew install tinygo  # macOS
sudo apt install tinygo  # Ubuntu

# TinyGo로 빌드
tinygo build -o app_tiny
```

### 2. CGO 비활성화

```bash
CGO_ENABLED=0 go build -o app
```

### 3. 특정 아키텍처 최적화

```bash
GOARCH=amd64 GOOS=linux go build -o app_linux
```

## 참고 자료

- [Go 컴파일러 최적화 가이드](https://golang.org/cmd/compile/)
- [UPX 공식 문서](https://upx.github.io/)
- [TinyGo 공식 문서](https://tinygo.org/)
