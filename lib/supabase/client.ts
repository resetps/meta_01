import { createClient } from '@supabase/supabase-js';

// 클라이언트 사이드에서 사용하는 Supabase 클라이언트
// NEXT_PUBLIC_ 접두사가 붙은 환경 변수만 클라이언트에서 접근 가능

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


