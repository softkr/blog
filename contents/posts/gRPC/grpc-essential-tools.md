---
title: 'gRPC 필수 도구 설치 가이드'
description: 'gRPC 개발에 필요한 필수 도구들의 설치 및 설정 방법'
tags:
  - gRPC
  - Protocol Buffers
  - Go
series: 'gRPC 개발 시리즈'
date: 2024-12-13
---

# gRPC 필수 도구 설치 가이드

## 1. Protocol Buffers 컴파일러 (protoc)

### 설치 파일 다운로드
- [프로토콜 버퍼 릴리즈 페이지](https://github.com/protocolbuffers/protobuf/releases)
- 운영체제에 맞는 버전 선택
  - Windows: `protoc-{version}-win64.zip`
  - Linux: `protoc-{version}-linux-x86_64.zip`
  - macOS: `protoc-{version}-osx-x86_64.zip`

### 운영체제별 설치 방법

#### Windows
1. zip 파일 다운로드 및 압축 해제
2. `bin` 디렉토리를 시스템 환경 변수 PATH에 추가
```batch
setx PATH "%PATH%;C:\path\to\protoc\bin"
```

#### macOS
```bash
# Homebrew 사용
brew install protobuf

# 또는 수동 설치
# 1. zip 파일 다운로드
# 2. 압축 해제
# 3. PATH 설정
echo 'export PATH=$PATH:/path/to/protoc/bin' >> ~/.zshrc
source ~/.zshrc
```

#### Linux
```bash
# apt 사용
sudo apt-get update
sudo apt-get install protobuf-compiler

# 또는 수동 설치
# 1. zip 파일 다운로드
# 2. 압축 해제
# 3. PATH 설정
echo 'export PATH=$PATH:/path/to/protoc/bin' >> ~/.bashrc
source ~/.bashrc
```

### 설치 확인
```bash
protoc --version
# libprotoc x.x.x (버전 정보 출력)
```

## 2. Go Protocol Buffers 플러그인 (protoc-gen-go)

### 설치 방법
```bash
# 최신 버전 설치
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

# 특정 버전 설치 (예: v1.28)
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
```

### 설치 확인
```bash
which protoc-gen-go
# Go bin 경로 출력 (예: /home/user/go/bin/protoc-gen-go)
```

## 3. Go gRPC 플러그인 (protoc-gen-go-grpc)

### 설치 방법
```bash
# 최신 버전 설치
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# 특정 버전 설치
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
```

### 설치 확인
```bash
which protoc-gen-go-grpc
# Go bin 경로 출력
```

## PATH 설정 확인

### Go bin 디렉토리 PATH 추가

#### Windows
```batch
setx PATH "%PATH%;%GOPATH%\bin"
```

#### Linux/macOS
```bash
# ~/.bashrc 또는 ~/.zshrc에 추가
export PATH=$PATH:$(go env GOPATH)/bin
```

### 설정 확인
```bash
# 모든 필수 도구 설치 확인
protoc --version
which protoc-gen-go
which protoc-gen-go-grpc
```

## 프로토 파일 컴파일 테스트

### 테스트 프로토 파일 생성
```protobuf
// test.proto
syntax = "proto3";

package test;

option go_package = "example/test";

message Test {
  string name = 1;
}
```

### 컴파일 테스트
```bash
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    test.proto
```

## 트러블슈팅

### 일반적인 문제 해결

1. `protoc-gen-go: program not found`
```bash
# Go bin 디렉토리가 PATH에 있는지 확인
echo $PATH | grep "go/bin"

# 누락된 경우 PATH 추가
export PATH=$PATH:$(go env GOPATH)/bin
```

2. `permission denied`
```bash
# 실행 권한 추가
chmod +x $(which protoc)
chmod +x $(which protoc-gen-go)
chmod +x $(which protoc-gen-go-grpc)
```

3. `missing go_package option`
```protobuf
// proto 파일에 go_package 옵션 추가
option go_package = "example/package";
```

## 버전 호환성

### 권장 버전 조합
- protoc: 3.21.0 이상
- protoc-gen-go: v1.28.0 이상
- protoc-gen-go-grpc: v1.2.0 이상

### 버전 확인 명령어
```bash
# 모든 컴포넌트 버전 확인
protoc --version
protoc-gen-go --version
go list -m google.golang.org/grpc
```


### gRPC 참고 링크

#### protoc

[https://github.com/protocolbuffers/protobuf/releases](https://github.com/protocolbuffers/protobuf/releases)

#### protoc-gen-go

[https://github.com/protocolbuffers/protobuf-go/releases](https://github.com/protocolbuffers/protobuf-go/releases)

#### protoc-gen-go-grpc

[https://pkg.go.dev/google.golang.org/grpc/cmd/protoc-gen-go-grpc](https://pkg.go.dev/google.golang.org/grpc/cmd/protoc-gen-go-grpc)

