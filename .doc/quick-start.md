# 🚀 빠른 시작 가이드

Supabase 연동을 위한 빠른 시작 가이드입니다.

## 📋 체크리스트

### 1단계: 환경 변수 설정 ⚠️ **필수**

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```bash
# 1. 프로젝트 루트에서 파일 생성
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# 또는 VSCode에서 직접 생성
```

`.env.local` 파일 내용:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**키 찾기:**
1. [Supabase Dashboard](https://app.supabase.com) → 프로젝트 선택
2. Settings → API
3. Project URL, anon key, service_role key 복사

---

### 2단계: Database 테이블 생성

1. Supabase Dashboard → **SQL Editor**
2. `.doc/database-schema.sql` 파일 내용 전체 복사
3. SQL Editor에 붙여넣기
4. "Run" 클릭

✅ `leads` 테이블이 생성되었는지 확인: Database → Tables

---

### 3단계: Storage 버킷 생성

1. Supabase Dashboard → **Storage**
2. "Create a new bucket" 클릭
3. 버킷 정보:
   - Name: `landing-images`
   - Public bucket: ✅ 체크
4. "Create bucket" 클릭

---

### 4단계: 이미지 업로드 (선택 사항)

썸네일 이미지 9개 + 전후 비교 이미지 4개 업로드:

**필수 파일명:**
- `1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`, `5.jpg`, `6.jpg`, `7.jpg`, `8.jpg`, `9.jpg`
- `1-b-a.png`, `3-b-a.png`, `8-b-a.png`, `9-b-a.png`

Storage → `landing-images` 버킷 → Upload file

⚠️ 이미지 없이도 테스트 가능 (placeholder 표시됨)

---

### 5단계: 개발 서버 재시작

환경 변수 변경 후 반드시 재시작:

```bash
# 기존 서버 종료 (Ctrl+C)
# 재시작
cmd /c npm run dev
```

---

## ✅ 테스트

1. http://localhost:3000 접속
2. 재수술 유형 선택
3. 폼 작성 및 제출
4. Supabase Dashboard → Database → leads 테이블에서 데이터 확인

---

## 🐛 문제 해결

### 환경 변수가 undefined

```bash
# 1. .env.local 파일이 프로젝트 루트에 있는지 확인
# 2. 개발 서버 재시작
cmd /c npm run dev
```

### 이미지가 안 보임

환경 변수 없으면 placeholder 표시 (정상)
Supabase 설정 완료 후에만 실제 이미지 표시

### 폼 제출 실패

1. leads 테이블이 생성되었는지 확인
2. 환경 변수가 올바른지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

---

## 📚 상세 문서

- [전체 설정 가이드](.doc/supabase-setup.md)
- [Database Schema](.doc/database-schema.sql)
- [PRD 문서](.doc/prd.md)


