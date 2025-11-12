# 🔧 이미지 로딩 문제 해결 가이드

## ✅ 완료된 수정 사항

### 1. 이미지 코드 활성화
- `components/RevisionTypeGrid.tsx`: 주석 해제 및 조건부 렌더링 추가
- `components/BeforeAfterSlider.tsx`: 주석 해제 및 조건부 렌더링 추가

### 2. Next.js 이미지 최적화 설정
- `next.config.js`: Supabase Storage URL을 허용하도록 설정 추가

### 3. 디버깅 도구 추가
- `app/test-env/page.tsx`: 환경 변수 및 이미지 로딩 테스트 페이지

---

## 🔍 문제 진단 단계

### 1단계: 테스트 페이지 접속

개발 서버를 재시작한 후:

```bash
# 서버 종료 (Ctrl+C)
cmd /c npm run dev
```

브라우저에서 접속:
```
http://localhost:3000/test-env
```

이 페이지에서 확인할 수 있는 것:
- ✅ 환경 변수가 올바르게 로드되었는지
- ✅ 이미지 URL이 제대로 생성되었는지
- ✅ 실제 이미지가 로드되는지

---

## 📋 체크리스트

### A. 환경 변수 확인

```bash
# .env.local 파일 위치 확인
# 반드시 프로젝트 루트에 있어야 함 (package.json과 같은 위치)
```

**.env.local 파일 내용 예시:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**주의사항:**
- ✅ `NEXT_PUBLIC_` 접두사 필수
- ✅ `=` 앞뒤 공백 없음
- ✅ 따옴표 없음
- ✅ 줄바꿈 없음

### B. Supabase Storage 확인

1. **버킷 존재 확인**
   - Supabase Dashboard → Storage
   - `landing-images` 버킷이 있는지 확인

2. **버킷 Public 설정**
   - 버킷 선택 → Configuration
   - "Public bucket" 체크 확인

3. **이미지 업로드 확인**
   - 버킷 내부에 이미지 파일이 있는지 확인
   - 파일명: `1.jpg`, `2.jpg`, ..., `9.jpg`
   - 전후사진: `1-b-a.png`, `3-b-a.png`, `8-b-a.png`, `9-b-a.png`

4. **이미지 URL 직접 테스트**
   ```
   https://your-project.supabase.co/storage/v1/object/public/landing-images/1.jpg
   ```
   브라우저 주소창에 붙여넣고 이미지가 보이는지 확인

### C. 개발 서버 재시작

환경 변수 변경 시 **반드시** 재시작:

```bash
# 1. 현재 서버 종료 (Ctrl+C)
# 2. 재시작
cmd /c npm run dev
```

---

## 🐛 일반적인 문제와 해결

### 문제 1: 환경 변수가 undefined

**증상:**
- 브라우저 콘솔에 "Supabase 환경 변수가 설정되지 않았습니다" 에러
- test-env 페이지에서 환경 변수 ❌ 표시

**해결:**
```bash
# 1. .env.local 파일 위치 확인
ls .env.local  # 또는 dir .env.local

# 2. 파일 내용 확인
cat .env.local  # 또는 type .env.local

# 3. 개발 서버 재시작 (필수!)
cmd /c npm run dev
```

### 문제 2: 이미지 404 에러

**증상:**
- 브라우저 콘솔에 404 에러
- test-env에서 이미지 깨짐 표시

**해결:**
1. Supabase Storage에 이미지가 실제로 업로드되었는지 확인
2. 파일명이 정확한지 확인 (대소문자 구분!)
3. 버킷이 public인지 확인

### 문제 3: CORS 에러

**증상:**
- 브라우저 콘솔에 "Access to fetch at ... has been blocked by CORS policy"

**해결:**
1. Supabase Dashboard → Storage → `landing-images` 버킷
2. Configuration → "Public bucket" 체크
3. Policies 탭에서 public 접근 정책 확인

### 문제 4: Next.js 이미지 최적화 에러

**증상:**
- "Invalid src prop ... hostname is not configured"

**해결:**
이미 `next.config.js`에 설정되어 있지만, 확인:

```javascript
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}
```

### 문제 5: 이미지 URL은 있지만 비어있음

**증상:**
- test-env에서 URL은 표시되지만 이미지가 안 보임
- URL이 `https://undefined/storage/...` 형태

**해결:**
환경 변수에 `https://`를 포함했는지 확인:
```env
# ✅ 올바름
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# ❌ 잘못됨
NEXT_PUBLIC_SUPABASE_URL=xxxxx.supabase.co
```

---

## 🧪 단계별 테스트

### 1. 환경 변수 테스트

```bash
# 브라우저 콘솔(F12)에서 실행
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

예상 출력: `https://xxxxx.supabase.co`

### 2. 이미지 URL 테스트

test-env 페이지에서 생성된 URL 복사 → 브라우저 새 탭에서 열기
→ 이미지가 직접 보여야 함

### 3. Storage 직접 테스트

Supabase Dashboard에서:
1. Storage → landing-images → 이미지 클릭
2. "Copy URL" 클릭
3. 브라우저에서 열어보기

---

## 📊 디버깅 로그 확인

브라우저 콘솔(F12)에서 확인:

```javascript
// data/revisionTypes.ts에서 자동 로그
✅ 이미지 로드 성공: 1
✅ 이미지 로드 성공: 2
...

// 또는 에러
❌ 이미지 로드 실패: 1 https://...
```

---

## 🚀 빠른 해결 체크리스트

한 번에 확인하세요:

- [ ] `.env.local` 파일이 프로젝트 루트에 있다
- [ ] `NEXT_PUBLIC_SUPABASE_URL`에 `https://` 포함
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 값이 정확함
- [ ] 개발 서버를 재시작했다
- [ ] Supabase Storage에 `landing-images` 버킷이 있다
- [ ] 버킷이 public으로 설정되어 있다
- [ ] 이미지 파일이 실제로 업로드되어 있다
- [ ] 이미지 URL을 브라우저에서 직접 열어봤다

모든 항목이 체크되면 이미지가 정상적으로 로드되어야 합니다!

---

## 💡 추가 도움

여전히 문제가 있다면:

1. **test-env 페이지 스크린샷** 공유
2. **브라우저 콘솔 에러 메시지** 복사
3. **.env.local 파일 내용** (키 값은 가리고 형식만)
4. **Supabase Storage 스크린샷**

이 정보로 정확한 진단이 가능합니다.












