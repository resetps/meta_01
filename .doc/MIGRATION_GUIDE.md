# 데이터베이스 마이그레이션 가이드

## revision_type_id를 TEXT로 변경

### 변경 사항
`revision_type_id` 칼럼을 **INTEGER**(1-9)에서 **TEXT**(재수술 유형 제목)로 변경합니다.

**이전:**
```
revision_type_id: 1  (숫자)
```

**이후:**
```
revision_type_id: "코끝이 들리거나 짧아진 경우(구축)"  (제목 텍스트)
```

### 마이그레이션 실행 방법

#### 1. Supabase SQL Editor에서 실행

1. [Supabase Dashboard](https://supabase.com/dashboard) 로그인
2. 프로젝트 선택
3. 좌측 메뉴에서 **SQL Editor** 클릭
4. **New query** 클릭
5. `.doc/migration-revision-type-to-text.sql` 파일 내용을 복사하여 붙여넣기
6. **Run** 버튼 클릭

⚠️ **중요**: 스크립트는 자동으로 뷰(View)를 삭제하고 재생성합니다.

#### 2. 기존 데이터가 있는 경우

만약 이미 테이블에 데이터가 있다면, 마이그레이션 스크립트의 "기존 데이터 마이그레이션" 섹션 주석을 해제하고 실행하세요.

```sql
-- 숫자를 제목으로 자동 변환
UPDATE public.leads SET revision_type_id = 
  CASE revision_type_id::INTEGER
    WHEN 1 THEN '코끝이 들리거나 짧아진 경우(구축)'
    WHEN 2 THEN '코끝이 떨어진 경우'
    -- ... 나머지 케이스
  END;
```

#### 3. 테이블이 아직 생성되지 않은 경우

`.doc/database-schema.sql` 파일을 그대로 실행하면 됩니다. 이미 업데이트되어 있습니다.

### 롤백 방법

문제가 발생하면 다시 INTEGER로 되돌릴 수 있습니다:

```sql
ALTER TABLE public.leads 
  ALTER COLUMN revision_type_id TYPE INTEGER 
  USING revision_type_id::INTEGER;

ALTER TABLE public.leads 
  ADD CONSTRAINT leads_revision_type_id_check 
  CHECK (revision_type_id >= 1 AND revision_type_id <= 9);
```

### 확인 방법

마이그레이션 후 테스트:

1. 랜딩페이지에서 재수술 유형 선택
2. 이름과 연락처 입력 후 제출
3. Supabase Dashboard → Table Editor → leads 테이블 확인
4. `revision_type_id` 칼럼에 제목이 저장되었는지 확인

예상 결과:
```
id: abc-123-def
name: 홍길동
phone: 010-1234-5678
revision_type_id: "코끝이 들리거나 짧아진 경우(구축)"
```

### 일반적인 에러와 해결 방법

#### 에러: "cannot alter type of a column used by a view or rule"

```
ERROR: cannot alter type of a column used by a view or rule
DETAIL: rule _RETURN on view recent_leads depends on column "revision_type_id"
```

**원인**: `revision_type_id` 칼럼을 사용하는 뷰(View)가 있어서 타입 변경이 불가능합니다.

**해결**: 업데이트된 마이그레이션 스크립트를 사용하세요. 스크립트가 자동으로:
1. 뷰들을 먼저 삭제
2. 칼럼 타입 변경
3. 뷰들을 다시 생성

### 주의사항

⚠️ **프로덕션 환경에서는 반드시 백업 후 실행하세요!**

1. 마이그레이션 실행 전 데이터 백업
2. 테스트 환경에서 먼저 실행
3. 프로덕션에서 실행
4. 애플리케이션 배포

### 영향받는 파일

이 변경으로 수정된 파일:
- `app/actions/submit-lead.ts` - 제목을 저장하도록 수정
- `components/LeadForm.tsx` - 제목을 찾아서 전달
- `.doc/database-schema.sql` - 스키마 업데이트
- `.doc/migration-revision-type-to-text.sql` - 마이그레이션 스크립트

### 이점

✅ **데이터 가독성 향상**: 관리자가 테이블을 볼 때 바로 무슨 유형인지 확인 가능  
✅ **별도 조인 불필요**: 숫자를 제목으로 변환하는 로직이 필요 없음  
✅ **유연성**: 나중에 유형이 추가되어도 코드 수정 없이 대응 가능

