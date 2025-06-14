'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { getMenu, getReview, getProfile } from '@/lib/api'
import RatingForm from '@/components/review/RatingForm'

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const menuId = Number(params.menuId)
  const date = searchParams.get('date')                // "YYYY-MM-DD"

  const [menu, setMenu] = useState<{
    menuId: number
    foods: { food_id: number; food_name: string }[]
  } | null>(null)

  const [userId, setUserId] = useState<number | null>(null)

  // 1) 로그인된 사용자 프로필에서 userId 가져오기
  useEffect(() => {
    getProfile()
      .then(res => {
        // API가 { userId, name, email }을 반환한다고 가정
        setUserId(res.data.userId)
      })
      .catch(() => {
        // 로그인 필요
        alert('로그인이 필요합니다.')
        router.push('/login')
      })
  }, [router])

  // 2) 메뉴 데이터 로드
  useEffect(() => {
    if (!date) return
    getMenu(date)
      .then(res => {
        const found = res.data.find(m => m.menuId === menuId)
        if (found) {
          setMenu(found)
        } else {
          console.warn('해당 menuId를 가진 식단이 없습니다.')
        }
      })
      .catch(err => console.error('메뉴 불러오기 실패:', err))
  }, [menuId, date])

  // 3) 이미 리뷰를 썼는지 확인
  useEffect(() => {
    if (date && userId !== null) {
      getReview(menuId, date)
        .then(res => {
          // myScore가 정의된 항목이 하나라도 있으면 이미 작성된 것으로 간주
          const wrote = res.data.some(r => r.myScore !== undefined)
          if (wrote) {
            alert('이미 오늘 이 메뉴에 대한 리뷰를 작성하셨습니다.')
            router.push('/ssabab')
          }
        })
        .catch(err => console.error('리뷰 조회 실패:', err))
    }
  }, [menuId, date, userId, router])

  if (!date) {
    return (
      <div className="text-center mt-10 text-red-500">
        날짜 정보가 없습니다.
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="text-center mt-10 text-gray-500">로딩 중...</div>
    )
  }

  // 여기에 userId가 null이면 아직 로딩 중이거나 리디렉션 직전
  if (userId === null) {
    return null
  }

  return (
    <main className="container mx-auto py-8">
      <RatingForm
        menuId={menu.menuId}
        foods={menu.foods}
        userId={userId!}
      />
    </main>
  )
}
