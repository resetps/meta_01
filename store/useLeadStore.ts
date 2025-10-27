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
  utmParams: UTMParams;
  setSelectedTypeId: (id: number) => void;
  setFormSubmitted: (submitted: boolean) => void;
  setUTMParams: (params: UTMParams) => void;
  reset: () => void;
}

export const useLeadStore = create<LeadState>((set) => ({
  selectedTypeId: null,
  isFormSubmitted: false,
  utmParams: {},
  setSelectedTypeId: (id) => set({ selectedTypeId: id }),
  setFormSubmitted: (submitted) => set({ isFormSubmitted: submitted }),
  setUTMParams: (params) => set({ utmParams: params }),
  reset: () => set({ selectedTypeId: null, isFormSubmitted: false, utmParams: {} }),
}));


