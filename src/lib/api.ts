import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));
  return match ? match.split('=')[1] : null;
}

api.interceptors.request.use(config => {
  const token = getCookieValue('accessToken')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
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

export const updatePreVote = (payload: PreVotePayload) =>
  api.put('/api/vote', payload)

// Review

// 메뉴 한줄평 & 후회여부
export interface MenuReviewPayload {
  menuId:      number
  menuRegret:  boolean
  menuComment: string
}

// putMenuReview는 더 이상 쓰지 않으니 import/내보내기에서 제거
export const postMenuReview = (payload: MenuReviewPayload) =>
  api.post('/api/review/menu', payload)

// 음식 평점 (여러 개)
export interface FoodReview {
  foodId:    number
  foodScore: number
}
export interface FoodReviewPayload {
  menuId:  number
  reviews: FoodReview[]
}

export const postFoodReview = (payload: FoodReviewPayload) =>
  api.post('/api/review/food', payload)

export const putFoodReview = (payload: FoodReviewPayload) =>
  api.put('/api/review/food', payload)

/** 로그인 수정 필요할 수도.. 구글만 구현 */
export const getGoogleOAuthUrl = () =>
  api.get<{ url: string }>('/auth/oauth2/authorize/google')

export const oauthLogin = (provider: 'google', code: string) =>
  api.post<{ accessToken: string; refreshToken: string }>('/auth/oauth2/callback', { provider, code })

export const logout = () =>
  api.post('/logout', null, {
    withCredentials: true,
  })

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