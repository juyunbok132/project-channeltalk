# project-channeltalk

> MD 파일 하나면 웹사이트에 AI 챗봇 완성. 오픈소스.

## Install

```bash
npm install @패키지명
npx @패키지명 init
```

`init` 실행 시 생성되는 파일:
- `chatbot/knowledge.md` — FAQ 작성 (이것만 수정하면 답변 변경)
- `chatbot/config.yaml` — 봇 설정 (이름, 아바타, CTA, 비용 한도)
- `app/api/chat/route.ts` — API 엔드포인트
- `app/admin/chats/page.tsx` — 관리자 대시보드

## Setup

```bash
# 1. 환경변수 설정
echo "ANTHROPIC_API_KEY=sk-ant-xxx" >> .env.local
echo "ADMIN_PASSWORD=your-password" >> .env.local

# 2. knowledge.md에 FAQ 작성

# 3. config.yaml에서 봇 이름, CTA URL 등 설정

# 4. layout.tsx에 위젯 추가
```

```tsx
// app/layout.tsx
import { ChatWidget } from '@패키지명/react'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
```

```
npm run dev → localhost:3000 에서 챗봇 확인
/admin/chats → 관리자 대시보드
```

## Features

- 📝 **MD 기반 지식** — 코드 수정 없이 답변 변경
- 🔒 **Prompt injection 방어** — 다층 보안
- 💬 **프리셋 + 후속 질문** — 핑퐁 대화 구조
- 🎯 **자동 퍼널** — Get Started / 이메일로 자연 유도
- 📊 **관리자 대시보드** — 고객별 대화, 비답변 추적
- 💰 **비용 안전장치** — 일별/월별 캡, kill switch
- 🌍 **다국어** — 영어/한국어 자동 감지
- 🎨 **커스텀** — 이름, 아바타, 톤, 브랜드 컬러

## How It Works

```
사용자 → ChatWidget → /api/chat → Anthropic API (Haiku 4.5)
                                      ↑
                                 knowledge.md (prompt caching)
```

1. 사용자가 질문 입력
2. knowledge.md 내용이 system prompt로 전달 (prompt caching으로 비용 90% 절감)
3. Haiku 4.5가 MD 내용 기반으로만 답변
4. MD에 없으면 → "담당자에게 연결" 폴백
5. 대화 N회 후 자동으로 이메일/CTA로 전환

## Cost

Haiku 4.5 + prompt caching 기준:

| 일 상담 수 | 월 비용 |
|---|---|
| 5건 | ~$2~3 |
| 15건 | ~$6~10 |
| 30건 | ~$15~20 |

config.yaml에서 월 $30 캡 설정 → 초과 불가능.

## knowledge.md 작성법

```markdown
## Q: 가격이 얼마인가요?
우리 서비스는 월 $49부터 시작합니다.
기본 플랜에는 A, B, C가 포함됩니다.

## Q: How do I sign up?
Visit our website and click Get Started.
The process takes about 5 minutes.
```

- `## Q:` 로 시작하는 줄이 질문
- 그 아래 내용이 답변
- 영어/한국어 혼용 가능 (자동 감지)
- 공개 가능한 정보만 작성 (내부 원가 등 미포함)

## config.yaml 주요 설정

```yaml
bot:
  name: "My Assistant"
  avatar: "/avatar.png"
  greeting:
    en: "Hi! How can I help?"
    ko: "안녕하세요! 무엇을 도와드릴까요?"

cta:
  primary:
    text: { en: "Get started →", ko: "시작하기 →" }
    url: "/get-started"

limits:
  max_messages_per_session: 10
  soft_cta_after: 3

cost_safety:
  monthly_budget_usd: 30
  daily_budget_usd: 1.00
```

## Admin Dashboard

`/admin/chats` 접속 (ADMIN_PASSWORD 필요):
- 고객별 대화 목록 + 상세 열람
- 언어/전환 유형/날짜 필터
- 비답변 질문 모아보기 → knowledge.md 보강에 활용
- 일별/월별 API 비용 현황

## Tech Stack

- Next.js (App Router)
- Vercel AI SDK + Anthropic API
- React + shadcn/ui + Tailwind CSS
- Vercel KV (세션 저장)
- TypeScript

## For Claude Code

이 프로젝트를 Claude Code에서 구현할 때:

1. **`PLAN.md` 먼저 읽기** — 전체 설계 (아키텍처, 보안, 비용, Phase 구분)
2. **Phase 1 항목부터 순서대로** 구현
3. **핵심 라이브러리**: `npm install ai @ai-sdk/anthropic js-yaml`
4. **shadcn/ui 초기화**: `npx shadcn@latest init`

### 구현 순서 권장

```
1. config.yaml 파싱 + 타입 정의
2. knowledge.md → system prompt 변환
3. /api/chat/route.ts (Vercel AI SDK + prompt caching)
4. input-filter.ts (보안)
5. cost-tracker.ts (비용 안전장치)
6. ChatWidget 컴포넌트 (위젯 UI)
7. 세션 저장 (Vercel KV)
8. 관리자 대시보드
9. init CLI
```

## License

MIT
