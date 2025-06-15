import axios from 'axios'

// ──────────── Axios 인스턴스 ───────────────────────────────────────────────

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// ──────────── Shared Types & Utilities ──────────────────────────────────────

/** 원시 서버 Food */
export interface RawFood {
  foodId: number
  foodName: string
  mainSub?: string
  category?: string
  tag?: string
}

/** 클라이언트에서 주로 쓰는 음식 정보 */
export type FoodInfo = Pick<RawFood, 'foodId' | 'foodName'>

/** 메뉴 기본 구조 */
export interface Menu {
  menuId: number
  date?: string
  foods: FoodInfo[]
}

/** 리뷰 기본 구조 */
export interface Review {
  foodId: number
  averageScore: number
  myScore?: number
}

/** 공통: menuId 페이로드 */
interface HasMenuId { menuId: number }

/** 사전 투표 페이로드 */
export type PreVotePayload = Pick<HasMenuId, 'menuId'>

/** 음식별 평점 페이로드 */
export interface FoodReviewPayload extends HasMenuId {
  reviews: Array<Pick<Review, 'foodId'> & { foodScore: number }>
}

/** 메뉴 한줄평/후회 페이로드 */
export interface MenuReviewPayload extends HasMenuId {
  menuRegret: boolean
  menuComment: string
}

/** 회원가입 요청 데이터 */
export interface SignupData {
  username: string
  ssafyYear: number
  classNum: number
  ssafyRegion: string
  gender: string
  age: number
}

/** 친구 투표 결과 */
export interface FriendVote extends HasMenuId {
  friendId: number
  friendName: string
  votedMenuInfo: FoodInfo[]
  votedMenuDate: string
  averageMenuScore?: number
}

// ──────────── Authentication ─────────────────────────────────────────────────

// 관리자 혹은 토큰 보유하고 있는 사용자의 회원가입 화면
export const signup = (data: SignupData, token: string) =>
  api.post('/account/signup', data, {
    headers: { Authorization: `Bearer ${token}` },
  })

// 일반 사용자의 회원가입 화면 
export const register = (data: {
  email: string
  password: string
  username: string
}) =>
  api.post('/account/signup', data)
  
export const login = (email: string, password: string) =>
  api.post('/account/login', { email, password })

export const logout = () =>
  api.post('/account/logout')

export const refreshAccessToken = () =>
  api.post('/account/refresh')

export const getProfile = () =>
  api.get<{ name: string; email: string }>('/account/info')

// ──────────── Menu & Voting ────────────────────────────────────────────────

export const getMenu = (date: string) =>
  api.get<{ menus: Menu[] }>('/api/menu', { params: { date } })

export const preVote = (payload: PreVotePayload) =>
  api.post('/api/vote', payload)

export const getFriendsVotes = (date: string) =>
  api.get<{ votes: FriendVote[] }>('/api/vote/friends', { params: { date } })

// ──────────── Review ────────────────────────────────────────────────────────

export const getReview = (menuId: number, date: string) =>
  api.get<{ reviews: Review[] }>(`/api/review/${menuId}`, { params: { date } })

export const submitFoodReview = (payload: FoodReviewPayload) =>
  api.post('/api/review/food', payload)

export const submitMenuReview = (payload: MenuReviewPayload) =>
  api.post('/api/review/menu', payload)

export const getFriendsMenuReviews = (date: string) =>
  api.get<{ reviews: FriendVote[] }>('/api/review/menu/friends', { params: { date } })

export default api
