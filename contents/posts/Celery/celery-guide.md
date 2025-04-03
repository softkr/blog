---
title: 'Celery 개발 가이드'
description: 'Python Celery를 활용한 비동기 작업 처리 구현 가이드'
tags:
  - Celery
  - Python
date: 2024-12-13
---

# Celery 개발 가이드

## 개요

Celery는 Python으로 작성된 분산 태스크 큐 시스템입니다. 비동기 작업 처리, 정기적인 작업 예약, 분산 처리 등을 구현할 수 있습니다.

## 설치 및 기본 설정

### 1. 필요 패키지 설치

```bash
# Celery 및 브로커 설치
pip install celery
pip install "celery[redis]"  # Redis 브로커 사용 시
pip install "celery[rabbitmq]"  # RabbitMQ 브로커 사용 시
```

### 2. 프로젝트 구조

```
my_project/
├── celery_app/
│   ├── __init__.py
│   ├── celery.py
│   └── tasks.py
├── config.py
└── main.py
```

### 3. Celery 설정

```python
# celery_app/celery.py
from celery import Celery

# Celery 인스턴스 생성
app = Celery(
    'my_project',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/1',
    include=['celery_app.tasks']
)

# Celery 설정
app.conf.update(
    result_expires=3600,  # 결과 유효 시간
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Seoul',
    enable_utc=True,
)

# 정기적 작업 스케줄 설정
app.conf.beat_schedule = {
    'check-every-30-seconds': {
        'task': 'celery_app.tasks.check_status',
        'schedule': 30.0,
    },
}
```

## 태스크 정의

### 1. 기본 태스크

```python
# celery_app/tasks.py
from celery import shared_task
import time

@shared_task
def add(x, y):
    return x + y

@shared_task(bind=True)
def long_task(self, seconds):
    for i in range(seconds):
        time.sleep(1)
        # 진행 상태 업데이트
        self.update_state(
            state='PROGRESS',
            meta={'current': i, 'total': seconds}
        )
    return {'status': 'Task completed'}
```

### 2. 에러 처리와 재시도

```python
from celery import shared_task
from celery.exceptions import MaxRetriesExceededError

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=5,
    autoretry_for=(Exception,)
)
def reliable_task(self, data):
    try:
        # 작업 수행
        result = process_data(data)
        return result
    except Exception as exc:
        try:
            self.retry(exc=exc)
        except MaxRetriesExceededError:
            # 최대 재시도 횟수 초과
            return {'status': 'failed', 'error': str(exc)}
```

## 태스크 실행 및 모니터링

### 1. 태스크 호출

```python
# 동기적 호출
result = add.delay(4, 4)
print(result.get())  # 결과 대기

# 비동기적 호출
task = long_task.apply_async(args=[10])
print(task.id)  # 태스크 ID 출력
```

### 2. 상태 확인

```python
def check_task_status(task_id):
    task = long_task.AsyncResult(task_id)
    if task.state == 'PENDING':
        return {
            'state': task.state,
            'status': 'Task is waiting'
        }
    elif task.state == 'PROGRESS':
        return {
            'state': task.state,
            'status': task.info
        }
    else:
        return {
            'state': task.state,
            'status': task.info
        }
```

## 고급 기능

### 1. 체인 태스크

```python
from celery import chain

# 태스크 체인 정의
result = chain(
    add.s(4, 4),
    multiply.s(2)
)()
```

### 2. 그룹 태스크

```python
from celery import group

# 병렬 태스크 실행
numbers = range(100)
result = group(add.s(i, i) for i in numbers)()
```

### 3. 태스크 라우팅

```python
# celery_app/celery.py
app.conf.task_routes = {
    'celery_app.tasks.add': {'queue': 'math'},
    'celery_app.tasks.process_image': {'queue': 'image'},
}
```

### 4. 주기적 태스크

```python
from celery.schedules import crontab

app.conf.beat_schedule = {
    'daily-report': {
        'task': 'celery_app.tasks.generate_report',
        'schedule': crontab(hour=0, minute=0),
    },
}
```

## 실전 예제

### 1. 이미지 처리 태스크

```python
from PIL import Image
import os

@shared_task
def process_image(image_path, size):
    try:
        with Image.open(image_path) as img:
            # 이미지 리사이즈
            resized_img = img.resize(size)

            # 저장 경로 생성
            filename = os.path.basename(image_path)
            new_path = f'processed_{filename}'

            # 처리된 이미지 저장
            resized_img.save(new_path)

            return {
                'status': 'success',
                'path': new_path
            }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }
```

### 2. 이메일 발송 태스크

```python
from celery import shared_task
from email.mime.text import MIMEText
import smtplib

@shared_task(
    rate_limit='10/m',  # 분당 최대 10개
    retry_backoff=True
)
def send_email(to_addr, subject, body):
    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = 'sender@example.com'
        msg['To'] = to_addr

        with smtplib.SMTP('smtp.example.com', 587) as server:
            server.starttls()
            server.login('user', 'password')
            server.send_message(msg)

        return {'status': 'sent', 'to': to_addr}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
```

## Docker 환경 설정

### 1. Dockerfile

```dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["celery", "-A", "celery_app", "worker", "--loglevel=info"]
```

### 2. Docker Compose

```yaml
version: '3'

services:
  redis:
    image: redis:latest
    ports:
      - '6379:6379'

  celery_worker:
    build: .
    command: celery -A celery_app worker --loglevel=info
    volumes:
      - .:/app
    depends_on:
      - redis

  celery_beat:
    build: .
    command: celery -A celery_app beat --loglevel=info
    volumes:
      - .:/app
    depends_on:
      - redis
```

## 모니터링 및 관리

### 1. Flower 설정

```bash
pip install flower
celery -A celery_app flower
```

### 2. 모니터링 엔드포인트

```python
from celery.task.control import inspect

def get_active_tasks():
    i = inspect()
    return {
        'active': i.active(),
        'scheduled': i.scheduled(),
        'reserved': i.reserved()
    }
```

## 성능 최적화

1. **프리펫치 설정**

```python
app.conf.worker_prefetch_multiplier = 1
```

2. **작업자 풀 설정**

```python
app.conf.worker_pool = 'prefork'
app.conf.worker_concurrency = 4
```

3. **결과 백엔드 최적화**

```python
app.conf.result_expires = 3600  # 1시간
app.conf.task_ignore_result = True  # 결과 저장 비활성화
```

## 보안 고려사항

1. **메시지 서명**

```python
app.conf.task_serializer = 'json'
app.conf.accept_content = ['json']
app.conf.task_protocol = 2
```

2. **SSL/TLS 설정**

```python
app.conf.broker_use_ssl = {
    'keyfile': '/path/to/key.key',
    'certfile': '/path/to/cert.cert',
    'ca_certs': '/path/to/ca.pem',
    'cert_reqs': ssl.CERT_REQUIRED
}
```

## 트러블슈팅

### 일반적인 문제 해결

1. **작업자 연결 실패**

```python
# 브로커 연결 상태 확인
from celery_app import app
app.control.ping()
```

2. **메모리 누수**

```python
# 메모리 사용량 모니터링
from memory_profiler import profile

@profile
@shared_task
def memory_intensive_task():
    pass
```

3. **데드락 방지**

```python
app.conf.task_acks_late = True
app.conf.task_reject_on_worker_lost = True
```

## 마치며

Celery는 강력한 분산 태스크 처리 시스템이지만, 적절한 설정과 모니터링이 필요합니다. 실제 운영 환경에서는 성능, 안정성, 보안을 종합적으로 고려하여 구현해야 합니다.
