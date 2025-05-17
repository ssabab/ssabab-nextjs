"use client"

import React from "react"

interface FoodItem {
  name: string
  score: number
}

const bestFoods: FoodItem[] = [
  { name: "맛있는 음식1", score: 5.0 },
  { name: "맛있는 음식2", score: 4.9 },
  { name: "맛있는 음식3", score: 4.8 },
  { name: "맛있는 음식4", score: 4.7 },
  { name: "맛있는 음식5", score: 4.6 },
]

const worstFoods: FoodItem[] = [
  { name: "맛없는 음식1", score: 0.0 },
  { name: "맛없는 음식2", score: 0.1 },
  { name: "맛없는 음식3", score: 0.2 },
  { name: "맛없는 음식4", score: 0.3 },
  { name: "맛없는 음식5", score: 0.4 },
]

const renderFoodList = (list: FoodItem[], align: "left" | "right") => (
  <ul className={`space-y-1 text-sm text-gray-800 ${align === "right" ? "text-right" : ""}`}>
    {list.map((item, i) => (
      <li key={i}>
        <span className="inline-block w-4">{i + 1}</span>{" "}
        {item.name} <span className="font-semibold">{item.score.toFixed(1)}</span>
      </li>
    ))}
  </ul>
)

export default function MonthlyFoodRanking() {
  return (
    <div className="bg-gray-100 rounded-xl p-4 w-fit shadow-sm">
      <h4 className="text-sm font-semibold mb-2">
        평점을 높게 남긴 음식과 낮게 남긴 음식을 보여드릴게요!
      </h4>
      <div className="grid grid-cols-2 gap-6">
        {renderFoodList(bestFoods, "left")}
        {renderFoodList(worstFoods, "right")}
      </div>
    </div>
  )
}
