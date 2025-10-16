import { create } from 'zustand';

interface LeadState {
  selectedTypeId: number | null;
  isFormSubmitted: boolean;
  setSelectedTypeId: (id: number) => void;
  setFormSubmitted: (submitted: boolean) => void;
  reset: () => void;
}

export const useLeadStore = create<LeadState>((set) => ({
  selectedTypeId: null,
  isFormSubmitted: false,
  setSelectedTypeId: (id) => set({ selectedTypeId: id }),
  setFormSubmitted: (submitted) => set({ isFormSubmitted: submitted }),
  reset: () => set({ selectedTypeId: null, isFormSubmitted: false }),
}));


