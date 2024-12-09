
---
title: 'Go 바이너리 크기 최적화'
description: 'Go 언어로 빌드된 바이너리 크기를 최적화하는 방법에 대한 설명서'
tags:
  - Go
  - Optimization
  - Programming
series: 'Go 최적화 시리즈'
date: 2024-12-09
---

# Go 언어로 빌드된 바이너리 크기 최적화 요약

## 기본 상태
Go 언어로 "Hello World" 프로그램을 빌드했을 때 초기 상태의 바이너리 크기는 2012745 바이트입니다.

## 최적화 방법

### 1. 스트립
`-ldflags="-w -s"` 플래그를 사용하면 디버깅 정보를 제거하여 크기를 줄일 수 있습니다.
```bash
$ go build -ldflags="-w -s"
바이너리 크기: 1437696 바이트
```

### 2. 함수 인라이닝 비활성화
`-gcflags=all=-l` 플래그를 추가하면 인라이닝을 비활성화합니다.
```bash
$ go build -ldflags="-w -s" -gcflags=all=-l
바이너리 크기: 1437696 바이트
```

### 3. 경계 검사 비활성화
`-gcflags=all="-l -B"` 플래그로 경계 검사를 비활성화하여 약간의 크기 감소가 가능합니다.
```bash
$ go build -a -gcflags=all="-l -B" -ldflags="-w -s"
바이너리 크기: 1404928 바이트
```

### 4. 쓰기 배리어 비활성화
`-gcflags=all=-wb=false`를 추가하면 쓰기 배리어를 비활성화할 수 있습니다.
> ⚠️ GC가 제대로 작동하지 않을 수 있으므로 주의해야 합니다.

### 5. 기타 `gcflags`
`-C` 같은 다른 `gcflags` 옵션을 시도할 수도 있습니다.

### 6. 바이너리 압축
[UPX](https://github.com/upx/upx)를 사용하여 바이너리를 압축할 수 있습니다.
```bash
$ upx --best --ultra-brute helloworld
압축 후 크기: 391292 바이트
```
압축하면 속도 저하와 메모리 소비 증가가 발생할 수 있습니다.

### 7. 32비트 사용
`GOARCH=386`를 사용하여 32비트 바이너리를 생성하면 크기를 줄일 수 있습니다.
```bash
$ GOARCH=386 go build -a -gcflags=all="-l -B" -ldflags="-w -s"
바이너리 크기: 1204224 바이트
```

### 8. 함수 이름 제거
함수 이름을 제거하면 크기를 추가로 줄일 수 있지만, 디버깅과 로깅 기능이 손상됩니다.

### 9. GCCGo 사용
`gccgo` 컴파일러를 사용하여 크기를 극단적으로 줄일 수 있습니다.
```bash
$ go build -a -compiler gccgo -gccgoflags=all='-flto -Os -fdata-sections -ffunction-sections -Wl,--gc-sections,-s'
바이너리 크기: 23184 바이트
```

## 기타 고려사항

### "TinyGo" 프로젝트 사용
[TinyGo](https://tinygo.org/)를 사용하면 매우 작은 크기의 바이너리를 생성할 수 있습니다.
```bash
$ tinygo build -o helloworld main.go
바이너리 크기: 167888 바이트
```

### 죽은 코드 제거
리플렉션을 사용하지 않거나 불필요한 데이터를 제거하여 바이너리 크기를 줄일 수 있습니다.

### Go 버전 업그레이드/다운그레이드
Go 커뮤니티에서 크기 최적화를 위해 지속적으로 업데이트를 제공하고 있으므로, 최신 버전이나 특정 버전을 사용하여 테스트할 수 있습니다.

---

# 참고 링크
- [Go의 실행 파일 크기가 너무 큰 이유](https://www.cockroachlabs.com/blog/go-file-size/)
- [runtime: pclntab 크기 최적화 이슈](https://github.com/golang/go/issues/36313)
- [TinyHelloWorld 예제](https://github.com/xaionaro-go/tinyhelloworld)
