"use client"

import React from "react"

const KEYWORDS = [
  { word: "맛있다", count: 30 },
  { word: "맵다", count: 22 },
  { word: "질겼다", count: 10 },
  { word: "싱겁다", count: 5 },
  { word: "최고", count: 17 },
  { word: "짜다", count: 8 },
  { word: "별로", count: 4 },
  { word: "달다", count: 6 },
]

const getFontSize = (count: number) => {
  // count를 기준으로 font size 설정 (min 12px ~ max 24px)
  const min = 12
  const max = 24
  const maxCount = Math.max(...KEYWORDS.map(k => k.count))
  return `${(count / maxCount) * (max - min) + min}px`
}

const DailyKeywordSummary: React.FC = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-4 space-y-2 w-fit max-w-md">
      <h4 className="text-sm font-semibold mb-2">
        "맛있다", "맵다", "질겼다"... 오늘의 키워드는?
        <br />
        한줄평으로 알아보세요!
      </h4>
      <div className="flex flex-wrap gap-2">
        {KEYWORDS.map((keyword) => (
          <span
            key={keyword.word}
            className="text-indigo-600 font-semibold"
            style={{ fontSize: getFontSize(keyword.count) }}
          >
            {keyword.word}
          </span>
        ))}
      </div>
    </div>
  )
}

export default DailyKeywordSummary
