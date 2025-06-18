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

// Voting
export interface PreVotePayload { menuId: number }
export const preVote = (payload: PreVotePayload) =>
  api.post('/api/vote', payload)

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

/** 메뉴 CRUD */
export const getMenu = (date: string) =>
  api.get<{ menus: Menu[] }>('/api/menu', { params: { date } })

export interface SaveMenuPayload { date: string; foods: FoodInfo[] }
export const postMenu = (body: SaveMenuPayload) =>
  api.post<Menu>('/api/menu', body)

export const updateMenu = (id: number, body: SaveMenuPayload) =>
  api.put<Menu>(`/api/menu/${id}`, body)

export const deleteMenu = (id: number) =>
  api.delete<void>(`/api/menu/${id}`)

export default api