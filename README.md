# Master Of Slide

**Master Of Slide**는 `open-slide` 소스를 기반으로 만든 에이전트 친화형 슬라이드 제작 도구입니다. React로 슬라이드를 만들고, Web UI에서 미리보기, 발표, HTML/PDF/PPTX 내보내기, Canva 전달까지 이어갈 수 있습니다.

이 프로젝트는 한글 발표 자료 제작을 우선 고려해 `lang: 'ko'`, 한글 폰트 fallback, 한글 줄바꿈 규칙, Markdown/Obsidian 원문 기반 제작 흐름을 추가했습니다.

## 무엇을 할 수 있나

- React 컴포넌트로 1920 × 1080 슬라이드 제작
- Codex CLI 같은 코딩 에이전트에게 Markdown/Obsidian 문서 경로를 주고 슬라이드 생성
- Web UI에서 슬라이드 목록, 미리보기, 발표 모드, 에셋 관리
- HTML, PDF, PPTX 다운로드
- Canva Connect API로 PPTX를 Canva에 전달하고 Canva에서 후속 편집
- 한글 문서와 한글 발표 자료에 맞춘 렌더링 기본값
- 네오브루탈리즘 스타일 Web UI

## 빠른 시작

```bash
pnpm install
pnpm dev:demo
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:5173/
```

새 워크스페이스를 만들 때는 CLI를 사용할 수 있습니다.

```bash
npx @open-slide/cli init my-slide
cd my-slide
pnpm install
pnpm dev
```

## 기본 사용 흐름

1. `slides/<slide-id>/index.tsx`에 슬라이드를 작성합니다.
2. Web UI에서 슬라이드를 확인합니다.
3. 필요하면 Inspector/Design/Assets 패널에서 보정합니다.
4. 슬라이드에 로고를 넣으려면 상단 `Logo` 버튼을 누르고 이미지 파일을 선택합니다.
5. Download 메뉴에서 HTML, PDF, PPTX로 내보냅니다.
6. Canva에서 수정하려면 Canva 설정을 저장한 뒤 `Open in Canva`를 실행합니다.

CLI나 Codex가 새 슬라이드 폴더를 만들면 Web UI에도 반영됩니다. 예를 들어 에이전트가 아래 파일을 생성하면:

```text
slides/market-report/index.tsx
```

dev 서버는 파일 변경을 감지하고 홈 화면 목록에 `market-report`를 표시합니다. 서버가 이미 켜져 있는데 목록이 늦게 보이면 브라우저를 한 번 새로고침하면 됩니다.

## Markdown / Obsidian 문서로 슬라이드 만들기

Codex CLI 같은 에이전트 환경에서 다음처럼 요청하면 됩니다.

```text
이 Obsidian 문서를 바탕으로 발표 슬라이드를 만들어줘:
/Users/me/Obsidian/Vault/Research/My Note.md
```

내장 스킬 `create-slide-from-markdown`은 다음을 처리합니다.

- Markdown heading을 슬라이드 구조로 변환
- Obsidian wikilink, embed, callout을 일반 슬라이드 문맥으로 정리
- 한글 원문이면 한글 친화 디자인과 문장 밀도 적용
- 이미지 생성이 가능한 에이전트 환경이면 슬라이드 에셋 생성

## 한글 최적화

워크스페이스의 `open-slide.config.ts`에 `lang: 'ko'`를 설정합니다.

```ts
import type { OpenSlideConfig } from '@open-slide/core';

const openSlideConfig: OpenSlideConfig = {
  port: 5173,
  lang: 'ko',
};

export default openSlideConfig;
```

적용 범위:

- 브라우저 미리보기의 `<html lang="ko">`
- HTML/PDF export의 lang metadata
- 한글 폰트 fallback
- 한글 줄바꿈 안정화
- PPTX 생성 전 React 렌더링 과정의 한글 표시 안정화

## PPTX export

Download 메뉴에서 `Export as PPTX`를 선택하면 `.pptx` 파일이 다운로드됩니다.

현재 PPTX는 각 React 슬라이드를 이미지로 렌더링해 한 장씩 넣는 방식입니다. PowerPoint와 Canva에서 열기 안정성이 높고, Master Of Slide의 `slide.design` 토큰도 캡처 과정에 적용되어 배경색, 글자색, accent, 폰트 기반 시각 스타일이 유지됩니다.

다만 PPTX 안의 모든 텍스트와 도형이 PowerPoint/Canva의 개별 편집 객체로 변환되는 방식은 아닙니다. 텍스트 수정은 Canva에서 디자인 위에 새 텍스트를 얹어 보정하거나, 원본 React 슬라이드를 수정한 뒤 다시 export하는 흐름이 가장 안정적입니다.

## Web UI에서 로고 넣기

슬라이드 화면 상단의 `Logo` 버튼을 누르면 로고 이미지 파일을 선택할 수 있습니다.

동작 흐름:

1. 선택한 파일을 현재 슬라이드의 `slides/<slide-id>/assets/` 폴더에 저장합니다.
2. 현재 보고 있는 페이지만 로고 오버레이로 감쌉니다.
3. 로고는 기본적으로 오른쪽 위에 배치됩니다.
4. 위치나 크기를 바꾸고 싶으면 생성된 `slides/<slide-id>/index.tsx`의 `data-master-of-slide-logo` 이미지 스타일을 수정하면 됩니다.

현재 로고 삽입은 개발 서버에서만 동작합니다. 정적 빌드 결과물에서는 슬라이드 파일을 직접 수정할 수 없기 때문입니다.

## Canva 연결 흐름

Canva 계정 비밀번호를 입력하는 것이 아닙니다. 필요한 값은 **Canva Developer Portal에서 만든 Integration의 OAuth Client ID와 Client Secret**입니다.

Web UI에서 설정하는 방법:

1. 슬라이드 화면으로 들어갑니다.
2. Download 버튼을 누릅니다.
3. `Canva Settings`를 엽니다.
4. `Open Canva Developer Portal` 버튼을 눌러 Canva 개발자 페이지로 이동합니다.
5. Canva에서 Integration을 만들고 Client ID를 복사합니다.
6. Client Secret을 생성해 복사합니다.
7. 왼쪽 `Scopes` 메뉴에서 `design:content:write` 권한을 활성화합니다. PPTX를 Canva 디자인으로 가져오는 Design Import API에 필수입니다.
8. `Authentication` 메뉴의 Authorized redirects에 아래 값을 등록합니다.

```text
http://127.0.0.1:5173/api/canva/callback
```

9. Web UI의 Canva Settings에 Client ID, Client Secret, Redirect URI를 입력합니다.
10. `Save & Login`을 누릅니다.
11. Canva 로그인/승인을 완료합니다.
12. 다시 Download 메뉴에서 `Open in Canva`를 선택합니다.

저장된 값은 로컬 워크스페이스의 `.env` 파일에 저장됩니다. `.env`는 GitHub에 올리면 안 됩니다.

Canva에서 열리는 결과물은 Master Of Slide의 시각 스타일을 담은 PPTX를 Canva Design Import로 가져온 것입니다. Canva 안에서 열리더라도 Master Of Slide의 테마가 Canva의 네이티브 Brand Kit, 템플릿, 편집 가능한 테마 객체로 자동 변환되는 것은 아닙니다. 현재 목표는 “Canva에서 열 수 있고 후속 디자인 작업을 이어갈 수 있는 시각적으로 보존된 슬라이드”입니다.

## Canva CLI / Connect API 참고

Canva CLI는 주로 Canva Apps 개발용입니다. 이 프로젝트에서 PPTX를 Canva로 전달하는 기능은 Canva Connect API의 Design Import를 사용합니다.

공식 문서:

- Canva Developer Portal: https://www.canva.com/developers/apps
- Canva Connect 인증: https://www.canva.dev/docs/connect/authentication/
- Canva Design Import API: https://www.canva.dev/docs/connect/api-reference/design-imports/
- Canva CLI: https://www.canva.dev/docs/apps/canva-cli/

기존 PPTX 파일을 CLI로 Canva에 올릴 수도 있습니다.

```bash
CANVA_ACCESS_TOKEN=... open-slide import:canva deck.pptx --title "My deck"
```

## 주요 폴더

| 경로 | 설명 |
| --- | --- |
| `packages/core` | 런타임, Web UI, Vite plugin, export, Canva 연동, `open-slide` CLI |
| `packages/cli` | 새 워크스페이스 생성 CLI |
| `apps/demo` | 데모 슬라이드 워크스페이스 |
| `apps/web` | 소개용 Next.js 웹사이트 |

## 개발 명령어

```bash
pnpm dev:demo       # 데모 Web UI 실행
pnpm test           # 테스트 실행
pnpm --filter @open-slide/core typecheck
pnpm --filter @open-slide/core build
pnpm --filter demo build
```

## GitHub 업로드 전 주의

절대 올리면 안 되는 값:

- `.env`
- `CANVA_CLIENT_SECRET`
- Canva access token
- 기타 API key

이 저장소의 `.gitignore`는 `.env`를 무시하도록 설정되어야 합니다.

## 라이선스와 출처

Master Of Slide는 `open-slide` 소스를 기반으로 하며, 한글 최적화, Markdown/Obsidian 기반 제작 흐름, PPTX/Canva export 흐름, Web UI 스타일링을 추가했습니다.

License: MIT
