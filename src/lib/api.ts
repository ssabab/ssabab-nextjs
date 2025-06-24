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

export const postMenuReview = (payload: MenuReviewPayload) =>
  api.post('/api/review/menu', payload)

export const putMenuReview = (payload: MenuReviewPayload) =>
  api.put('/api/review/menu', payload)

// 음식 평점 (여러 개)
export interface FoodReview {
  foodId:    number
  foodScore: number
}
export interface FoodReviewPayload {
  menuId: number
  reviews: FoodReview[]
}

export const postFoodReview = (payload: FoodReviewPayload) =>
  api.post('/api/review/food', payload)

export const putFoodReview = (body: FoodReviewPayload) =>
  api.put('/api/review/food', body)

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
  api.get(`/api/menu?date=${date}`)

// 주간 메뉴 조회 (GET /api/menu/weekly)
let weeklyMenuCache: any = null; // 1회 호출 후 캐시됨
let weeklyMenuCachePromise: Promise<any> | null = null;
const CACHE_KEY = 'weeklyMenusCache';

export const getWeeklyMenuCached = async () => {
  if (weeklyMenuCache) {
    return { data: { weeklyMenus: weeklyMenuCache } };
  }
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        weeklyMenuCache = JSON.parse(cached);
        return { data: { weeklyMenus: arr } }
      } catch (e) {
        // 파싱 실패 시 무시하고 네트워크로
      }
    }
  }
  if (weeklyMenuCachePromise) {
    // 이미 요청 중이면 해당 프로미스 반환 (동시 중복방지)
    return weeklyMenuCachePromise;
  }
  // 최초 네트워크 호출
  weeklyMenuCachePromise = api.get('/api/menu/weekly').then(res => {
    // 배열만 저장!
    const arr = Array.isArray(res.data.weeklyMenus) ? res.data.weeklyMenus : []
    weeklyMenuCache = arr;
    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify(arr));
    }
    weeklyMenuCachePromise = null;
    return { data: { weeklyMenus: arr } }
  }).catch(e => {
    weeklyMenuCachePromise = null;
    throw e;
  });
  return weeklyMenuCachePromise;
}

// 필요시 수동 초기화 (예: 로그아웃/관리자 변경 시)
export const clearWeeklyMenuCache = () => {
  weeklyMenuCache = null;
  weeklyMenuCachePromise = null;
}

export interface SaveMenuPayload { date: string; foods: FoodInfo[] }
export const postMenu = (body: SaveMenuPayload) =>
  api.post<Menu>('/api/menu', body)

export const updateMenu = (id: number, body: SaveMenuPayload) =>
  api.put<Menu>(`/api/menu/${id}`, body)

export const deleteMenu = (id: number) =>
  api.delete<void>(`/api/menu/${id}`)

export interface PersonalAnalysisResponse {
  ratingData: RatingDataDTO;
  topRatedFoods: TopLowestRatedFoodsDTO[];
  lowestRatedFoods: TopLowestRatedFoodsDTO[];
  preferredCategories: PreferredCategoryDTO[];
  preferredKeywordsForCloud: PreferredKeywordDTO[];
  personalInsight: string;
  comparisonData: ComparisonDataDTO;
}

export interface RatingDataDTO {
  averageRating: number;
  totalReviews: number;
}

export interface TopLowestRatedFoodsDTO {
  name: string;
  rating: number;
  date: string;
}

export interface PreferredCategoryDTO {
  name: string;
  percentage: number;
}

export interface PreferredKeywordDTO {
  value: string;
  count: number;
  color: string;
}

export interface ComparisonDataDTO {
  myRating: number;
  avgRatingCommunity: number;
  mySpicyPreference: number;
  avgSpicyCommunity: number;
  myVarietySeeking: number;
  avgVarietyCommunity: number;
}

export default api