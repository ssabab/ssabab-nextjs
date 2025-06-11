'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: 실제 유저 정보 API로 교체
    axios
      .get('/api/user/me')
      .then((res) => setUserInfo(res.data))
      .catch((err) => {
        console.error('유저 정보 로딩 실패:', err)
        setError('유저 정보를 불러오지 못했습니다.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container mx-auto p-4 pt-20 pb-20">
      <h1 className="text-2xl font-bold mb-4">마이 페이지</h1>

      {loading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {userInfo && (
        <div className="space-y-2">
          <p>
            <strong>이름:</strong> {userInfo.name}
          </p>
          <p>
            <strong>이메일:</strong> {userInfo.email}
          </p>
          {/* 향후 로그아웃, 프로필 수정 버튼 등 추가 가능 */}
        </div>
      )}
    </div>
  )
}
