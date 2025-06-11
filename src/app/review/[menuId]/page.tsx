'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useSearchParams } from 'next/navigation'
import RatingForm from '@/components/review/RatingForm'

interface RawFood {
  foodName: string
  // 필요시 mainSub, category, tag도 포함 가능
}

interface RawMenu {
  menuId: number
  foods: RawFood[]
}

interface Food {
  food_id: number
  food_name: string
}

interface Menu {
  menuId: number
  foods: Food[]
}

export default function ReviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const menuId = Number(params.menuId)
  const date = searchParams.get('date')
  const [menu, setMenu] = useState<Menu | null>(null)

  const [votes, setVotes] = useState<string[]>([])
  const [voted, setVoted] = useState<boolean[]>([])

  const userId = 1 // 추후 로그인 사용자로 교체

  const hour = new Date().getHours()

  useEffect(() => {
    if (!date) return

    const fetchMenu = async () => {
      try {
        const res = await axios.get<RawMenu[]>(`http://localhost:8080/menu/${date}`)
        const found = res.data.find((m) => Number(m.menuId) === menuId)

        if (found) {
          const convertedFoods = found.foods.map((f, idx) => ({
            food_id: idx,
            food_name: f.foodName,
          }))

          setMenu({
            menuId: menuId,
            foods: convertedFoods,
          })

          console.log("메뉴 가져오기 성공:", menu)
        } else {
          console.warn('해당 menuId를 가진 식단이 없습니다.')
        }
      } catch (err) {
        console.error('메뉴 불러오기 실패:', err)
      }
    }

    fetchMenu()
  }, [menuId, date])

  const handleVote = async (idx: number) => {
    if (voted[idx]) return
    try {
      // TODO: 실제 투표 API로 변경
      await axios.post(`http://localhost:8080/vote`, {
        menuId,
        foodId: menu?.foods[idx].food_id,
        userId: 1, // TODO: 로그인 사용자로 교체
      })
      setVotes((prev) => {
        const next = [...prev]
        next[idx] = '투표수 저장 위치'
        return next
      })
      setVoted((prev) => {
        const next = [...prev]
        next[idx] = true
        return next
      })
    } catch (err) {
      console.error('투표 실패:', err)
    }
  }

  if (!date) return <div className="text-center mt-10 text-red-500">날짜 정보가 없습니다.</div>
  if (!menu) return <div className="text-center mt-10 text-gray-500">로딩 중...</div>


  return (
    <main className="container mx-auto py-8">
      {hour < 12 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">사전 투표</h2>
          <div className="grid grid-cols-2 gap-4">
            {menu.foods.map((food, idx) => (
              <div
                key={food.food_id}
                className="border p-4 rounded cursor-pointer hover:shadow"
                onClick={() => handleVote(idx)}
              >
                <p className="mb-2">{food.food_name}</p>
                {voted[idx] && <p className="text-sm text-green-600">{votes[idx]}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {hour >= 12 && hour < 23 && (
        <RatingForm menuId={menu.menuId} foods={menu.foods} userId={1} />
      )}

      {hour >= 23 && (
        <div className="text-center mt-10 text-gray-500">
          현재는 이용할 수 없습니다.
        </div>
      )}
    </main>
  )
}
