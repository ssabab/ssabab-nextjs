"use client"

import React from "react"
import { PieChart, Pie, Cell, Sector, Tooltip, Label } from "recharts"

type ChartData = { name: string; value: number }[]

const BASE_COLOR = "#6366F1" // 보라색 계열
const MIN_OPACITY = 0.3
const MAX_OPACITY = 1.0

const getTopIndex = (data: ChartData) =>
  data.reduce((maxIdx, item, i, arr) => (item.value > arr[maxIdx].value ? i : maxIdx), 0)

const getOpacityGradientColors = (data: ChartData, baseColor: string): string[] => {
  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  return data.map(d => {
    const ratio = (d.value - min) / (max - min || 1)
    const opacity = MIN_OPACITY + ratio * (MAX_OPACITY - MIN_OPACITY)
    return `${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`
  })
}

const renderDonut = (title: string, data: ChartData) => {
  const activeIndex = getTopIndex(data)
  const colors = getOpacityGradientColors(data, BASE_COLOR)

  return (
    <div className="flex flex-col items-center w-[220px] h-[240px] bg-gray-100 rounded-2xl p-4 shadow-md">
      <div className="text-base font-bold mb-2">{title}</div>
      <PieChart width={180} height={180}>
        <Tooltip formatter={(value: number) => [`${value}명`]} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={75}
          stroke="none"
          activeIndex={activeIndex}
          activeShape={({ outerRadius = 0, ...props }) => (
            <g>
              <Sector {...props} outerRadius={outerRadius + 10} />
              <Sector
                {...props}
                outerRadius={outerRadius + 20}
                innerRadius={outerRadius + 12}
              />
            </g>
          )}
        >
          <Label
            content={({ viewBox }) => {
              const top = data[activeIndex]
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-[26px] font-bold"
                    >
                      {top.value}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 22}
                      className="fill-muted-foreground text-[12px]"
                    >
                      참여
                    </tspan>
                  </text>
                )
              }
            }}
          />
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  )
}

export default function MonthlyEngagementDonutGroup() {
  const generationData = [
    { name: "12기", value: 80 },
    { name: "13기", value: 65 },
  ]

  const classData = [
    { name: "1반", value: 42 },
    { name: "2반", value: 55 },
    { name: "3반", value: 38 },
    { name: "4반", value: 58 },
    { name: "5반", value: 47 },
    { name: "6반", value: 51 },
  ]

  return (
    <div className="bg-white rounded-xl p-6 space-y-6 w-fit shadow">
      <h4 className="text-center text-base font-semibold leading-tight">
        어느 기수, 어떤 반이 가장 열정적이었을까요? <br />
        데이터로 확인해보세요!
      </h4>
      <div className="flex justify-center gap-10">
        {renderDonut("기수", generationData)}
        {renderDonut("반", classData)}
      </div>
    </div>
  )
}
