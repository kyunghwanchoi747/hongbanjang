# 성남 AI 민심 법정

> 시민 참여형 AI 재판 시뮬레이션 - **시민이 판사다**

AI 검사와 변호인의 치열한 공방을 지켜보고, 시민 배심원으로서 당신의 판결을 내리세요.

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 데이터베이스 초기화
npx prisma db push

# 3. 개발 서버 실행
npm run dev
```

http://localhost:3000 접속

## 주요 기능

### Phase 1: The Docket (데이터 수집)
- 지역 뉴스/민원 데이터 스크래핑 구조
- AI 기반 사건 구조화 (사건명/피고/쟁점/관련법령)

### Phase 2: Trial Engine (AI 법정 공방)
- **검사 에이전트**: 시민 피해 대변, 행정 실패 공격
- **변호인 에이전트**: 현실적 한계 방어, 개선 계획 제시
- **판사 에이전트**: 중립 진행, 투표 유도

### Phase 3: The Grand Hall (시민 인터페이스)
- 드라마 <악마판사> 스타일 다크 UI
- 실시간 찬반 투표 게이지
- 국민 참여 판결 시스템

### Phase 4: The Factory (인프라)
- CITY_CODE 변수로 전국 복제 가능
- SQLite/PostgreSQL 지원

## 전국 복제

```bash
# 부산시 버전 배포
CITY_NAME=부산시 CITY_CODE=busan npm run build
```

## 기술 스택

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma
- **AI**: OpenAI GPT-4 (선택) / 시뮬레이션 모드 (기본)
- **Database**: SQLite (개발) / PostgreSQL (운영)

## 프로젝트 구조

```
ai-court/
├── src/
│   ├── app/          # Next.js 페이지
│   ├── agents/       # AI 에이전트 엔진
│   ├── scrapers/     # 데이터 수집
│   └── lib/          # 유틸리티
├── prisma/           # DB 스키마
└── prompts/          # 에이전트 마스터 프롬프트
```

## 라이선스

MIT
