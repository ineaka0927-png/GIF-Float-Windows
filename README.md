# GIF Float — Windows Electron 프로젝트

## 기능
- 최대 10개 가리개를 표 형태로 관리
- O: 열기/닫기
- T: 위치 이동 손잡이 표시/숨김으로 위치 고정/해제
- B: 작업표시줄 최소화/복원
- I: 로컬 PNG/GIF/JPG/WebP/BMP 파일 또는 HTTP(S) URL 설정
- 투명 PNG/GIF 알파 채널 유지, 테두리 없는 투명 창, 항상 위 표시
- 모두 열기/모두 닫기, 설정 저장, 창 위치/크기 저장

## 실행
Windows에 Node.js LTS 설치: https://nodejs.org/
프로젝트 폴더에서:
```bash
npm install
npm start
```

## Windows 설치 파일 빌드
Windows에서:
```bash
npm install
npm run dist:win
```
성공 시 `dist/GIF-Float-Setup-1.0.0.exe` 생성.

## FugiTech 주의
I 버튼에서 Browser Source URL을 입력하면 iframe으로 표시합니다. 원본이 X-Frame-Options 또는 CSP frame-ancestors로 외부 삽입을 차단하거나 로그인/세션/권한이 필요하면 빈 화면이 될 수 있습니다. 이 정책을 우회하지 않습니다.

## 테스트 범위
이 ZIP은 Electron 소스 프로젝트입니다. 현재 실행 환경에서 Windows .exe 빌드 및 실제 Windows 실행 테스트는 수행하지 않았습니다. 따라서 EXE가 ZIP에 포함되어 있지는 않습니다. GIF/PNG 표시는 Chromium 기본 이미지 렌더링에 의존하며, 실제 샘플로 검증하지 않았습니다.


## GitHub에서 EXE 자동 빌드(로컬 Windows PC가 없을 때)
1. 이 프로젝트를 GitHub 저장소에 업로드합니다.
2. 저장소의 Actions 탭에서 `Build Windows installer`를 선택합니다.
3. `Run workflow`를 실행하고 완료될 때까지 기다립니다.
4. 완료된 실행 항목의 Artifacts에서 `GIF-Float-Windows-Installer`를 내려받습니다.

GitHub 계정과 저장소 업로드가 필요합니다. 이 워크플로 파일 자체는 설치 파일이 아니며, GitHub Actions가 실제 Windows 빌드를 수행합니다.
