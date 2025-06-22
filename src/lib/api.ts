import axios from 'axios'

export function getCookieValue(key: string): string | undefined {
  if (typeof document === 'undefined') return
  const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : undefined
}

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use(config => {
  const token = getCookieValue('accessToken')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  const refreshToken = getCookieValue('refreshToken')
  if (refreshToken) {
    config.headers = config.headers || {}
    config.headers['X-Refresh-Token'] = refreshToken
  }
  return config
})

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 24*60*60*1000).toUTCString()
  document.cookie = `${name}=${value}; Path=/; SameSite=None; Secure; Expires=${expires}`
}

function removeCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

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
  foods: FoodInfo[]
}

export interface WeeklyMenu {
  date: string
  menu1: Menu
  menu2: Menu
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

// 음식 평점 등록/수정 (POST /api/review/food)
export const postFoodReview = (body: {
  menuId: number
  reviews: { foodId: number; foodScore: number }[]
}) => api.post('/api/review/food', body)

// 로그아웃
export const logout = () =>
  api.post('/logout', null, {
    withCredentials: true,
  })

/** 토큰 재발급 */
export const refreshAccessToken = async () => {
  const refreshToken = getCookieValue('refreshToken')
  if (!refreshToken) throw new Error('No refresh token')
  const { data } = await api.post('/account/refresh', { refreshToken })
  // 받은 토큰을 쿠키와 상태에 반영
  setCookie('accessToken', data.token.accessToken)
  setCookie('refreshToken', data.token.refreshToken)
  return data.token
}

/** 홈/관리자 페이지 */
// 홈 메시지 (GET /)
export const getHome = () => api.get('/')

// 분석 페이지 (GET /analysis)
export const getAnalysis = () => api.get('/analysis')

// 관리자 페이지 (GET /admin)
export const getAdminPage = () => api.get('/admin')

/** 메뉴 CRUD */
// 일별 메뉴 조회
export const getMenu = (date: string) =>
  api.get<{ menus: Menu[] }>('/api/menu', { params: { date } })

// 주간 메뉴 조회 (GET /api/menu/weekly)
export const getWeeklyMenu = () => api.get('/api/menu/weekly')

export interface SaveMenuPayload { date: string; foods: FoodInfo[] }
export const postMenu = (body: SaveMenuPayload) =>
  api.post<Menu>('/api/menu', body)

export const updateMenu = (id: number, body: SaveMenuPayload) =>
  api.put<Menu>(`/api/menu/${id}`, body)

export const deleteMenu = (id: number) =>
  api.delete<void>(`/api/menu/${id}`)

export default api