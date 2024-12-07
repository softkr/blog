---
title: 'apple  프로그램 깨져서 실행 안될때'
description: 'apple 프로그램 깨져서 실행 안될때 해결 방법'
date: 2024-12-07
update: 2024-12-07
tags:
  - utility
series: 'apple 프로그램'
---

# macOS 앱 실행 문제 해결: 인증되지 않은 앱 허용하기

macOS에서는 보안상의 이유로 인증되지 않은 앱(특히 App Store 외부에서 다운로드한 앱)의 실행을 제한합니다. 하지만 개발자나 특정 앱 사용자에게는 이러한 제한이 번거로울 수 있습니다. 아래 방법을 통해 인증되지 않은 앱을 실행할 수 있도록 설정하고, 다시 원래 상태로 복구하는 방법을 소개합니다.

---

## **명령어 설명**

아래 명령어는 macOS의 **Gatekeeper**와 관련된 보안 설정을 조정하여, 인증되지 않은 앱을 실행할 수 있도록 합니다.

```bash
# 1. Gatekeeper 비활성화
sudo spctl --master-disable

# 2. 앱의 격리 속성을 제거 (예: Sublime Text)
sudo xattr -r -d com.apple.quarantine /Applications/Sublime\ Text.app

# 3. 다른 앱도 동일하게 처리
sudo xattr -d com.apple.quarantine /Applications/xxxx.app

# 4. Gatekeeper 다시 활성화
sudo spctl --master-enable

```
