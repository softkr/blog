---
title: 'MongoDB 기본 사용'
description: 'MongoDB의 기본 개념과 사용법에 대해 알아봅니다'
tags:
  - Database
  - MongoDB
series: 'MongoDB 시리즈'
date: 2024-12-08
---

# MongoDB 기본 사용

MongoDB는 가장 인기 있는 NoSQL 데이터베이스 중 하나입니다. 이 글에서는 MongoDB의 기본적인 개념과 사용법에 대해 알아보겠습니다.

## MongoDB란?

MongoDB는 문서 지향(Document-Oriented) 데이터베이스입니다. JSON과 유사한 형태의 BSON(Binary JSON) 형식으로 데이터를 저장하며, 스키마가 유연하고 확장성이 뛰어난 것이 특징입니다.

### MongoDB의 주요 특징

- 스키마리스(Schemaless) 구조
- 수평적 확장 가능(Horizontal Scalability)
- 높은 가용성(High Availability)
- 풍부한 쿼리 기능

## 기본 구조

MongoDB의 기본 구조는 다음과 같습니다:

- 데이터베이스 (Database)
  - 컬렉션 (Collection)
    - 문서 (Document)

이는 관계형 데이터베이스의 구조와 비교하면 다음과 같습니다:

| RDBMS    | MongoDB    |
| -------- | ---------- |
| Database | Database   |
| Table    | Collection |
| Row      | Document   |
| Column   | Field      |

## 기본 명령어

### 데이터베이스 관련

```javascript
// 데이터베이스 목록 조회
show dbs

// 데이터베이스 선택/생성
use mydb

// 현재 데이터베이스 확인
db
```

### 컬렉션 관련

```javascript
// 컬렉션 생성
db.createCollection("users")

// 컬렉션 목록 조회
show collections

// 컬렉션 삭제
db.users.drop()
```

### CRUD 작업

#### Create (생성)

```javascript
// 단일 문서 삽입
db.users.insertOne({
  name: '홍길동',
  age: 30,
  email: 'hong@example.com',
});

// 다수 문서 삽입
db.users.insertMany([
  {
    name: '김철수',
    age: 25,
    email: 'kim@example.com',
  },
  {
    name: '이영희',
    age: 28,
    email: 'lee@example.com',
  },
]);
```

#### Read (조회)

```javascript
// 모든 문서 조회
db.users.find();

// 조건부 조회
db.users.find({ age: { $gt: 25 } });

// 특정 필드만 조회
db.users.find({}, { name: 1, email: 1 });

// 정렬
db.users.find().sort({ age: -1 });

// 제한
db.users.find().limit(5);
```

#### Update (수정)

```javascript
// 단일 문서 수정
db.users.updateOne({ name: '홍길동' }, { $set: { age: 31 } });

// 다수 문서 수정
db.users.updateMany({ age: { $lt: 30 } }, { $inc: { age: 1 } });
```

#### Delete (삭제)

```javascript
// 단일 문서 삭제
db.users.deleteOne({ name: '홍길동' });

// 다수 문서 삭제
db.users.deleteMany({ age: { $lt: 25 } });
```

## 쿼리 연산자

MongoDB는 다양한 쿼리 연산자를 제공합니다.

### 비교 연산자

- `$eq`: 같음
- `$ne`: 같지 않음
- `$gt`: 초과
- `$gte`: 이상
- `$lt`: 미만
- `$lte`: 이하
- `$in`: 배열 내 존재
- `$nin`: 배열 내 존재하지 않음

```javascript
// 나이가 25세 초과인 사용자 조회
db.users.find({ age: { $gt: 25 } });

// 나이가 25세 이상 30세 이하인 사용자 조회
db.users.find({ age: { $gte: 25, $lte: 30 } });
```

### 논리 연산자

- `$and`: AND 조건
- `$or`: OR 조건
- `$not`: NOT 조건
- `$nor`: NOR 조건

```javascript
// AND 조건
db.users.find({
  $and: [{ age: { $gt: 25 } }, { name: '홍길동' }],
});

// OR 조건
db.users.find({
  $or: [{ age: { $lt: 25 } }, { age: { $gt: 30 } }],
});
```

## 인덱싱

인덱스를 사용하면 쿼리 성능을 향상시킬 수 있습니다.

```javascript
// 단일 필드 인덱스 생성
db.users.createIndex({ email: 1 });

// 복합 인덱스 생성
db.users.createIndex({ name: 1, age: -1 });

// 인덱스 확인
db.users.getIndexes();

// 인덱스 삭제
db.users.dropIndex({ email: 1 });
```

## 실제 사용 예시

### 사용자 프로필 관리

```javascript
// 사용자 프로필 컬렉션
db.profiles.insertOne({
  userId: 'user123',
  name: '홍길동',
  age: 30,
  address: {
    city: '서울',
    street: '강남대로',
  },
  hobbies: ['독서', '등산'],
  createdAt: new Date(),
});

// 프로필 조회
db.profiles.find({
  'address.city': '서울',
  hobbies: '독서',
});
```

### 게시물 관리

```javascript
// 게시물 생성
db.posts.insertOne({
  title: '첫 번째 게시물',
  content: '내용입니다...',
  author: 'user123',
  tags: ['mongodb', 'database'],
  comments: [
    {
      user: 'user456',
      text: '좋은 글이네요',
      createdAt: new Date(),
    },
  ],
  createdAt: new Date(),
});

// 특정 태그를 가진 게시물 조회
db.posts.find({ tags: 'mongodb' });
```

## 마치며

이상으로 MongoDB의 기본적인 사용법에 대해 알아보았습니다. MongoDB는 유연한 스키마와 풍부한 쿼리 기능을 제공하여 현대적인 애플리케이션 개발에 매우 적합합니다. 다음 글에서는 MongoDB의 고급 기능들에 대해 더 자세히 알아보도록 하겠습니다.
