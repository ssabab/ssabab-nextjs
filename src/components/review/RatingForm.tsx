'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RatingList } from './RatingList'
import { LoginForm } from '@/components/authentication/LoginForm'

interface Food {
  food_id: number
  food_name: string
}

interface RatingFormProps {
  menuId: number
  foods: Food[]
  userId: number | null
}

export default function RatingForm({ menuId, foods, userId }: RatingFormProps) {
  const [ratings, setRatings] = useState<number[]>(Array(foods.length).fill(0))
  const [review, setReview] = useState('')
  const [open, setOpen] = useState(false)
  const [loginPrompt, setLoginPrompt] = useState(false)
  const [hasReview, setHasReview] = useState(false) // ✅ 기존 리뷰 존재 여부 추적
  const router = useRouter()

  const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)

  const handleRatingChange = (index: number, value: number) => {
    const updated = [...ratings]
    updated[index] = value
    setRatings(updated)
  }

  // ✅ 진입 시 기존 리뷰 불러오기 (별점 초기화용)
  useEffect(() => {
    const fetchReview = async () => {
      if (!userId) return

      try {
        const res = await axios.get(`http://localhost:8080/review/${menuId}`, {
          headers: { user_id: Number(userId) },
        })

        if (res.data && res.data.foods?.length > 0) {
          setRatings(
            res.data.foods.map((f: any) => f.foodScore) // ✅ 서버 응답 camelCase
          )
          if (res.data.review) setReview(res.data.review)
          setHasReview(true)
        } else {
          setHasReview(false)
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setHasReview(false) // ✅ 리뷰 없음
        } else {
          console.error('리뷰 조회 실패:', err)
        }
      }
    }

    fetchReview()
  }, [menuId, userId])

  const handleSubmit = async () => {
    const allRated = ratings.every((r) => r > 0)
    if (!allRated) {
      alert('별점을 모두 매겨주세요')
      return
    }


    if (!userId) {
      setLoginPrompt(true)
      return
    }

    // ✅ Swagger에 맞춘 전송 데이터 (review 제외)
    const payload = {
      foods: foods.map((food, idx) => ({
        foodId: food.food_id + 1,
        foodName: food.food_name,
        foodScore: ratings[idx],
      })),
    }

    try {
      if (hasReview) {
        await axios.put(`http://localhost:8080/review/${menuId}`, payload, {
          headers: { user_id: userId },
        })
      } else {
        await axios.post(`http://localhost:8080/review/${menuId}`, payload, {
          headers: { user_id: userId },
        })
      }
      setOpen(true)
    } catch (err) {
      console.error('리뷰 전송 실패:', err)
      // console.log(payload, userId)
      console.log(foods)
      alert('리뷰 전송 중 오류가 발생했습니다.')
    }
  }

  return (
    <>
      <Card className="p-6 max-w-md mx-auto mt-10 space-y-4">
        <h2 className="text-lg font-semibold text-center">리뷰 작성</h2>
        <p className="text-center text-sm text-gray-500">현재 평균 별점: {avg}점</p>
        <Separator />
        <RatingList items={foods} values={ratings} onChange={handleRatingChange} />
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="review">추가 의견</Label>
          <Textarea
            id="review"
            placeholder="리뷰를 남겨주세요!"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>전송</Button>
        </div>
      </Card>

      {/* ✅ 리뷰 완료 Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>전송이 완료되었습니다!</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => router.push('/')}>홈으로</Button>
            <Button onClick={() => setOpen(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ 로그인 요청 Dialog */}
      <Dialog open={loginPrompt} onOpenChange={setLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>로그인이 필요합니다</DialogTitle>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </>
  )
}
