import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'   // npm install jwt-decode
import { refreshAccessToken } from '@/lib/api'


// ──────────── Types ─────────────────────────────────────────────────

interface User {
  name: string
  email: string
}

interface AuthStoreState {
  clearAuth: () => void
  token: string | null
  refreshToken: string | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAuthInitialized: boolean

  // 액션
  setToken: (token: string | null) => void
  setRefreshToken: (token: string) => void
  clearRefreshToken: () => void
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
      isAuthInitialized: false,
      refreshToken: null,

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
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearRefreshToken: () => set({ refreshToken: null }),

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
        // 쿠키 삭제, 상태 false로
        document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        set({ isAuthenticated: false })
      },

      clearAuth: () => {
        get().logout()
      },

      initialize: async () => {
        try {
          await refreshAccessToken() // 토큰 리프레시
          set({ isAuthenticated: true })
        } catch {
          set({ isAuthenticated: false })
        }
      },

      initializeAuth: () => {
        const token = getCookieValue('accessToken')
        if (token) {
          try {
            const { exp } = jwtDecode<{ exp: number }>(token)
            if (Date.now() < exp * 1000) {
              set({ 
                token,
                isAuthenticated: true,
                isAuthInitialized: true
              })
              return
            }
          } catch (error) {
            console.error('Token decoding error:', error)
          }
        }
        set({ 
          token: null,
          isAuthenticated: false,
          isAuthInitialized: true
        })
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
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  
  return { isAuthenticated, token, user, isAuthInitialized }
};

// token 존재 여부만 확인하는 hook
export const useAuthToken = () => {
  const token = useAuthStore((state) => state.token)
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus)
  
  return { token, hasToken: !!token, checkAuthStatus }
}