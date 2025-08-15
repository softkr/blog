---
title: 'Protocol Buffers와 gRPC 설정 가이드'
description: 'Protocol Buffers 컴파일러와 Go 플러그인 설치 및 사용 방법'
tags:
  - Protocol Buffers
  - gRPC
series: 'gRPC 개발 시리즈'
date: 2024-12-13
---

# Protocol Buffers와 gRPC 설정 가이드

## 필요한 도구 설치

### 1. Protocol Buffers 컴파일러 (protoc) 설치

[protoc 릴리즈 페이지](https://github.com/protocolbuffers/protobuf/releases)에서 운영체제에 맞는 버전을 다운로드합니다.

#### Windows 설치

1. `protoc-{version}-win64.zip` 다운로드
2. 압축 해제
3. `bin` 디렉토리를 시스템 PATH에 추가

#### Linux/macOS 설치

```bash
# macOS (Homebrew)
brew install protobuf

# Linux (apt)
apt-get install protobuf-compiler

# Linux (yum)
yum install protobuf-compiler
```

### 2. Go 플러그인 설치

#### protoc-gen-go 설치

[protoc-gen-go 릴리즈](https://github.com/protocolbuffers/protobuf-go/releases)에서 최신 버전을 확인하고 설치합니다.

```bash
# Go 1.16 이상
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

# 특정 버전 설치
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
```

#### protoc-gen-go-grpc 설치

[protoc-gen-go-grpc 문서](https://pkg.go.dev/google.golang.org/grpc/cmd/protoc-gen-go-grpc)를 참고하여 설치합니다.

```bash
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

## 프로젝트 구조 설정

```
your-project/
├── proto/
│   └── service/
│       └── service.proto
├── gen/
│   └── service/
├── cmd/
│   └── server/
│       └── main.go
└── go.mod
```

## Proto 파일 작성 예시

```protobuf
// proto/service/service.proto
syntax = "proto3";

package service;

option go_package = "your-project/gen/service";

service GreeterService {
  rpc SayHello (HelloRequest) returns (HelloResponse) {}
}

message HelloRequest {
  string name = 1;
}

message HelloResponse {
  string message = 1;
}
```

## 컴파일 명령어

### 기본 컴파일 명령어

```bash
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    proto/service/service.proto
```

### 옵션 설명

- `--go_out=.`: Go 코드 생성 출력 디렉토리
- `--go_opt=paths=source_relative`: 소스 파일 기준 상대 경로 사용
- `--go-grpc_out=.`: gRPC 코드 생성 출력 디렉토리
- `--go-grpc_opt=paths=source_relative`: gRPC 코드에 대한 상대 경로 사용

### 여러 Proto 파일 컴파일

```bash
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    proto/service/*.proto
```

### Makefile 활용

```makefile
.PHONY: proto
proto:
    protoc --go_out=. --go_opt=paths=source_relative \
        --go-grpc_out=. --go-grpc_opt=paths=source_relative \
        proto/service/*.proto
```

## 생성된 코드 사용

### 서버 구현 예시

```go
// cmd/server/main.go
package main

import (
    "context"
    "log"
    "net"

    pb "your-project/gen/service"
    "google.golang.org/grpc"
)

type server struct {
    pb.UnimplementedGreeterServiceServer
}

func (s *server) SayHello(ctx context.Context, req *pb.HelloRequest) (*pb.HelloResponse, error) {
    return &pb.HelloResponse{
        Message: "Hello " + req.Name,
    }, nil
}

func main() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }

    s := grpc.NewServer()
    pb.RegisterGreeterServiceServer(s, &server{})

    log.Printf("server listening at %v", lis.Addr())
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
```

### 클라이언트 구현 예시

```go
// cmd/client/main.go
package main

import (
    "context"
    "log"
    "time"

    pb "your-project/gen/service"
    "google.golang.org/grpc"
)

func main() {
    conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
    if err != nil {
        log.Fatalf("did not connect: %v", err)
    }
    defer conn.Close()

    c := pb.NewGreeterServiceClient(conn)

    ctx, cancel := context.WithTimeout(context.Background(), time.Second)
    defer cancel()

    r, err := c.SayHello(ctx, &pb.HelloRequest{Name: "World"})
    if err != nil {
        log.Fatalf("could not greet: %v", err)
    }
    log.Printf("Greeting: %s", r.GetMessage())
}
```

## 주요 문제 해결

### 1. PATH 설정 문제

```bash
# Go bin 디렉토리를 PATH에 추가
export PATH=$PATH:$(go env GOPATH)/bin
```

### 2. 컴파일 오류 해결

```bash
# 플러그인 설치 확인
which protoc-gen-go
which protoc-gen-go-grpc

# 버전 확인
protoc --version
protoc-gen-go --version
```

### 3. Import 경로 문제

```protobuf
// 올바른 import 경로 설정
option go_package = "github.com/username/project/gen/service";
```

## 모범 사례

1. **버전 관리**

   - Proto 파일의 버전을 명시적으로 관리
   - API 변경 시 하위 호환성 유지

2. **구조화**

   ```
   proto/
   ├── v1/
   │   └── service.proto
   └── v2/
       └── service.proto
   ```

3. **문서화**

   ```protobuf
   // service.proto
   // Service for handling user operations
   service UserService {
     // CreateUser creates a new user
     // Returns the created user information
     rpc CreateUser (CreateUserRequest) returns (CreateUserResponse) {}
   }
   ```

4. **재사용**
   ```protobuf
   // common.proto
   message Timestamp {
     int64 seconds = 1;
     int32 nanos = 2;
   }
   ```

## 배포 고려사항

1. **버전 호환성**

   - 기존 필드 제거하지 않기
   - 새로운 필드는 선택적으로 추가
   - 필드 번호 재사용하지 않기

2. **성능 최적화**

   - 메시지 크기 최소화
   - 적절한 필드 타입 선택
   - 불필요한 중첩 피하기

3. **보안**
   - TLS/SSL 설정
   - 인증 메커니즘 구현
   - 접근 제어 설정
