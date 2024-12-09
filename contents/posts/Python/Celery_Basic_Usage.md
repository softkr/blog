
---
title: 'Celery 기본 사용'
description: 'Python 기반의 비동기 작업 큐 Celery에 대한 기본 개념 및 사용법 설명서'
tags:
  - Python
  - Celery
  - Task Queue
series: 'Python 비동기 처리 시리즈'
date: 2024-12-09
---

# Celery 기본 사용법

## Celery란?
Celery는 Python 기반의 **비동기 작업 큐(task queue)**로, 작업을 백그라운드에서 처리하거나 분산 작업(distributed task)을 실행하는 데 사용됩니다. 주로 웹 애플리케이션과의 통합을 통해, 오래 걸리는 작업을 비동기적으로 처리하거나 다른 워커(worker)에 분산하는 데 적합합니다.

---

## 핵심 구성 요소

1. **브로커(Broker)**  
   작업 메시지를 전달하는 역할을 하며, 일반적으로 Redis나 RabbitMQ를 사용합니다.

2. **워커(Worker)**  
   작업을 처리하는 프로세스입니다. Celery 워커는 브로커로부터 작업을 받아 실행합니다.

3. **결과 백엔드(Result Backend)**  
   작업 결과를 저장하며, Redis, 데이터베이스, 파일시스템 등을 지원합니다.

---

## 설치

```bash
pip install celery[redis]
```

Redis를 브로커로 사용하는 경우, 위 명령어로 Celery와 Redis 관련 의존성을 함께 설치할 수 있습니다.

---

## 간단한 예제

### 1. 작업 정의하기
`tasks.py` 파일에 작업(task)을 정의합니다.

```python
from celery import Celery

app = Celery(
    "example",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

@app.task
def add(x, y):
    return x + y
```

### 2. 워커 실행하기

```bash
celery -A tasks worker --loglevel=info
```

### 3. 작업 호출하기

```python
from tasks import add

result = add.delay(4, 6)
print(result.get())  # 결과: 10
```

---

## 주요 개념

### 비동기 작업
`delay()` 또는 `apply_async()` 메서드를 사용해 작업을 비동기로 실행할 수 있습니다.

### 스케줄링
`celery.beat`를 활용하면 주기적인 작업을 설정할 수 있습니다.

---

## 구성 파일

`celeryconfig.py`를 사용해 Celery의 브로커, 백엔드, 모듈 등을 설정할 수 있습니다.

```python
broker_url = "redis://localhost:6379/0"
result_backend = "redis://localhost:6379/0"
task_serializer = "json"
result_serializer = "json"
accept_content = ["json"]
timezone = "Asia/Seoul"
enable_utc = True
```

---

## 고급 기능

1. **체인(Chains)**  
   여러 작업을 연결하여 순차적으로 실행합니다.
   ```python
   from celery import chain
   chain(add.s(2, 3), add.s(4)).apply_async()
   ```

2. **그룹(Groups)**  
   여러 작업을 병렬로 실행합니다.
   ```python
   from celery import group
   group(add.s(2, 3), add.s(4, 5)).apply_async()
   ```

3. **리트라이(Retry)**  
   실패한 작업을 재시도합니다.
   ```python
   @app.task(bind=True, max_retries=3)
   def retry_example(self):
       try:
           # 작업 로직
           pass
       except Exception as exc:
           raise self.retry(exc=exc)
   ```

---

## 참고 자료
- [Celery 공식 문서](https://docs.celeryproject.org/)
- [Redis 공식 사이트](https://redis.io/)
