# 코 재수술 리드 수집 랜딩페이지

Next.js로 구축된 코 재수술 전문 상담 랜딩페이지입니다.

## 📋 프로젝트 개요

광고 클릭 후 랜딩페이지에 도달한 사용자가 자신의 **코 재수술 유형을 선택**하고, 그에 따른 상세 설명 및 전후사진을 확인한 뒤 **이름/연락처를 입력하도록 유도**하는 리드 수집 페이지입니다.

## 🎯 주요 기능

- ✅ **참여형 UI**: 9가지 재수술 유형 중 선택
- ✅ **동적 콘텐츠**: 선택한 유형에 따른 맞춤 정보 제공
- ✅ **부드러운 애니메이션**: Framer Motion으로 구현된 전환 효과
- ✅ **전후사진 비교**: react-compare-slider로 실제 사례 확인
- ✅ **폼 검증**: react-hook-form + zod로 안전한 데이터 수집
- ✅ **상태 관리**: Zustand로 간편한 전역 상태 관리
- ✅ **반응형 디자인**: 모바일 우선 설계

## 🛠 기술 스택

| 항목 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Form | react-hook-form + zod |
| State | Zustand |
| Image Comparison | react-compare-slider |
| Deployment | Vercel (권장) |

## 📁 프로젝트 구조

```
metaLanding/
├── app/
│   ├── globals.css          # 전역 스타일
│   ├── layout.tsx           # 루트 레이아웃 + SEO 메타데이터
│   └── page.tsx             # 메인 페이지
├── components/
│   ├── HeroSection.tsx      # 히어로 섹션
│   ├── RevisionTypeGrid.tsx # 9개 유형 선택 그리드
│   ├── SelectedTypeInfo.tsx # 선택된 유형 정보 표시
│   ├── BeforeAfterSlider.tsx # 전후 비교 슬라이더
│   └── LeadForm.tsx         # 리드 수집 폼
├── data/
│   └── revisionTypes.ts     # 9가지 재수술 유형 데이터
├── store/
│   └── useLeadStore.ts      # Zustand 상태 관리
├── types/
│   └── index.ts             # TypeScript 타입 정의
├── public/                  # 정적 파일
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
# PowerShell 실행 정책 문제가 있는 경우
cmd /c npm run dev

# 또는
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 3. 프로덕션 빌드

```bash
cmd /c npm run build
cmd /c npm run start
```

## 📝 사용 가능한 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행

## 🔧 Supabase 연동 설정

### 빠른 시작 (필수)

**1. 환경 변수 설정**

프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

[Supabase Dashboard](https://app.supabase.com) → Settings → API에서 키 확인

**2. Database 테이블 생성**

Supabase Dashboard → SQL Editor에서 `.doc/database-schema.sql` 실행

**3. Storage 버킷 생성**

Storage → Create bucket → Name: `landing-images` (Public 체크)

**4. 개발 서버 재시작**

```bash
cmd /c npm run dev
```

### 📖 상세 가이드

- [빠른 시작 가이드](.doc/quick-start.md) - 5분 안에 설정
- [전체 설정 가이드](.doc/supabase-setup.md) - 상세한 단계별 설명
- [Database Schema](.doc/database-schema.sql) - SQL 스크립트

## 📊 데이터 구조

9가지 재수술 유형:

1. 코끝이 들리거나 짧아진 경우(구축) - 전후사진 있음
2. 코끝이 떨어진 경우
3. 보형물이 휘어 보이는 경우 - 전후사진 있음
4. 보형물이 비치는 경우
5. 보형물이 움직이는 경우
6. 코끝이 찝혀 보이는 경우
7. 콧구멍이 비대칭인 경우
8. 복코 재교정이 필요한 경우 - 전후사진 있음
9. 매부리가 남은 경우 - 전후사진 있음

각 유형은 `title`, `cause`, `method`, `thumb`, `beforeAfter?(optional)` 속성을 가집니다.

## 🎨 사용자 흐름

1. **Hero 섹션**: 신뢰 강조 + 가치 제안
2. **유형 선택**: 9개 썸네일 중 하나 클릭
3. **정보 확인**: 선택한 유형의 원인 및 수술 방법 표시 (애니메이션)
4. **전후사진**: beforeAfter가 있는 경우 비교 슬라이더 표시
5. **상담 신청**: 이름/연락처 입력 + 개인정보 동의
6. **완료**: 감사 메시지 + 카카오톡/전화 CTA

## 🔒 개인정보 처리

- 수집 항목: 이름, 연락처, 선택 유형
- 수집 목적: 상담 예약 및 연락
- 보관 기간: 상담 완료 후 3개월
- 동의 체크박스 필수

## 📱 반응형 디자인

- **모바일 우선**: 70% 이상의 사용자가 모바일 접속
- **브레이크포인트**: Tailwind CSS 기본 (sm, md, lg, xl)
- **터치 최적화**: 큰 터치 영역, 부드러운 스크롤

## 🚧 TODO (향후 개선사항)

- [ ] Supabase Edge Function 연동 (폼 제출 처리)
- [ ] Turnstile/hCaptcha 봇 방지 추가
- [ ] GA4, GTM, Meta Pixel 통합
- [ ] 로딩 스켈레톤 UI 추가
- [ ] 이미지 최적화 (WebP, 레이지 로딩)
- [ ] A/B 테스트 설정
- [ ] 에러 바운더리 추가

## 📚 참고 문서

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Framer Motion 문서](https://www.framer.com/motion/)
- [react-hook-form 문서](https://react-hook-form.com/)
- [Zustand 문서](https://github.com/pmndrs/zustand)

## 📄 라이선스

이 프로젝트는 PRD 문서(.doc/prd.md)를 기반으로 제작되었습니다.

---

**개발 환경**: Node.js 18+, npm 9+
**권장 배포**: Vercel (Zero-config deployment)
