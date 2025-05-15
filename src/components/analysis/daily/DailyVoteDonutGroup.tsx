"use client"

import React from "react"
import { PieChart, Pie, Cell, Tooltip } from "recharts"

const CHART_WIDTH = 120
const CHART_HEIGHT = 120

const VOTE_DATA = [
  { name: "식단 A", value: 65 },
  { name: "식단 B", value: 35 },
]

const ACTUAL_DATA = [
  { name: "식단 A", value: 50 },
  { name: "식단 B", value: 50 },
]

const COLORS = ["#6366F1", "#CBD5E1"]

const renderDonut = (title: string, data: { name: string; value: number }[]) => (
  <div className="flex flex-col items-center w-[160px] h-[180px] bg-gray-200 rounded-xl p-2 shadow-sm">
    <div className="text-sm font-semibold mb-2">{title}</div>
    <PieChart width={CHART_WIDTH} height={CHART_HEIGHT}>
      <Tooltip
        formatter={(value: number, name: string) => [`${value}명`, name]}
        wrapperStyle={{ fontSize: "12px" }}
      />
      <Pie
        data={data}
        innerRadius={40}
        outerRadius={60}
        dataKey="value"
        stroke="none"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  </div>
)

const DonutChartGroup: React.FC = () => {
  return (
    <div className="flex gap-6">
      {renderDonut("사전 투표 결과", VOTE_DATA)}
      {renderDonut("실제 메뉴 선택 결과", ACTUAL_DATA)}
    </div>
  )
}

export default DonutChartGroup
