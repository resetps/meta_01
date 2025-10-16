-- =====================================================
-- Migration: revision_type_id를 TEXT로 변경
-- =====================================================
-- 이 스크립트는 revision_type_id 칼럼을 INTEGER에서 TEXT로 변경합니다.
-- 기존 데이터가 있다면, 숫자를 유지하거나 제목으로 매핑할 수 있습니다.

-- 1단계: 의존하는 뷰들을 먼저 삭제
DROP VIEW IF EXISTS recent_leads CASCADE;
DROP VIEW IF EXISTS leads_by_type CASCADE;
DROP VIEW IF EXISTS leads_by_utm_source CASCADE;

-- 2단계: CHECK 제약 조건 제거
ALTER TABLE public.leads 
  DROP CONSTRAINT IF EXISTS leads_revision_type_id_check;

-- 3단계: 칼럼 타입 변경
ALTER TABLE public.leads 
  ALTER COLUMN revision_type_id TYPE TEXT;

-- 4단계: 칼럼 이름 변경 (선택 사항 - 의미를 더 명확하게)
-- ALTER TABLE public.leads 
--   RENAME COLUMN revision_type_id TO revision_type_title;

-- 5단계: 인덱스 재생성
DROP INDEX IF EXISTS idx_leads_revision_type;
CREATE INDEX IF NOT EXISTS idx_leads_revision_type 
  ON public.leads(revision_type_id);

-- 6단계: 칼럼 설명 업데이트
COMMENT ON COLUMN public.leads.revision_type_id IS '선택한 재수술 유형 제목 (예: "코끝이 들리거나 짧아진 경우(구축)")';

-- 7단계: 뷰들을 다시 생성
-- 최근 24시간 리드
CREATE OR REPLACE VIEW recent_leads AS
SELECT *
FROM public.leads
WHERE created_at > now() - interval '24 hours'
ORDER BY created_at DESC;

-- 유형별 통계 (이제 TEXT 타입으로 그룹화)
CREATE OR REPLACE VIEW leads_by_type AS
SELECT 
  revision_type_id,
  COUNT(*) as total_count,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_count,
  COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_count,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_count
FROM public.leads
GROUP BY revision_type_id
ORDER BY revision_type_id;

-- UTM 소스별 통계
CREATE OR REPLACE VIEW leads_by_utm_source AS
SELECT 
  COALESCE(utm_source, 'direct') as source,
  COUNT(*) as count,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions,
  ROUND(
    COUNT(CASE WHEN status = 'converted' THEN 1 END)::numeric / 
    COUNT(*)::numeric * 100, 
    2
  ) as conversion_rate
FROM public.leads
GROUP BY utm_source
ORDER BY count DESC;

-- =====================================================
-- 기존 데이터 마이그레이션 (기존 데이터가 있는 경우)
-- =====================================================
-- ⚠️ 기존에 숫자로 저장된 데이터가 있다면, 
-- 3단계 "칼럼 타입 변경" 대신 아래 방법을 사용하세요:

-- 방법 1: 임시 칼럼을 사용한 안전한 마이그레이션
/*
-- 뷰 삭제는 위에서 이미 했음
-- 임시 칼럼 추가
ALTER TABLE public.leads ADD COLUMN revision_type_title TEXT;

-- 숫자를 제목으로 매핑
UPDATE public.leads SET revision_type_title = 
  CASE revision_type_id
    WHEN 1 THEN '코끝이 들리거나 짧아진 경우(구축)'
    WHEN 2 THEN '코끝이 떨어진 경우'
    WHEN 3 THEN '보형물이 휘어 보이는 경우'
    WHEN 4 THEN '보형물이 비치는 경우'
    WHEN 5 THEN '보형물이 움직이는 경우'
    WHEN 6 THEN '코끝이 찝혀 보이는 경우'
    WHEN 7 THEN '콧구멍이 비대칭인 경우'
    WHEN 8 THEN '복코 재교정이 필요한 경우'
    WHEN 9 THEN '매부리가 남은 경우'
    ELSE '기타'
  END;

-- 기존 칼럼 삭제
ALTER TABLE public.leads DROP COLUMN revision_type_id;

-- 새 칼럼 이름 변경
ALTER TABLE public.leads RENAME COLUMN revision_type_title TO revision_type_id;

-- NOT NULL 제약 조건 추가
ALTER TABLE public.leads ALTER COLUMN revision_type_id SET NOT NULL;

-- 인덱스와 뷰는 위의 5-7단계에서 생성됨
*/

-- =====================================================
-- 롤백 스크립트 (문제 발생 시)
-- =====================================================
-- 다시 INTEGER로 되돌리려면:
/*
-- 1. 뷰 삭제
DROP VIEW IF EXISTS recent_leads CASCADE;
DROP VIEW IF EXISTS leads_by_type CASCADE;
DROP VIEW IF EXISTS leads_by_utm_source CASCADE;

-- 2. 칼럼 타입을 다시 INTEGER로 변경
ALTER TABLE public.leads 
  ALTER COLUMN revision_type_id TYPE INTEGER 
  USING revision_type_id::INTEGER;

-- 3. CHECK 제약 조건 추가
ALTER TABLE public.leads 
  ADD CONSTRAINT leads_revision_type_id_check 
  CHECK (revision_type_id >= 1 AND revision_type_id <= 9);

-- 4. 인덱스 재생성
DROP INDEX IF EXISTS idx_leads_revision_type;
CREATE INDEX IF NOT EXISTS idx_leads_revision_type 
  ON public.leads(revision_type_id);

-- 5. 뷰 재생성 (원래 INTEGER 버전으로)
CREATE OR REPLACE VIEW recent_leads AS
SELECT * FROM public.leads
WHERE created_at > now() - interval '24 hours'
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW leads_by_type AS
SELECT 
  revision_type_id,
  COUNT(*) as total_count,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_count,
  COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_count,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_count
FROM public.leads
GROUP BY revision_type_id
ORDER BY revision_type_id;

CREATE OR REPLACE VIEW leads_by_utm_source AS
SELECT 
  COALESCE(utm_source, 'direct') as source,
  COUNT(*) as count,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions,
  ROUND(
    COUNT(CASE WHEN status = 'converted' THEN 1 END)::numeric / 
    COUNT(*)::numeric * 100, 
    2
  ) as conversion_rate
FROM public.leads
GROUP BY utm_source
ORDER BY count DESC;
*/

