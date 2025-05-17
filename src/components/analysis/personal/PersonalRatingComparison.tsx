"use client"

import React from "react"
import { ThumbsUp } from "lucide-react"

export default function PersonalRatingComparison() {
  const userScore = 1.8
  const avgScore = 3.8
  const userName = "희주"

  const getThumbSize = (score: number) => {
    const min = 24
    const max = 64
    return min + (max - min) * (score / 5)
  }

  const renderThumb = (score: number) => {
    const size = getThumbSize(score)
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <ThumbsUp className="fill-black text-black w-full h-full" />
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-[0.9rem]">
          {score}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 rounded-xl p-6 w-fit space-y-4 text-center shadow-sm">
      <p className="text-sm font-medium text-gray-700">
        (다른 기수/다른 반) 사용자보다 <b>엄격한</b> 평가를 내리셨네요
      </p>

      <div className="flex items-center justify-center gap-12">
        {/* 사용자 점수 */}
        <div className="flex flex-col items-center space-y-2">
          {renderThumb(userScore)}
          <p className="text-sm text-gray-700 font-medium">{userName}님의 평점</p>
        </div>

        {/* 전체 평균 점수 */}
        <div className="flex flex-col items-center space-y-2">
          {renderThumb(avgScore)}
          <p className="text-sm text-gray-700 font-medium">전체 사용자 평점</p>
        </div>
      </div>
    </div>
  )
}
