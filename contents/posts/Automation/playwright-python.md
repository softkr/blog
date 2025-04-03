---
title: 'Playwright Python 상세 가이드'
description: 'Playwright를 Python에서 사용하는 방법에 대한 종합적인 가이드'
tags:
  - Playwright
  - Python
series: 'Web 자동화 도구 시리즈'
date: 2024-12-09
---

# Playwright Python 상세 가이드

## 목차

1. [소개](#1-소개)
2. [설치](#2-설치)
3. [기본 사용법](#3-기본-사용법)
4. [브라우저와 컨텍스트](#4-브라우저와-컨텍스트)
5. [페이지 조작](#5-페이지-조작)
6. [요소 선택 및 조작](#6-요소-선택-및-조작)
7. [이벤트 처리](#7-이벤트-처리)
8. [네트워크 요청 처리](#8-네트워크-요청-처리)
9. [스크린샷 및 비디오 캡처](#9-스크린샷-및-비디오-캡처)
10. [테스트 자동화](#10-테스트-자동화)
11. [고급 기능](#11-고급-기능)
12. [문제 해결 및 팁](#12-문제-해결-및-팁)

## 1. 소개

Playwright는 Microsoft에서 개발한 강력한 웹 자동화 라이브러리입니다. 이 가이드에서는 Playwright의 Python 버전 사용법을 상세히 설명합니다.

## 2. 설치

Playwright를 설치하려면 다음 명령을 실행합니다:

```bash
pip install playwright
playwright install
```

`playwright install` 명령은 필요한 브라우저 바이너리를 자동으로 다운로드합니다.

## 3. 기본 사용법

기본적인 Playwright 스크립트는 다음과 같습니다:

```python
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("https://www.example.com")
    print(page.title())
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
```

이 스크립트는 Chromium 브라우저를 실행하고, 예시 웹사이트를 방문한 후, 페이지 제목을 출력합니다.

## 4. 브라우저와 컨텍스트

### 브라우저 실행 옵션

```python
browser = playwright.chromium.launch(
    headless=False,  # GUI 모드로 실행
    slow_mo=50  # 각 작업 사이에 50ms 지연
)
```

### 브라우저 컨텍스트 사용

```python
context = browser.new_context(
    viewport={'width': 1280, 'height': 720},
    user_agent='My Custom User Agent'
)
page = context.new_page()
```

## 5. 페이지 조작

### 페이지 이동 및 대기

```python
page.goto("https://www.example.com")
page.wait_for_load_state("networkidle")
```

### 페이지 상호작용

```python
page.click("button#submit")
page.fill("input#search", "Playwright")
page.press("input#search", "Enter")
```

## 6. 요소 선택 및 조작

### 요소 선택

```python
element = page.query_selector("div.class")
elements = page.query_selector_all("li")
```

### 요소 조작

```python
element.click()
element.fill("Hello, Playwright!")
element.check()  # 체크박스나 라디오 버튼 선택
```

## 7. 이벤트 처리

```python
def handle_dialog(dialog):
    print(dialog.message)
    dialog.accept()

page.on("dialog", handle_dialog)
```

## 8. 네트워크 요청 처리

### 요청 인터셉트

```python
def handle_request(route):
    if ".png" in route.request.url:
        route.abort()
    else:
        route.continue_()

page.route("**/*", handle_request)
```

### 응답 대기

```python
with page.expect_response("https://api.example.com/data") as response_info:
    page.click("button#fetch-data")
response = response_info.value
```

## 9. 스크린샷 및 비디오 캡처

### 스크린샷 촬영

```python
page.screenshot(path="screenshot.png", full_page=True)
```

### 비디오 녹화

```python
context = browser.new_context(record_video_dir="videos/")
page = context.new_page()
# 페이지 조작...
context.close()
```

## 10. 테스트 자동화

Playwright는 pytest와 통합하여 사용할 수 있습니다:

```python
# conftest.py
import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        yield browser
        browser.close()

@pytest.fixture
def page(browser):
    page = browser.new_page()
    yield page
    page.close()

# test_example.py
def test_example_page(page):
    page.goto("https://www.example.com")
    assert page.title() == "Example Domain"
```

## 11. 고급 기능

### 모바일 에뮬레이션

```python
iphone_11 = playwright.devices['iPhone 11 Pro']
context = browser.new_context(**iphone_11)
```

### 지리적 위치 설정

```python
context = browser.new_context(
    geolocation={"latitude": 41.890221, "longitude": 12.492348},
    permissions=["geolocation"]
)
```

### 인증 처리

```python
context = browser.new_context(
    http_credentials={"username": "user", "password": "pass"}
)
```

## 12. 문제 해결 및 팁

- 요소를 찾지 못할 때는 `page.wait_for_selector()`를 사용하여 요소가 나타날 때까지 기다립니다.
- 비동기 작업을 처리할 때는 `page.wait_for_load_state("networkidle")`를 사용합니다.
- 디버깅을 위해 `page.pause()`를 사용하여 스크립트 실행을 일시 중지할 수 있습니다.
- 성능 최적화를 위해 불필요한 리소스 로딩을 차단합니다:

```python
page.route("**/*.{png,jpg,jpeg}", lambda route: route.abort())
```

이 가이드는 Playwright Python의 주요 기능과 사용법을 다루고 있습니다. 더 자세한 정보나 특정 사용 사례에 대해서는 [공식 Playwright Python 문서](https://playwright.dev/python/)를 참조하세요.
