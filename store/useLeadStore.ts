import { create } from 'zustand';

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

interface LeadState {
  selectedTypeId: number | null;
  isFormSubmitted: boolean;
  submittedName: string | null; // 제출된 사용자 이름
  utmParams: UTMParams;
  setSelectedTypeId: (id: number) => void;
  setFormSubmitted: (submitted: boolean) => void;
  setSubmittedName: (name: string) => void; // 이름 저장 함수
  setUTMParams: (params: UTMParams) => void;
  reset: () => void;
}

export const useLeadStore = create<LeadState>((set) => ({
  selectedTypeId: null,
  isFormSubmitted: false,
  submittedName: null,
  utmParams: {},
  setSelectedTypeId: (id) => set({ selectedTypeId: id }),
  setFormSubmitted: (submitted) => set({ isFormSubmitted: submitted }),
  setSubmittedName: (name) => set({ submittedName: name }),
  setUTMParams: (params) => set({ utmParams: params }),
  reset: () => set({ selectedTypeId: null, isFormSubmitted: false, submittedName: null, utmParams: {} }),
}));


