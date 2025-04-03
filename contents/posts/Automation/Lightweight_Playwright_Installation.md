---
title: 'Playwright 경량 설치 가이드'
description: '최소한의 의존성과 리소스로 Playwright를 설치하는 방법에 대한 가이드.'
tags:
  - Playwright
  - 설치
series: 'Playwright 최적화 시리즈'
date: 2024-12-09
---

# Playwright 경량 설치 가이드

## 개요

Playwright는 웹 애플리케이션 자동화를 위한 강력한 도구지만, 최소한의 구성 요소로만 설치해야 하는 경우가 있습니다. 이 가이드는 필수적인 구성 요소만 설치하여 Playwright를 가볍게 구성하는 방법을 설명합니다.

---

## 최소 설치 단계

### 1. pip 업그레이드 생략 (선택 사항)

이미 호환 가능한 버전의 pip이 설치되어 있다면 업그레이드를 생략할 수 있습니다. 그렇지 않다면 아래 명령어로 업그레이드하세요:

```bash
pip install --upgrade pip
```

---

### 2. Playwright 핵심 패키지 설치

브라우저 없이 Playwright 핵심 패키지만 설치합니다:

```bash
pip install playwright
```

---

### 3. 특정 브라우저만 설치 (예: Chromium)

추가적인 의존성을 설치하지 않고 특정 브라우저만 설치하려면:

```bash
playwright install chromium
```

- `--with-deps`를 생략하면 불필요한 시스템 라이브러리 설치를 방지할 수 있습니다.
- 이 방법은 필요한 브라우저만 설치하므로 설치가 간단하고 경량화됩니다.

---

### 4. 브라우저 설치 생략 (원격 브라우저 사용)

브라우저 설치를 완전히 생략하고, Playwright를 원격 브라우저(예: Docker 컨테이너에서 실행 중인 Headless Chrome)와 연결하여 사용할 수 있습니다. Python 예제:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("ws://<remote-browser-address>")
    page = browser.new_page()
    page.goto("https://example.com")
    print(page.title())
    browser.close()
```

이 방식에서는:

- 로컬 브라우저가 필요 없습니다.
- 원격 환경(예: Docker 컨테이너 또는 서버)에서 브라우저를 실행합니다.

---

## 명령어 요약

| 명령어                        | 설명                                       |
| ----------------------------- | ------------------------------------------ |
| `pip install playwright`      | Playwright 핵심 패키지 설치.               |
| `playwright install chromium` | Chromium 브라우저만 설치.                  |
| `pip install --upgrade pip`   | 선택 사항: pip을 최신 버전으로 업그레이드. |

---

## 사용 사례

- **로컬 테스트**: Chromium 브라우저만 설치하여 테스트 환경 구성.
- **원격 테스트**: 브라우저 설치를 생략하고 원격 브라우저 연결.
- **CI/CD 환경**: 설치를 최소화하여 리소스 절약 및 설정 시간 단축.

---
