---
title: 'Playwright 시작하기'
description: 'Playwright를 사용하여 웹 애플리케이션 테스트를 자동화하는 방법에 대한 설명서'
tags:
  - Playwright
  - Automation
series: 'Playwright 자동화 시리즈'
date: 2024-12-09
---

# Playwright 기본 사용 가이드

## 개요

Playwright는 Microsoft에서 개발한 웹 애플리케이션 테스트 자동화 도구로, Chromium, Firefox, WebKit 등 다양한 브라우저에서 테스트를 지원한다. 강력한 API와 병렬 실행 기능을 제공하여 효율적인 테스트 환경을 구축할 수 있다. 공식 문서: [Playwright 공식 문서](https://playwright.dev)

## 설치 방법

### Node.js 설치

Playwright는 Node.js 기반이므로, 먼저 Node.js를 설치해야 한다. 최신 LTS 버전을 설치하는 것이 권장된다: [Node.js 다운로드](https://nodejs.org)

### Playwright 설치

1. 프로젝트 폴더를 생성한 후 npm 초기화:
   ```bash
   mkdir playwright-project
   cd playwright-project
   npm init -y
   ```
2. Playwright 설치:
   ```bash
   npm install playwright
   ```
3. Playwright 환경 설치 (필요한 브라우저를 포함):
   ```bash
   npx playwright install
   ```

## 기본 사용법

### 첫 번째 스크립트 작성

`example.spec.js` 파일 생성:

```javascript
const { test, expect } = require('@playwright/test');

test('Example Test', async ({ page }) => {
  await page.goto('https://example.com');
  const title = await page.title();
  expect(title).toBe('Example Domain');
});
```

### 테스트 실행

Playwright 테스트 실행:

```bash
npx playwright test
```

### 브라우저 열고 실행

테스트를 브라우저에서 디버깅하려면:

```bash
npx playwright test --headed
```

## 주요 기능

### 페이지 스크린샷

```javascript
await page.screenshot({ path: 'screenshot.png' });
```

### 엘리먼트 선택 및 동작

```javascript
await page.click('text=Get Started');
await page.fill('#username', 'myUsername');
await page.press('#password', 'Enter');
```

### 네트워크 요청 가로채기

```javascript
await page.route('**/*', (route) => {
  console.log(route.request().url());
  route.continue();
});
```

### 병렬 테스트 실행

Playwright는 병렬 실행을 기본적으로 지원한다. 설정 파일에서 워커 수를 지정하여 병렬성을 조정할 수 있다:

```json
// playwright.config.js
module.exports = {
  workers: 4
};
```

## 디버깅

1. `playwright.config.js`에 `trace` 설정 추가:
   ```javascript
   module.exports = {
     use: {
       trace: 'on-first-retry',
     },
   };
   ```
2. 실행 후 `.zip` 파일로 저장된 Trace를 Playwright Trace Viewer로 분석:
   ```bash
   npx playwright show-trace trace.zip
   ```

## 업데이트 및 제거

### 업데이트

```bash
npm update playwright
```

### 제거

```bash
npm uninstall playwright
```

---
