# CLAUDE.md — myblog (seminlog.com)

## 프로젝트 개요

Semin's Blog — 경제학·컴퓨터공학을 공부하는 개인 블로그.
URL: `https://www.seminlog.com`
Vercel에 배포되며, Supabase를 백엔드(DB·Auth·Storage)로 사용한다.

---

## 기술 스택

| 영역       | 기술                        |
| ---------- | --------------------------- |
| 프레임워크 | Next.js 16.1.6 (App Router) |
| 언어       | TypeScript 5 (strict mode)  |

| UI | React 19, CSS Modules |
| 백엔드/DB | Supabase (PostgreSQL) |
| 인증 | Supabase Auth (email/password) + `@supabase/ssr` |
| 스토리지 | Supabase Storage (`post-image` 버킷) |
| 에디터 | @toast-ui/react-editor (WYSIWYG/Markdown) |
| 마크다운 렌더링 | react-markdown + remark-gfm + remark-math + rehype-katex |
| 수식 | KaTeX |
| 분석 | @vercel/analytics |
| 배포 | Vercel |
| 린트 | ESLint 9 + eslint-config-next |

---

## 개발 명령어

```bash
npm run dev      # 개발 서버 시작 (webpack 모드)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 시작
npm run lint     # ESLint 실행
```

> `.npmrc`에 `legacy-peer-deps=true` 설정 — toast-ui 피어 의존성 충돌 해결용

---

## 환경 변수

`.env.local`에 아래 두 변수가 필요하다:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
```

---

## 디렉터리 구조

FSD(Feature-Sliced Design) 아키텍처를 따른다.

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── (home)/                   # 홈 (Route Group, layout 없음)
│   │   └── page.tsx              # 최근 포스트 목록
│   ├── posts/                    # 전체 글 목록 (?category=<id> 필터)
│   ├── post/
│   │   └── [id]/
│   │       ├── page.tsx          # 포스트 상세
│   │       ├── MarkdownContent.tsx  # 마크다운 렌더러 (Client)
│   │       ├── DeleteButton.tsx  # 삭제 버튼 (Client)
│   │       └── edit/             # 포스트 수정
│   ├── post/write/               # 새 포스트 작성
│   ├── drafts/                   # 임시저장 목록
│   ├── login/
│   ├── signup/
│   ├── profile/
│   ├── sitemap/route.ts          # XML 사이트맵 Route Handler
│   ├── robots.ts                 # robots.txt
│   ├── layout.tsx                # Root Layout (Geist 폰트)
│   └── globals.css
│
├── widgets/                      # 페이지를 구성하는 독립적인 블록
│   ├── header/ui/Header.tsx      # 헤더 (Server Component)
│   ├── footer/ui/Footer.tsx
│   └── sidebar/ui/
│       ├── SidebarServer.tsx     # 카테고리·유저 fetch (Server)
│       └── SidebarClient.tsx     # 트리 렌더링·토글 (Client)
│
├── features/                     # 사용자 시나리오/액션
│   ├── auth/
│   │   ├── api/auth.ts           # Server Actions: login, signup, logout
│   │   ├── model/types.ts        # AuthState 타입
│   │   └── ui/                   # AuthButtons, LoginButton, LogoutButton, SignupButton
│   ├── post/
│   │   ├── create/ui/CreatePost.tsx   # 글쓰기 버튼
│   │   ├── list/ui/                   # PostCard, RecentPosts
│   │   └── write/ui/
│   │       ├── PostEditor.tsx         # 새 글 에디터 (Client)
│   │       ├── PostEditorLoader.tsx   # dynamic import 래퍼
│   │       ├── PostEditEditor.tsx     # 수정 에디터 (Client)
│   │       ├── PostEditEditorLoader.tsx
│   │       └── CategorySelector.tsx  # 카테고리 선택 드롭다운
│   └── search/ui/SearchBar.tsx
│
├── entities/                     # 도메인 모델
│   └── category/
│       ├── model/types.ts        # Category, CategoryTreeNode
│       └── lib/buildCategoryTree.ts  # 평탄 배열 → 트리 변환
│
├── shared/                       # 공통 인프라
│   ├── api/supabase/
│   │   ├── client.ts             # 브라우저용 Supabase 클라이언트
│   │   ├── server.ts             # 서버용 Supabase 클라이언트 (@supabase/ssr)
│   │   ├── middleware.ts         # 세션 갱신 미들웨어
│   │   └── queries.ts            # React cache() 래핑 공통 쿼리 (getUser, getCategories)
│   ├── ui/                       # 공통 버튼·스켈레톤 컴포넌트
│   └── assets/                   # PNG 아이콘 모음
│
└── middleware.ts                 # Next.js 미들웨어 (세션 갱신)
```

---

## 주요 아키텍처 패턴

### Server / Client 컴포넌트 분리

- **Server Component**에서 Supabase 데이터를 fetch하고 props로 내린다.
- 인터랙션이 필요한 경우만 `"use client"` 선언.
- 예: `SidebarServer.tsx` → `SidebarClient.tsx`, `PostEditorLoader.tsx` (dynamic import)

### Supabase 클라이언트 분리

| 파일                                | 용도                                           |
| ----------------------------------- | ---------------------------------------------- |
| `shared/api/supabase/server.ts`     | Server Component, Route Handler, Server Action |
| `shared/api/supabase/client.ts`     | Client Component                               |
| `shared/api/supabase/middleware.ts` | `src/middleware.ts`에서 세션 갱신              |

### 공통 쿼리 캐싱

`queries.ts`에서 `React.cache()`로 `getUser()`, `getCategories()`를 래핑해 동일 요청 내 중복 fetch를 방지한다.

### Server Actions

인증 관련 뮤테이션(`login`, `signup`, `logout`)은 `features/auth/api/auth.ts`의 Server Actions로 구현한다.

### 카테고리 트리

DB의 `categories` 테이블은 `parent_id`를 가진 자기참조 구조.
`buildCategoryTree()`로 평탄 배열 → 중첩 트리로 변환해 사이드바에서 렌더링한다.

---

## 라우트 목록

| 경로              | 설명                                              |
| ----------------- | ------------------------------------------------- |
| `/`               | 홈 (최근 포스트)                                  |
| `/posts`          | 전체 포스트 목록 (`?category=<id>` 필터 지원)     |
| `/post/[id]`      | 포스트 상세                                       |
| `/post/[id]/edit` | 포스트 수정 (인증 필요)                           |
| `/post/write`     | 새 포스트 작성 (인증 필요)                        |
| `/drafts`         | 임시저장 목록 (인증 필요)                         |
| `/login`          | 로그인                                            |
| `/signup`         | 회원가입                                          |
| `/profile`        | 프로필                                            |
| `/sitemap.xml`    | XML 사이트맵 (`/sitemap` Route Handler로 rewrite) |
| `/robots.txt`     | robots 파일                                       |

---

## 데이터베이스 스키마 (추론)

**`post`**

- `id`, `title`, `content`, `created_at`, `published_at`, `category` (FK→categories), `is_draft`

**`categories`**

- `id`, `name`, `parent_id` (자기참조 nullable)

---

## 스타일링 규칙

- CSS Modules (`*.module.css`) 사용 — Tailwind 없음.
- 각 컴포넌트와 같은 디렉터리에 `*.module.css` 파일을 둔다.
- 전역 스타일은 `src/app/globals.css`.

---

## 경로 별칭

`tsconfig.json`에 `@/*` → `./src/*` 설정.

```ts
import { Header } from "@/widgets/header/ui";
import { createClient } from "@/shared/api/supabase/server";
```

---

## 특이사항

- **sitemap**: 점(`.`)이 포함된 폴더명 문제로 `next.config.ts`의 `rewrites`를 통해 `/sitemap.xml` → `/sitemap` (Route Handler)로 우회한다.
- **Toast UI 에디터**: `legacy-peer-deps=true` 없이는 설치 불가. 이미지 업로드 시 Supabase Storage `post-image` 버킷에 업로드 후 공개 URL을 반환한다.
- **Next.js 15+ async params**: 동적 라우트의 `params`는 `Promise<{ id: string }>`이므로 반드시 `await params`로 접근한다.
- **인증**: 로그인한 사용자만 포스트 작성/수정/삭제 UI가 노출된다. 미들웨어에서 세션을 갱신하므로 별도 route guard 코드는 없다.
- **Toast UI 3.x 마크다운 에디터는 ProseMirror 기반** — CodeMirror가 아니므로 `.CodeMirror` DOM 접근 불가.

---

## 이미지 크기 및 정렬 규칙

### 에디터 (PostEditor / PostEditEditor)
에디터 상단 `imageToolbar`에서 이미지 크기(%)를 설정한다.

```
![image](https://...supabase.co/.../image.png#75)
```

- 100%이면 프래그먼트 없이 삽입 (`![image](url)`)
- 범위: 10~100%, 기본값 100%
- `imageSizeRef`(useRef)로 최신 크기 유지 → `addImageBlobHook` 클로저에서 사용
- 입력창은 string state(`imageSizeInput`)로 관리해 중간값 입력 허용, `onBlur`에서 클램핑
- **커서가 이미지 라인에 있을 때** 개별 크기 조절:
  - `editorInstance.getSelection()` 공개 API 사용 — 반환값 `[[line, ch], [line, ch]]` **(1-indexed)**
  - `caretChange` 이벤트 + `mouseup` 이벤트(`setTimeout(0)`)로 감지
  - `replaceSelection(text, [line, startCh], [line, endCh])`로 해당 이미지 구문만 교체
  - ch 계산: `startCh = imgMatch.index + 1`, `endCh = imgMatch.index + length + 1`
  - `activeImageLineRef`(useRef)로 핸들러 클로저에서 stale state 방지
- 툴바 힌트: "선택된 이미지" / "다음 삽입 기본값"

### 렌더러 (MarkdownContent)
`img` 컴포넌트에서 `src`의 `#숫자` 프래그먼트를 파싱해 `width: X%` 인라인 스타일 적용.
`.img` CSS 클래스에 `display: block; margin: 1em auto`로 항상 가운데 정렬.
