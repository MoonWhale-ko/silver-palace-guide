# 실버 스트림 배포

비공개 GitHub 저장소 하나에서 이용자 사이트와 관리자 사이트를 관리합니다. 기존 홈 디자인을 유지하고 `data/home.json`으로 문구·메뉴·업데이트를 분리했습니다.

## 이용자 사이트

Cloudflare Pages에서 이 비공개 저장소의 `main`을 연결합니다. 빌드 명령은 `npm run build`, 출력 폴더는 `dist`입니다. 정식 공개 승인 전에는 Cloudflare Access로 본인만 접근하도록 보호하세요. 저장소가 비공개여도 배포 주소는 별도 보호가 필요합니다.

## 관리자 사이트

Cloudflare Workers에서 같은 저장소를 연결하고 배포 명령을 `npm run deploy:admin`으로 설정합니다. 관리 화면 경로는 `/admin/`입니다. 이용자 사이트와 별도 프로젝트로 운영합니다.

Cloudflare Zero Trust Access에서 관리자 Worker 전체 주소를 보호하는 Self-hosted 애플리케이션을 만들고 본인 이메일만 허용합니다. Worker는 모든 요청의 Access JWT 서명·발급자·대상을 서버에서 검증하며, 설정이 없으면 접근을 거부합니다.

Worker 환경 변수:

- `ACCESS_TEAM_DOMAIN`: 실제 팀 도메인 (`팀이름.cloudflareaccess.com`)
- `ACCESS_AUD`: 관리자 Access 애플리케이션의 Audience 값
- `GITHUB_TOKEN`: 해당 저장소에만 Contents 읽기/쓰기 권한을 가진 토큰. 반드시 Cloudflare Secret으로 저장합니다.

토큰은 브라우저에 전달하지 않습니다. 저장 충돌이 발생하면 다시 불러오도록 안내합니다. 관리자 저장은 `main`의 `data/home.json`에 커밋하며, Pages의 GitHub 자동 배포 연결이 끝나면 사이트가 갱신됩니다. 아직 초안/검토/공개 승인 워크플로는 구현하지 않았으므로 공개 승인이 나기 전에는 이용자 사이트도 비공개로 유지해야 합니다.

## 현재 범위

홈 제목·설명, 입문 안내 문구, 메뉴 5개 이름·설명·링크, 업데이트 내용·날짜를 수정하고 실제 홈 렌더러로 미리 봅니다. 로고·색상·배치 편집과 다중 업데이트 관리는 후속 작업입니다. 외부 Cloudflare 프로젝트 생성 및 인증 연결은 별도 설정이 필요합니다.
