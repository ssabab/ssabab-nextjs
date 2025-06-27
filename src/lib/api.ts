import axios, { AxiosError } from 'axios'
import { getCookie, setCookie } from 'cookies-next'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use(
  config => {
    const token = getCookie('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  response => response,
  async error => {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        const originalRequest = error.config
        if (!originalRequest) return Promise.reject(error)

        const refreshToken = getCookie('refreshToken')
        if (refreshToken) {
          try {
            const { data } = await api.post('/account/refresh', {
              refreshToken,
            })
            const newAccessToken = data.token.accessToken
            setCookie('accessToken', newAccessToken)
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            return axios(originalRequest)
          } catch (e) {
            // 리프레시 토큰 요청 실패 시 로그인 페이지로
            // window.location.href = '/login'
          }
        }
      }
    }
    return Promise.reject(error)
  },
)

export const postWithAuth = async (url: string, data: unknown) => {
  const token = getCookie('token')
  if (!token) throw new Error('인증 토큰이 없습니다.')

  try {
    const response = await api.post(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || '요청 실패')
    }
    throw new Error('알 수 없는 오류 발생')
  }
}

export const putWithAuth = async (url: string, data: unknown) => {
  const token = getCookie('token')
  if (!token) throw new Error('인증 토큰이 없습니다.')

  try {
    const response = await api.put(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || '요청 실패')
    }
    throw new Error('알 수 없는 오류가 발생했습니다.')
  }
}

export const deleteWithAuth = async (url: string) => {
  const token = getCookie('token')
  if (!token) throw new Error('인증 토큰이 없습니다.')

  try {
    const response = await api.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    // 에러 처리 로직
  }
}

export default api