import { createClient } from '@supabase/supabase-js';

// 서버 사이드에서 사용하는 Supabase 클라이언트
// Service Role Key는 모든 권한을 가지므로 서버에서만 사용

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Supabase 서버 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'
  );
}

// Service Role Key를 사용한 클라이언트 (RLS 우회, 관리자 권한)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});


