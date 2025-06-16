import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export interface RawFood {
  foodId: number
  foodName: string
  mainSub?: string
  category?: string
  tag?: string
}

export type FoodInfo = Pick<RawFood, 'foodId' | 'foodName'>

export interface Menu {
  menuId: number
  date?: string
  foods: FoodInfo[]
}

/** 로그인 수정 필요할 수도.. 구글만 구현 */
export const getGoogleOAuthUrl = () =>
  api.get<{ url: string }>('/auth/oauth2/authorize/google')

export const oauthLogin = (provider: 'google', code: string) =>
  api.post<{ accessToken: string; refreshToken: string }>('/auth/oauth2/callback', { provider, code })

export const logout = () =>
  api.post('/account/logout')

/** 토큰 재발급 */
export const refreshAccessToken = () =>
  api.post<{ accessToken: string }>('/account/refresh')

/** 날짜별 메뉴 목록 조회 */
export const getMenu = (date: string) =>
  api.get<{ menus: Menu[] }>('/api/menu', { params: { date } })

export default api