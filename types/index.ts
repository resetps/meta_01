// 재수술 유형 데이터 타입
export type RevisionType = {
  id: number;
  title: string;
  cause: string;
  method: string;
  thumb: string;
  beforeAfter?: string; // 이미지가 없는 경우 생략
  selfieBefore?: string; // 수술 전 셀카
  selfieAfter?: string; // 수술 후 셀카
  profileImage?: string; // 셀카 당사자 프로필 이미지
};

// 리드 폼 데이터 타입
export type LeadFormData = {
  name: string;
  phone: string;
  revisionTypeId: number;
  consent: boolean;
};


