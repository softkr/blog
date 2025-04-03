---
title: 'Celery 개발 문서'
description: 'Python Celery를 활용한 단순 구현 팁'
tags:
  - Celery
  - Python
series: 'Celery 개발 시리즈'
date: 2024-12-13
---

### **Celery 개발 문서**

---

### **목차**

1. Celery 소개
2. 설치 및 기본 설정
3. Celery 애플리케이션 구성
4. 작업(Task) 생성 및 실행
5. 메시지 브로커 설정
6. 결과 백엔드 설정
7. Celery Beat로 주기적 작업 관리
8. 고급 기능
   - 태스크 체이닝 및 워크플로
   - 작업 재시도
   - 작업 우선순위
9. Celery 모니터링
10. Celery 최적화 및 성능 튜닝
11. 예제 프로젝트

---

### **1. Celery 소개**

Celery는 **비동기 작업 큐**를 구현하는 Python 분산 시스템으로, 실시간 작업 처리와 대규모 작업 처리를 지원합니다.  
주요 특징:

- 분산 가능
- 작업 재시도 및 결과 추적 가능
- 메시지 브로커(Redis, RabbitMQ 등)와 통합

---

### **2. 설치 및 기본 설정**

#### **설치**

Celery와 Redis를 설치합니다:

```bash
pip install celery[redis]
```

#### **기본 폴더 구조**

```plaintext
project/
├── tasks.py          # Celery 작업 정의
├── celery_app.py     # Celery 애플리케이션 구성
├── requirements.txt  # 종속성
└── worker.log        # 로그 파일
```

---

### **3. Celery 애플리케이션 구성**

#### **celery_app.py**

```python
from celery import Celery

# Celery 애플리케이션 생성
app = Celery(
    'my_project',
    broker='redis://localhost:6379/0',  # 메시지 브로커 URL
    backend='redis://localhost:6379/0'  # 결과 백엔드 URL
)

# 기본 설정
app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='UTC',
    enable_utc=True,
)
```

---

### **4. 작업(Task) 생성 및 실행**

#### **tasks.py**

```python
from celery_app import app

@app.task
def add(x, y):
    return x + y

@app.task
def multiply(x, y):
    return x * y
```

#### **작업 실행**

- **Celery 워커 시작**

```bash
celery -A celery_app worker --loglevel=info
```

- **작업 호출**

```python
from tasks import add

result = add.delay(3, 5)  # 작업을 비동기적으로 호출
print(result.get())      # 결과 확인
```

---

### **5. 메시지 브로커 설정**

#### **Redis를 메시지 브로커로 사용**

Redis 설치:

```bash
sudo apt install redis
```

Celery 설정:

```python
broker_url = 'redis://localhost:6379/0'
```

#### **RabbitMQ를 메시지 브로커로 사용**

RabbitMQ 설치:

```bash
sudo apt install rabbitmq-server
```

Celery 설정:

```python
broker_url = 'amqp://guest@localhost//'
```

---

### **6. 결과 백엔드 설정**

결과 백엔드 설정은 태스크 실행 결과를 저장하고 싶을 때 사용합니다.

- Redis를 결과 백엔드로 설정:

```python
result_backend = 'redis://localhost:6379/0'
```

- 데이터베이스를 결과 백엔드로 설정:

```python
result_backend = 'db+sqlite:///results.sqlite3'
```

---

### **7. Celery Beat로 주기적 작업 관리**

`celery[redis,celerybeat]`를 설치:

```bash
pip install "celery[redis,celerybeat]"
```

#### **celery_app.py 업데이트**

```python
from celery import Celery
from celery.schedules import crontab

app = Celery('my_project', broker='redis://localhost:6379/0')

app.conf.beat_schedule = {
    'add-every-30-seconds': {
        'task': 'tasks.add',
        'schedule': 30.0,  # 30초마다 실행
        'args': (16, 16)
    },
}
```

#### **Beat 실행**

```bash
celery -A celery_app beat --loglevel=info
```

---

### **8. 고급 기능**

#### **1) 태스크 체이닝 및 워크플로**

```python
from celery import chain
result = chain(add.s(2, 2), multiply.s(4)).apply_async()
```

#### **2) 작업 재시도**

```python
@app.task(bind=True, max_retries=3)
def unreliable_task(self, x):
    try:
        # 실패 가능 작업
        return x / 0
    except ZeroDivisionError as exc:
        raise self.retry(exc=exc, countdown=5)
```

#### **3) 작업 우선순위**

```python
@app.task(queue='high_priority')
def high_priority_task(x):
    return x * 2
```

---

### **9. Celery 모니터링**

#### **Flower 설치 및 실행**

Flower는 Celery 작업을 실시간으로 모니터링하는 도구입니다.

```bash
pip install flower
celery -A celery_app flower
```

웹 UI: [http://localhost:5555](http://localhost:5555)

---

### **10. Celery 최적화 및 성능 튜닝**

1. **워크 컨커런시 설정**

   ```bash
   celery -A celery_app worker --concurrency=4 --loglevel=info
   ```

2. **태스크 사전 로드**

   ```python
   app.conf.worker_prefetch_multiplier = 1
   ```

3. **결과 TTL 설정**
   ```python
   app.conf.result_expires = 3600  # 1시간 후 결과 삭제
   ```

---

### **11. 예제 프로젝트**

#### **간단한 파일 처리**

- **tasks.py**

```python
from celery_app import app

@app.task
def process_file(file_path):
    with open(file_path, 'r') as file:
        data = file.read()
    return len(data.split())
```

- **main.py**

```python
from tasks import process_file

result = process_file.delay('example.txt')
print(f"Word count: {result.get()}")
```

#### **실행**

```bash
celery -A celery_app worker --loglevel=info
python main.py
```

---

Celery는 **분산 작업 처리**와 **비동기 처리**가 중요한 환경에서 강력한 도구입니다. 이 문서를 기반으로 프로젝트 요구사항에 맞는 Celery 구성을 설계하세요!
