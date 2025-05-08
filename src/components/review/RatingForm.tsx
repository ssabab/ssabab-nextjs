'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { RatingList } from "./RatingList"

interface RatingFormProps {
  title: string
  items: string[]
}

export function RatingForm({ title, items }: RatingFormProps) {
  const [ratings, setRatings] = useState<number[]>(Array(items.length).fill(0))
  const [review, setReview] = useState("")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleRatingChange = (index: number, value: number) => {
    const updated = [...ratings]
    updated[index] = value
    setRatings(updated)
  }

  const handleSubmit = () => {
    const allRated = ratings.every(r => r > 0)
    if (!allRated) {
      alert("별점을 모두 매겨주세요")
      return
    }
    // 여기에 서버 전송 로직을 추가할 수 있습니다.
    setOpen(true)
  }

  const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)

  return (
    <>
      <Card className="p-6 max-w-md mx-auto mt-10 space-y-4">
        <h2 className="text-lg font-semibold text-center">{title}</h2>
        <p className="text-center text-sm text-gray-500">현재 평균 별점: {avg}점</p>
        <Separator />
        <RatingList items={items} values={ratings} onChange={handleRatingChange} />
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="review">추가 의견</Label>
          <Textarea
            id="review"
            placeholder="리뷰를 남겨주세요..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>전송</Button>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>전송이 완료되었습니다!</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => router.push("/")}>홈으로</Button>
            <Button onClick={() => setOpen(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
