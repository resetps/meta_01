-- =====================================================
-- 코 재수술 랜딩페이지 - Database Schema
-- =====================================================

-- leads 테이블: 상담 신청 리드 데이터 저장
CREATE TABLE IF NOT EXISTS public.leads (
  -- 기본 키
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- 사용자 입력 정보
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- 선택한 재수술 유형 (1-9)
  revision_type_id INTEGER NOT NULL CHECK (revision_type_id >= 1 AND revision_type_id <= 9),
  
  -- 트래킹 정보 (선택 사항)
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  
  -- UTM 파라미터 (마케팅 트래킹)
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  
  -- 상태 관리
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'converted', 'archived', 'spam')),
  
  -- 관리자 메모
  notes TEXT,
  assigned_to VARCHAR(100),
  contacted_at TIMESTAMP WITH TIME ZONE,
  
  -- 동의 정보
  consent_marketing BOOLEAN DEFAULT false,
  consent_privacy BOOLEAN DEFAULT true
);

-- =====================================================
-- 인덱스 생성 (성능 최적화)
-- =====================================================

-- 생성일시 인덱스 (최근 리드 조회용)
CREATE INDEX IF NOT EXISTS idx_leads_created_at 
  ON public.leads(created_at DESC);

-- 전화번호 인덱스 (중복 체크, 검색용)
CREATE INDEX IF NOT EXISTS idx_leads_phone 
  ON public.leads(phone);

-- 상태 인덱스 (필터링용)
CREATE INDEX IF NOT EXISTS idx_leads_status 
  ON public.leads(status);

-- 재수술 유형 인덱스 (통계용)
CREATE INDEX IF NOT EXISTS idx_leads_revision_type 
  ON public.leads(revision_type_id);

-- UTM 소스 인덱스 (마케팅 분석용)
CREATE INDEX IF NOT EXISTS idx_leads_utm_source 
  ON public.leads(utm_source) WHERE utm_source IS NOT NULL;

-- =====================================================
-- 트리거: updated_at 자동 갱신
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS) 설정
-- =====================================================

-- RLS 활성화
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 정책 1: 누구나 INSERT 가능 (리드 수집용)
CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 정책 2: 인증된 사용자만 SELECT 가능 (관리자용)
CREATE POLICY "Authenticated users can view leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- 정책 3: 인증된 사용자만 UPDATE 가능 (상태 변경용)
CREATE POLICY "Authenticated users can update leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 정책 4: 인증된 사용자만 DELETE 가능 (스팸 제거용)
CREATE POLICY "Authenticated users can delete leads"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- 테이블 및 컬럼 코멘트
-- =====================================================

COMMENT ON TABLE public.leads IS '코 재수술 상담 리드 데이터';
COMMENT ON COLUMN public.leads.id IS '고유 식별자 (UUID)';
COMMENT ON COLUMN public.leads.created_at IS '리드 생성 일시';
COMMENT ON COLUMN public.leads.updated_at IS '리드 수정 일시';
COMMENT ON COLUMN public.leads.name IS '고객 이름';
COMMENT ON COLUMN public.leads.phone IS '연락처 (010-1234-5678 형식)';
COMMENT ON COLUMN public.leads.revision_type_id IS '선택한 재수술 유형 (1-9)';
COMMENT ON COLUMN public.leads.user_agent IS '사용자 브라우저 정보';
COMMENT ON COLUMN public.leads.ip_address IS '접속 IP 주소';
COMMENT ON COLUMN public.leads.referrer IS '유입 경로 URL';
COMMENT ON COLUMN public.leads.utm_source IS 'UTM 소스 (예: google, facebook)';
COMMENT ON COLUMN public.leads.utm_medium IS 'UTM 매체 (예: cpc, social)';
COMMENT ON COLUMN public.leads.utm_campaign IS 'UTM 캠페인명';
COMMENT ON COLUMN public.leads.status IS '리드 상태: new(신규), contacted(연락완료), scheduled(예약), converted(전환), archived(보관), spam(스팸)';
COMMENT ON COLUMN public.leads.notes IS '관리자 메모';
COMMENT ON COLUMN public.leads.assigned_to IS '담당자';
COMMENT ON COLUMN public.leads.contacted_at IS '최초 연락 일시';
COMMENT ON COLUMN public.leads.consent_marketing IS '마케팅 동의 여부';
COMMENT ON COLUMN public.leads.consent_privacy IS '개인정보 수집 동의 여부';

-- =====================================================
-- 유용한 뷰 (View) 생성
-- =====================================================

-- 최근 24시간 리드
CREATE OR REPLACE VIEW recent_leads AS
SELECT *
FROM public.leads
WHERE created_at > now() - interval '24 hours'
ORDER BY created_at DESC;

-- 유형별 통계
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
-- 샘플 데이터 (개발용, 프로덕션에서는 실행하지 마세요)
-- =====================================================

-- INSERT INTO public.leads (name, phone, revision_type_id, utm_source, utm_medium)
-- VALUES 
--   ('테스트1', '010-1234-5678', 1, 'google', 'cpc'),
--   ('테스트2', '010-2345-6789', 3, 'facebook', 'social'),
--   ('테스트3', '010-3456-7890', 8, 'instagram', 'story');


