"use client"

import React from "react"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts"

const chartStyle = "w-[160px] h-[150px] bg-gray-200 rounded-xl p-2"

const commonProps = {
  barSize: 30,
  fill: "#6366F1", // indigo-500
}

const generationData = [
  { label: "12기", count: 80 },
  { label: "13기", count: 20 },
]

const genderData = [
  { label: "남", count: 70 },
  { label: "여", count: 30 },
]

const ageData = [
  { label: "25살", count: 60 },
  { label: "26살", count: 70 },
  { label: "31살", count: 40 },
]

const classData = [
  { label: "1반", count: 50 },
  { label: "2반", count: 60 },
  { label: "3반", count: 55 },
  { label: "4반", count: 45 },
  { label: "5반", count: 30 },
  { label: "6반", count: 20 },
]

const renderBarBox = (title: string, data: any[]) => (
  <div className={chartStyle}>
    <div className="text-sm font-semibold text-center mb-2">{title}</div>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
        <Tooltip formatter={(value: number) => [`${value}명`]} />
        <Bar dataKey="count" {...commonProps} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)

const UserProfileStatsChart: React.FC = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-4 space-y-2 w-fit">
      <p className="text-sm font-semibold mb-2 text-center">
        기수별? 나이별? 누가 뭘 먹었는지, 선택의 흐름을 한눈에 확인해보세요!
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        {renderBarBox("기수", generationData)}
        {renderBarBox("성별", genderData)}
        {renderBarBox("나이", ageData)}
        {renderBarBox("반", classData)}
      </div>
    </div>
  )
}

export default UserProfileStatsChart
