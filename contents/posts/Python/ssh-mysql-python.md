---
title: 'SSH Tunneling을 활용한 Python MySQL 연결 가이드'
description: 'SSH Tunneling을 사용하여 Python에서 원격 MySQL 데이터베이스에 안전하게 연결하는 방법'
tags:
  - Python
  - MySQL
  - SSH
  - Database
  - Security
series: 'Python 데이터베이스 시리즈'
date: 2024-12-13
---

# SSH Tunneling을 활용한 Python MySQL 연결 가이드

## 개요

SSH Tunneling은 보안 연결을 통해 원격 데이터베이스에 안전하게 접근할 수 있게 해주는 기술입니다. 이 가이드에서는 Python을 사용하여 SSH Tunnel을 통해 MySQL 데이터베이스에 연결하는 방법을 설명합니다.

## 필요 패키지 설치

```bash
pip install sshtunnel
pip install pymysql
pip install cryptography
```

## 기본 연결 설정

### 1. 단순 SSH Tunnel 연결

```python
import pymysql
from sshtunnel import SSHTunnelForwarder

# SSH Tunnel 설정
ssh_tunnel = SSHTunnelForwarder(
    'remote_host',  # SSH 서버 주소
    ssh_username='ssh_user',
    ssh_password='ssh_password',  # 또는 ssh_pkey='/path/to/private/key'
    remote_bind_address=('127.0.0.1', 3306)  # MySQL 서버 주소와 포트
)

# Tunnel 시작
ssh_tunnel.start()

try:
    # MySQL 연결
    connection = pymysql.connect(
        host='127.0.0.1',
        port=ssh_tunnel.local_bind_port,
        user='mysql_user',
        password='mysql_password',
        database='database_name'
    )
    
    with connection.cursor() as cursor:
        cursor.execute('SELECT version()')
        result = cursor.fetchone()
        print(f'MySQL 버전: {result[0]}')

finally:
    # 연결 종료
    if 'connection' in locals():
        connection.close()
    ssh_tunnel.close()
```

### 2. SSH 키 인증 사용

```python
from pathlib import Path
import pymysql
from sshtunnel import SSHTunnelForwarder

# SSH 키 경로 설정
ssh_key = Path.home() / '.ssh' / 'id_rsa'

# SSH Tunnel 설정
ssh_tunnel = SSHTunnelForwarder(
    'remote_host',
    ssh_username='ssh_user',
    ssh_pkey=str(ssh_key),
    ssh_private_key_password='key_password',  # 키가 암호화되어 있는 경우
    remote_bind_address=('127.0.0.1', 3306)
)

ssh_tunnel.start()
# ... 이하 동일
```

## 실용적인 구현 예제

### 1. 컨텍스트 매니저 활용

```python
from contextlib import contextmanager
import pymysql
from sshtunnel import SSHTunnelForwarder

class DatabaseConnection:
    def __init__(self, ssh_config, db_config):
        self.ssh_config = ssh_config
        self.db_config = db_config
        self.tunnel = None
        self.connection = None

    @contextmanager
    def connect(self):
        try:
            # SSH Tunnel 설정
            self.tunnel = SSHTunnelForwarder(
                self.ssh_config['host'],
                ssh_username=self.ssh_config['user'],
                ssh_pkey=self.ssh_config['key_path'],
                remote_bind_address=(
                    self.db_config['host'], 
                    self.db_config['port']
                )
            )
            
            self.tunnel.start()

            # 데이터베이스 연결
            connection = pymysql.connect(
                host='127.0.0.1',
                port=self.tunnel.local_bind_port,
                user=self.db_config['user'],
                password=self.db_config['password'],
                database=self.db_config['database'],
                cursorclass=pymysql.cursors.DictCursor
            )

            yield connection

        finally:
            if connection:
                connection.close()
            if self.tunnel:
                self.tunnel.close()

# 사용 예제
ssh_config = {
    'host': 'remote_host',
    'user': 'ssh_user',
    'key_path': '/path/to/private/key'
}

db_config = {
    'host': '127.0.0.1',
    'port': 3306,
    'user': 'mysql_user',
    'password': 'mysql_password',
    'database': 'database_name'
}

db = DatabaseConnection(ssh_config, db_config)

# 데이터베이스 작업 수행
with db.connect() as conn:
    with conn.cursor() as cursor:
        cursor.execute('SELECT * FROM users')
        users = cursor.fetchall()
        print(users)
```

### 2. 연결 풀링 구현

```python
from queue import Queue
import threading
import pymysql
from sshtunnel import SSHTunnelForwarder

class ConnectionPool:
    def __init__(self, ssh_config, db_config, pool_size=5):
        self.ssh_config = ssh_config
        self.db_config = db_config
        self.pool_size = pool_size
        self.pool = Queue(maxsize=pool_size)
        self.lock = threading.Lock()
        self.tunnel = None
        self._initialize_pool()

    def _initialize_pool(self):
        # SSH Tunnel 설정
        self.tunnel = SSHTunnelForwarder(
            self.ssh_config['host'],
            ssh_username=self.ssh_config['user'],
            ssh_pkey=self.ssh_config['key_path'],
            remote_bind_address=(
                self.db_config['host'],
                self.db_config['port']
            )
        )
        self.tunnel.start()

        # 연결 풀 생성
        for _ in range(self.pool_size):
            connection = pymysql.connect(
                host='127.0.0.1',
                port=self.tunnel.local_bind_port,
                user=self.db_config['user'],
                password=self.db_config['password'],
                database=self.db_config['database'],
                cursorclass=pymysql.cursors.DictCursor
            )
            self.pool.put(connection)

    @contextmanager
    def get_connection(self):
        connection = self.pool.get()
        try:
            yield connection
        finally:
            if connection:
                self.pool.put(connection)

    def close(self):
        while not self.pool.empty():
            connection = self.pool.get()
            connection.close()
        if self.tunnel:
            self.tunnel.close()

# 사용 예제
pool = ConnectionPool(ssh_config, db_config)

try:
    with pool.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('SELECT * FROM users')
            users = cursor.fetchall()
            print(users)
finally:
    pool.close()
```

## 에러 처리

```python
import logging
from pymysql.err import OperationalError, Error as PyMySQLError
from sshtunnel import BaseSSHTunnelForwarderError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def execute_query(connection_pool, query, params=None):
    try:
        with connection_pool.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params or ())
                return cursor.fetchall()
                
    except OperationalError as e:
        logger.error(f"데이터베이스 연결 오류: {e}")
        raise
        
    except PyMySQLError as e:
        logger.error(f"쿼리 실행 오류: {e}")
        raise
        
    except BaseSSHTunnelForwarderError as e:
        logger.error(f"SSH Tunnel 오류: {e}")
        raise
        
    except Exception as e:
        logger.error(f"예상치 못한 오류: {e}")
        raise
```

## 보안 고려사항

1. **SSH 키 관리**
   - 키 파일 권한 설정
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```
   - 키 파일 암호화 사용

2. **환경 변수 활용**
   ```python
   import os
   from dotenv import load_dotenv

   load_dotenv()

   ssh_config = {
       'host': os.getenv('SSH_HOST'),
       'user': os.getenv('SSH_USER'),
       'key_path': os.getenv('SSH_KEY_PATH')
   }
   ```

3. **연결 타임아웃 설정**
   ```python
   ssh_tunnel = SSHTunnelForwarder(
       'remote_host',
       ssh_username='ssh_user',
       ssh_pkey='/path/to/private/key',
       remote_bind_address=('127.0.0.1', 3306),
       timeout=15.0  # 연결 타임아웃 설정
   )
   ```

## 성능 최적화 팁

1. **연결 재사용**
   - 가능한 한 연결 풀 사용
   - 장기 실행 스크립트의 경우 연결 상태 모니터링

2. **배치 처리**
   ```python
   def batch_insert(connection_pool, records, batch_size=1000):
       with connection_pool.get_connection() as conn:
           with conn.cursor() as cursor:
               for i in range(0, len(records), batch_size):
                   batch = records[i:i + batch_size]
                   cursor.executemany(
                       "INSERT INTO table_name (column1, column2) "
                       "VALUES (%s, %s)",
                       batch
                   )
               conn.commit()
   ```

3. **비동기 처리 구현**
   ```python
   import asyncio
   import aiomysql
   from asyncssh import connect as ssh_connect

   async def async_query(pool, query):
       async with pool.acquire() as conn:
           async with conn.cursor() as cursor:
               await cursor.execute(query)
               return await cursor.fetchall()
   ```

## 마치며

SSH Tunneling을 통한 MySQL 연결은 보안성과 안정성을 모두 갖춘 접근 방식입니다. 실제 운영 환경에서는 연결 풀링, 에러 처리, 보안 설정 등을 종합적으로 고려하여 구현해야 합니다.

다음 글에서는 SSH Tunneling을 활용한 고급 데이터베이스 작업과 성능 최적화 기법에 대해 더 자세히 알아보도록 하겠습니다.
