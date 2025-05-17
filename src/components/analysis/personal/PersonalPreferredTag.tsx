"use client"

import React from "react"
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts"

type TagData = { name: string; value: number }

const COLORS = ["#6366F1", "#818CF8", "#A5B4FC", "#CBD5E1", "#E5E7EB"]

// 상위 N개 태그 추출
const getTopTags = (groups: Record<string, TagData[]>, topN: number = 3) => {
  const flat = Object.values(groups).flat()
  return [...flat].sort((a, b) => b.value - a.value).slice(0, topN)
}

// 도넛 차트 렌더링 함수
const renderDonutChart = (title: string, data: TagData[]) => (
  <div className="flex flex-col items-center w-[200px] h-[200px] bg-white rounded-2xl p-3 shadow-sm">
    <PieChart width={150} height={150}>
      <Tooltip
        content={({ active, payload }) => {
          if (active && payload && payload.length > 0) {
            const { name, value } = payload[0]
            return (
              <div className="bg-white border px-3 py-1 rounded shadow text-sm font-medium text-gray-800">
                {name} {value}%
              </div>
            )
          }
          return null
        }}
      />
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={50}
        outerRadius={70}
        stroke="none"
      >
        {/* 중앙 카테고리명 */}
        <Label
          content={({ viewBox }) => {
            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-800 text-[13px] font-semibold"
                >
                  {title}
                </text>
              )
            }
          }}
        />
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  </div>
)

// 전체 그룹 컴포넌트
export default function PersonalPreferredTagDonutGroup() {
  const tagGroups = {
    음식종류: [
      { name: "한식", value: 45 },
      { name: "중식", value: 30 },
      { name: "일식", value: 15 },
      { name: "양식", value: 10 },
    ],
    주식: [
      { name: "밥", value: 60 },
      { name: "빵", value: 25 },
      { name: "면", value: 15 },
    ],
    재료: [
      { name: "고기", value: 60 },
      { name: "야채", value: 40 },
    ],
  }

  const topTags = getTopTags(tagGroups)

  return (
    <div className="bg-gray-100 rounded-xl p-6 space-y-5 w-fit shadow">
      <h4 className="text-sm font-semibold text-center">
        당신이 자주 맛있게 먹은 음식의 타입을 알려드릴게요!
      </h4>

      <div className="flex flex-wrap gap-6 justify-center">
        {Object.entries(tagGroups).map(([title, data]) =>
          renderDonutChart(title, data)
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center items-center">
        {topTags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-white border border-gray-300 rounded-full px-4 py-1 text-sm font-semibold text-gray-800 shadow-sm"
          >
            {tag.name}
          </span>
        ))}
        <span className="text-sm text-gray-600">음식을 좋아하시네요!</span>
      </div>
    </div>
  )
}
