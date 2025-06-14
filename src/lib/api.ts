
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',     // base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,                // 쿠키 기반 인증 쓰면 true
})

// ─ Authentication ──────────────────────────────────────────────────────────

// POST /account/login
export const login = (email: string, password: string) =>
  api.post('/account/login', { email, password })

// POST /account/register
export const register = (data: {
  email: string
  password: string
  name?: string
}) => api.post('/account/register', data)

// POST /account/logout
export const logout = () => api.post('/account/logout')

// POST /account/refresh
// No body (혹은 필요에 따라 리프레시 토큰 바디)
export const refreshAccessToken = () => api.post('/account/refresh')

// GET /account/me
// Returns user profile
export const getProfile = () => api.get<{ name: string; email: string }>('/account/me')

// ─ Menu & Voting ──────────────────────────────────────────────────────────

// GET /menu/{date}
// Path param date: YYYY-MM-DD
export const getMenu = (date: string) =>
  api.get<Menu[]>('/menu/' + date)

// POST /vote
// Body: { menuId: number, foodId: number, userId: number }
export const voteMenu = (menuId: number, foodId: number, userId: number) =>
  api.post('/vote', { menuId, foodId, userId })

// ─ Review (예시; Postman 스펙 대로 수정 필요) ────────────────────────────

// GET /review/{menuId}?date=YYYY-MM-DD
export const getReview = (menuId: number, date: string) =>
  api.get<Review[]>(`/review/${menuId}`, { params: { date } })

// POST /review
// Body: { menuId: number, userId: number, ratings: { foodId:number; score:number }[] }
export const submitReview = (payload: {
  menuId: number
  userId: number
  ratings: { foodId: number; score: number }[]
}) => api.post('/review', payload)

// Types (Postman 스펙에 맞춰 조정)
export interface Menu {
  menuId: number
  foods: { food_id: number; food_name: string }[]
}

export interface Review {
  foodId: number
  averageScore: number
  myScore?: number
}

export default api