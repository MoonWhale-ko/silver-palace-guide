# 실버 스트림 — 실제 사이트

비공개 저장소. 승인된 이용자 화면과 콘텐츠를 보관합니다.

- `index.html`: 사이트 화면
- `assets/`: 화면 코드 및 이미지
- `data/home.json`: 홈 콘텐츠
- `scripts/build.mjs`: `dist/` 생성

관리자 사이트는 별도 비공개 저장소 `MoonWhale-ko/silver-palace-admin`에서 관리합니다. 이 저장소에는 편집 UI, 인증 코드, GitHub 토큰 또는 관리자 API를 넣지 않습니다.

`npm run check`와 `npm run build`로 검증합니다.

현재 분리 작업은 `restructure/site-admin-split` 브랜치에만 있습니다. `main`은 변경하지 않았습니다. 공개 및 기존 Cloudflare 자동 배포 변경은 사용자 승인 이후 진행합니다.

공개 승인 전 Cloudflare Pages 빌드는 `CF_PAGES` 검사로 중지합니다. 승인 후 배포 설정과 함께 이 임시 제한을 해제합니다.
