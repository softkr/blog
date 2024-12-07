---
title: '윈도우에서 Python 가상환경 활성화'
description: 'Python 가상환경 활성화 시 발생하는 PowerShell 보안 정책 오류 해결하기'
tags:
  - Virtual Environment
  - Python
series: 'Python 개발 환경 설정 시리즈'
date: 2024-12-07
update: 2024-12-07
---

# Python 가상환경 활성화 시 발생하는 PowerShell 보안 정책 오류 해결하기

## 문제 상황

새로운 노트북에서 Python 가상환경을 설정하는 과정에서 흔히 마주치는 문제가 있습니다. PowerShell에서 가상환경을 활성화하려고 할 때 다음과 같은 보안 관련 오류 메시지를 만나게 되죠.

```powershell
.\activate.ps1 : 이 시스템에서 스크립트를 실행할 수 없으므로 C:\Users\20170218\Desktop\temp\naver_stock\venv\Scripts\activate.ps1 파일을 로드할 수 없습니다.
자세한 내용은 about_Execution_Policies(https://go.microsoft.com/fwlink/?LinkID=135170)를 참조하십시오.
위치 줄:1 문자:1
+ .\activate.ps1
    + CategoryInfo          : 보안 오류: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

## 원인 분석

이러한 오류가 발생하는 이유는 Windows PowerShell의 기본 보안 정책 때문입니다. PowerShell은 기본적으로 스크립트 실행을 제한하는 정책을 가지고 있어, 악성 스크립트로부터 시스템을 보호합니다. 하지만 이러한 보안 정책이 때로는 우리가 필요한 정상적인 스크립트의 실행도 막게 되죠.

## 해결 방법

다행히도 이 문제는 간단한 단계를 통해 해결할 수 있습니다.

### 1단계: PowerShell 관리자 모드로 실행

- Windows 시작 메뉴에서 PowerShell을 검색
- 마우스 우클릭 후 "관리자 권한으로 실행" 선택

### 2단계: 실행 정책 변경

관리자 모드의 PowerShell에서 다음 명령어를 실행합니다:

```powershell
Set-ExecutionPolicy Unrestricted
```

이 명령어는 PowerShell의 스크립트 실행 정책을 'Unrestricted'로 변경하여, 신뢰할 수 있는 스크립트의 실행을 허용합니다.

## 주의사항

보안 정책을 변경하는 것은 시스템의 보안에 영향을 미칠 수 있습니다. 따라서 다음 사항들을 유의해야 합니다:

1. 신뢰할 수 있는 소스의 스크립트만 실행하기
2. 필요한 작업이 끝난 후에는 보안 정책을 다시 제한적으로 설정하는 것을 고려하기
3. 개발 환경과 운영 환경을 분리하여 관리하기

## 마치며

이러한 보안 정책 관련 오류는 개발 환경을 새로 설정할 때 자주 마주치는 문제 중 하나입니다. 위의 해결 방법을 통해 Python 가상환경을 원활하게 사용할 수 있게 되었지만, 항상 보안과 편의성 사이의 균형을 고려하는 것이 중요합니다.

더 자세한 내용이나 다양한 실행 정책 옵션에 대해 알고 싶다면, [Microsoft의 공식 문서](https://go.microsoft.com/fwlink/?LinkID=135170)를 참조하시기 바랍니다.

---

_이 글은 Python 개발 환경 설정 시리즈의 일부입니다._
