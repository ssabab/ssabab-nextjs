import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// ──────────── Types ─────────────────────────────────────────────────

interface User {
  name: string
  email: string
}

interface AuthStoreState {
  clearAuth: () => void
  token: string | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  // 액션
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  login: (token: string, user?: User) => void
  logout: () => void
  initializeAuth: () => void
  checkAuthStatus: () => boolean
}

// ──────────── Utility Functions ─────────────────────────────────────────

const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

const setCookie = (name: string, value: string, minutes: number = 30) => {
  if (typeof document === 'undefined') return
  
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString()
  document.cookie = `${name}=${value}; path=/; SameSite=Lax; expires=${expires}`
}

const removeCookie = (name: string) => {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

// ──────────── Store ─────────────────────────────────────────────────

export const useAuthStore = create<AuthStoreState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // 액션
      setToken: (token) => {
        set({ 
          token,
          isAuthenticated: !!token 
        });
        
        if (token) {
          setCookie('accessToken', token)
        } else {
          removeCookie('accessToken')
        }
      },

      setUser: (user) => set({ user }),

      setLoading: (loading) => set({ isLoading: loading }),

      login: (token, user) => {
        set({ 
          token,
          user,
          isAuthenticated: true,
          isLoading: false
        });
        setCookie('accessToken', token)
      },

      logout: () => {
        set({ 
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        removeCookie('accessToken')
      },

      clearAuth: () => {
        get().logout()
      },

      initializeAuth: () => {
        const token = getCookieValue('accessToken')
        if (token) {
          set({ 
            token,
            isAuthenticated: true
          })
        } else {
          set({ 
            token: null,
            isAuthenticated: false
          })
        }
      },

      checkAuthStatus: () => {
        const token = getCookieValue('accessToken')
        const isAuthenticated = !!token
        
        set({ 
          token,
          isAuthenticated
        })

        return isAuthenticated
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

// ──────────── Hooks ─────────────────────────────────────────────────

// 인증 상태만 간단하게 확인하는 hook
export const useAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  
  return { isAuthenticated, token, user }
};

// token 존재 여부만 확인하는 hook
export const useAuthToken = () => {
  const token = useAuthStore((state) => state.token)
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus)
  
  return { token, hasToken: !!token, checkAuthStatus }
}