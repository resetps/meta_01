# Supabase 설정 가이드

이 문서는 코 재수술 랜딩페이지의 Supabase 연동을 위한 완전한 설정 가이드입니다.

## 📋 목차

1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [Database 설정](#3-database-설정)
4. [Storage 설정](#4-storage-설정)
5. [이미지 업로드](#5-이미지-업로드)
6. [테스트](#6-테스트)

---

## 1. Supabase 프로젝트 생성

### 1-1. 계정 생성 및 로그인

1. [Supabase](https://supabase.com) 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인

### 1-2. 새 프로젝트 생성

1. "New Project" 클릭
2. 프로젝트 정보 입력:
   - **Name**: `meta-landing` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수!)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 사용자 대상)
   - **Pricing Plan**: Free (개발용) 또는 Pro (프로덕션용)
3. "Create new project" 클릭
4. 프로젝트 생성 대기 (약 2-3분 소요)

---

## 2. 환경 변수 설정

### 2-1. API 키 확인

1. Supabase 대시보드에서 프로젝트 선택
2. 좌측 메뉴에서 **Settings** → **API** 클릭
3. 아래 정보 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon/public key** (클라이언트용)
   - **service_role key** (서버용, 절대 공개 금지!)

### 2-2. .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# 또는 직접 생성
```

`.env.local` 파일 내용:

```env
# Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Supabase Anon Key (클라이언트용)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...

# Supabase Service Role Key (서버용, 절대 노출 금지!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
```

⚠️ **보안 주의사항:**
- `.env.local`은 절대 Git에 커밋하지 마세요 (`.gitignore`에 포함됨)
- `SUPABASE_SERVICE_ROLE_KEY`는 서버에서만 사용
- 배포 시 Vercel 환경 변수에 동일하게 설정

---

## 3. Database 설정

### 3-1. leads 테이블 생성

1. Supabase 대시보드 → **SQL Editor** 메뉴
2. "New query" 클릭
3. 아래 SQL 실행:

```sql
-- leads 테이블 생성
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- 사용자 정보
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- 선택한 재수술 유형
  revision_type_id INTEGER NOT NULL,
  
  -- 메타 정보
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  
  -- 상태 관리
  status VARCHAR(50) DEFAULT 'new',
  notes TEXT,
  
  -- 인덱스
  CONSTRAINT leads_pkey PRIMARY KEY (id)
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_revision_type ON public.leads(revision_type_id);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 INSERT 가능 (리드 수집용)
CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 정책: 인증된 사용자만 SELECT 가능 (관리자용)
CREATE POLICY "Authenticated users can view leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- 정책: 인증된 사용자만 UPDATE 가능 (상태 변경용)
CREATE POLICY "Authenticated users can update leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 코멘트 추가
COMMENT ON TABLE public.leads IS '코 재수술 상담 리드 데이터';
COMMENT ON COLUMN public.leads.name IS '고객 이름';
COMMENT ON COLUMN public.leads.phone IS '연락처';
COMMENT ON COLUMN public.leads.revision_type_id IS '선택한 재수술 유형 (1-9)';
COMMENT ON COLUMN public.leads.status IS '리드 상태: new, contacted, converted, archived';
```

4. "Run" 버튼 클릭하여 실행
5. "Success" 메시지 확인

### 3-2. 테이블 확인

1. 좌측 메뉴 **Database** → **Tables** 클릭
2. `leads` 테이블이 생성되었는지 확인
3. 컬럼 구조 확인

---

## 4. Storage 설정

### 4-1. landing-images 버킷 생성

1. 좌측 메뉴 **Storage** 클릭
2. "Create a new bucket" 클릭
3. 버킷 정보 입력:
   - **Name**: `landing-images`
   - **Public bucket**: ✅ 체크 (이미지를 공개적으로 접근 가능하게)
4. "Create bucket" 클릭

### 4-2. 버킷 정책 설정 (public 접근)

버킷이 public으로 설정되었는지 확인:

1. `landing-images` 버킷 클릭
2. "Policies" 탭 클릭
3. Public 접근이 활성화되어 있는지 확인

또는 SQL로 정책 추가:

```sql
-- Storage 정책: 누구나 landing-images 읽기 가능
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'landing-images');
```

---

## 5. 이미지 업로드

### 5-1. 필요한 이미지 목록

**썸네일 이미지 (9개):**
- `1.jpg` - 코끝이 들리거나 짧아진 경우
- `2.jpg` - 코끝이 떨어진 경우
- `3.jpg` - 보형물이 휘어 보이는 경우
- `4.jpg` - 보형물이 비치는 경우
- `5.jpg` - 보형물이 움직이는 경우
- `6.jpg` - 코끝이 찝혀 보이는 경우
- `7.jpg` - 콧구멍이 비대칭인 경우
- `8.jpg` - 복코 재교정이 필요한 경우
- `9.jpg` - 매부리가 남은 경우

**전후 비교 이미지 (4개):**
- `1-b-a.png` - 코끝 구축 전후
- `3-b-a.png` - 보형물 휘어짐 전후
- `8-b-a.png` - 복코 재교정 전후
- `9-b-a.png` - 매부리 제거 전후

### 5-2. 이미지 업로드 방법

**방법 1: Supabase Dashboard 사용**

1. Storage → `landing-images` 버킷 선택
2. "Upload file" 클릭
3. 이미지 파일 선택 (또는 드래그 앤 드롭)
4. 파일명이 정확한지 확인 (`1.jpg`, `1-b-a.png` 등)
5. "Upload" 클릭

**방법 2: Supabase CLI 사용 (대량 업로드)**

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 이미지 업로드 (로컬 images 폴더에서)
supabase storage cp ./images/1.jpg supabase://landing-images/1.jpg
# ... 반복
```

### 5-3. 이미지 URL 확인

업로드 후 URL 형식:
```
https://your-project-ref.supabase.co/storage/v1/object/public/landing-images/1.jpg
```

브라우저에서 열어 확인해보세요.

---

## 6. 테스트

### 6-1. 개발 서버 재시작

환경 변수 변경 후 개발 서버 재시작:

```bash
# 기존 서버 종료 (Ctrl+C)
# 재시작
cmd /c npm run dev
```

### 6-2. 이미지 로딩 테스트

1. http://localhost:3000 접속
2. 9개 썸네일 이미지가 표시되는지 확인
3. 유형 선택 시 전후 비교 이미지 표시 확인

### 6-3. 폼 제출 테스트

1. 유형 선택
2. 이름, 연락처 입력
3. 동의 체크
4. "무료 상담 신청하기" 클릭
5. Supabase Dashboard → Database → `leads` 테이블에서 데이터 확인

---

## 7. 배포 설정 (Vercel)

### 7-1. Vercel 환경 변수 설정

1. Vercel 프로젝트 → Settings → Environment Variables
2. 다음 변수 추가:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGci...
   ```
3. Production, Preview, Development 모두 체크
4. Save

### 7-2. 재배포

환경 변수 추가 후 자동 재배포되거나 수동 재배포 진행

---

## 8. 모니터링 및 관리

### 8-1. 리드 데이터 확인

Supabase Dashboard → Database → Table Editor → `leads`

### 8-2. SQL로 통계 확인

```sql
-- 전체 리드 수
SELECT COUNT(*) FROM leads;

-- 유형별 리드 수
SELECT revision_type_id, COUNT(*) as count
FROM leads
GROUP BY revision_type_id
ORDER BY count DESC;

-- 최근 리드 (24시간)
SELECT *
FROM leads
WHERE created_at > now() - interval '24 hours'
ORDER BY created_at DESC;

-- 상태별 리드 수
SELECT status, COUNT(*) as count
FROM leads
GROUP BY status;
```

### 8-3. 데이터 내보내기

1. Table Editor에서 `leads` 테이블 선택
2. "Export as CSV" 클릭

---

## 🔒 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] Service Role Key를 클라이언트 코드에서 사용하지 않는가?
- [ ] RLS (Row Level Security)가 활성화되어 있는가?
- [ ] Storage 버킷 권한이 적절하게 설정되어 있는가?
- [ ] 프로덕션 환경 변수가 Vercel에 설정되어 있는가?

---

## 🐛 문제 해결

### 이미지가 로드되지 않을 때

1. Supabase Storage에 이미지가 업로드되었는지 확인
2. 버킷이 public으로 설정되었는지 확인
3. 환경 변수 `NEXT_PUBLIC_SUPABASE_URL`이 올바른지 확인
4. 브라우저 콘솔에서 404 에러 확인

### 폼 제출이 실패할 때

1. 환경 변수가 올바르게 설정되었는지 확인
2. `leads` 테이블이 생성되었는지 확인
3. RLS 정책이 INSERT를 허용하는지 확인
4. 네트워크 탭에서 에러 메시지 확인

### 환경 변수가 undefined일 때

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 개발 서버를 재시작했는지 확인
3. 변수명에 오타가 없는지 확인 (`NEXT_PUBLIC_` 접두사 필수)

---

## 📚 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js 환경 변수](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase Storage 가이드](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)


