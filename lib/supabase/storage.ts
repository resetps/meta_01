// Supabase Storage URL 헬퍼 함수

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

/**
 * Supabase Storage의 public 파일 URL을 생성합니다
 * @param bucketName - 버킷 이름 (예: 'landing-images')
 * @param filePath - 파일 경로 (예: '1.jpg')
 * @returns 전체 public URL
 */
export function getPublicUrl(bucketName: string, filePath: string): string {
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.');
    return '';
  }
  
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
}

/**
 * landing-images 버킷의 파일 URL을 생성합니다
 * @param fileName - 파일명 (예: '1.jpg', '1-b-a.png')
 * @returns 전체 public URL
 */
export function getLandingImageUrl(fileName: string): string {
  return getPublicUrl('landing-images', fileName);
}


