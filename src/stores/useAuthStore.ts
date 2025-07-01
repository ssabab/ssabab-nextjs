import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'   // npm install jwt-decode
import api, { refreshAccessToken } from '@/lib/api'


// ──────────── Types ─────────────────────────────────────────────────

interface User {
  username: string
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
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string, nickname: string) => Promise<void>
  handleSocialLogin: (accessToken: string, refreshToken: string) => void
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

      login: async (username, password) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/account/login', { username, password })
          const { accessToken, refreshToken, user } = response.data
          set({
            token: accessToken,
            refreshToken,
            user,
            isAuthenticated: true,
            isLoading: false,
          })
          setCookie('accessToken', accessToken)
          setCookie('refreshToken', refreshToken, 60 * 24 * 7) // 7 days
        } catch (error) {
          set({ isLoading: false })
          console.error("Login failed:", error)
          throw error
        }
      },

      signup: async (username, password, nickname) => {
        set({ isLoading: true });
        try {
          await api.post('/account/signup', { username, password, nickname });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error("Signup failed:", error);
          throw error;
        }
      },

      handleSocialLogin: (accessToken, refreshToken) => {
        try {
          const decoded = jwtDecode<{ sub: string; exp: number }>(accessToken)
          set({
            token: accessToken,
            refreshToken,
            user: { username: decoded.sub },
            isAuthenticated: true,
          })
          setCookie('accessToken', accessToken)
          setCookie('refreshToken', refreshToken, 60 * 24 * 7) // 7 days
        } catch (error) {
          console.error('Social login token handling error:', error)
          get().logout()
        }
      },

      logout: () => {
        removeCookie('accessToken')
        removeCookie('refreshToken')
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        })
      },

      clearAuth: () => {
        get().logout()
      },

      initializeAuth: () => {
        if (get().isAuthInitialized) return;

        const token = getCookieValue('accessToken')
        const refreshToken = getCookieValue('refreshToken')

        if (token) {
          try {
            const decoded = jwtDecode<{ sub: string; exp: number }>(token)
            if (Date.now() < decoded.exp * 1000) {
              set({
                token,
                refreshToken,
                user: { username: decoded.sub },
                isAuthenticated: true,
                isAuthInitialized: true,
              })
            } else {
              // Token expired, try refreshing
              refreshAccessToken()
                .then(newToken => {
                  const newDecoded = jwtDecode<{ sub: string; exp: number }>(newToken.accessToken)
                  set({
                    token: newToken.accessToken,
                    refreshToken: newToken.refreshToken,
                    user: { username: newDecoded.sub },
                    isAuthenticated: true,
                  })
                })
                .catch(() => get().logout())
                .finally(() => set({ isAuthInitialized: true }))
            }
          } catch (error) {
            console.error('Token handling error:', error)
            get().logout()
          }
        } else {
          set({ isAuthInitialized: true })
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
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  
  return { isAuthenticated, token, user, isAuthInitialized }
};

// token 존재 여부만 확인하는 hook
export const useAuthToken = () => {
  const token = useAuthStore((state) => state.token)
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus)
  
  return { token, hasToken: !!token, checkAuthStatus }
}