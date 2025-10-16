// 환경 변수 디버깅 유틸리티
export function checkEnvironment() {
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('=== 환경 변수 체크 ===');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', hasSupabaseUrl ? '✅ 설정됨' : '❌ 없음');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', hasSupabaseKey ? '✅ 설정됨' : '❌ 없음');
  
  if (hasSupabaseUrl) {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  }
  
  return hasSupabaseUrl && hasSupabaseKey;
}


