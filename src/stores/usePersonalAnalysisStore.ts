// src/stores/usePersonalAnalysisStore.ts
import { create } from 'zustand'
import { PersonalAnalysisResponse } from '@/lib/api'

interface PersonalAnalysisState {
  data: PersonalAnalysisResponse | null
  setData: (data: PersonalAnalysisResponse) => void
  // (option) 에러나 로딩도 같이 관리 가능
}

export const usePersonalAnalysisStore = create<PersonalAnalysisState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}))
