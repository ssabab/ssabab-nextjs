import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/** API 토큰 및 유저 정보 형태 */
export interface UserProfile {
  userId: number
  email: string
  username: string
  // TODO : 실제 형태 따라서 변경 
}

/** 인증 상태 전용 스토어 */
export interface AuthStoreState {
  token: string | null
  user: UserProfile | null
  isAuthenticated: boolean

  setToken: (token: string) => void
  clearAuth: () => void
  setUser: (profile: UserProfile) => void
}

/** 인증 스토어 생성 */
export const useAuthStore = create<AuthStoreState>()(
  devtools((set, get) => ({
    token: null,
    user: null,

    get isAuthenticated() {
      return !!get().token
    },

    setToken: (token: string) => set({ token }),
    setUser: (user: UserProfile) => set({ user }),
    clearAuth: () => set({ token: null, user: null }),
  }), { name: 'auth-store' })
)