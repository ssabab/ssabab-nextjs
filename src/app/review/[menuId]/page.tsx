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
  const userId = 1 // 추후 로그인 사용자로 교체

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

  if (!date) return <div className="text-center mt-10 text-red-500">날짜 정보가 없습니다.</div>
  if (!menu) return <div className="text-center mt-10 text-gray-500">로딩 중...</div>

  return (
    <main className="container mx-auto py-8">
      <RatingForm menuId={menu.menuId} foods={menu.foods} userId={userId} />
    </main>
  )
}
