"use client"

import { useState } from "react"
import LunchSection from "@/components/ssabab/LunchSection"
import DailyVoteDonutGroup from "@/components/analysis/daily/DailyVoteDonutGroup"
import DailyUserStatsBar from "@/components/analysis/daily/DailyUserStatsBar"
import DailyKeywordSummary from "@/components/analysis/daily/DailyKeywordSummary"
// 임시 주석 해제 시 월간 컴포넌트 활성화
import MonthlyEngagementDonutGroup from "@/components/analysis/monthly/MonthlyEngagementDonutGroup"
import MonthlyFoodRanking from "@/components/analysis/monthly/MonthlyFoodRanking"
import BottomTab from "@/components/BottomTab"

export default function AnalysisPage() {
  const [mode, setMode] = useState<"daily" | "monthly">("daily")

  return (
    <main className="min-h-screen pb-24 px-4 pt-6 space-y-6 bg-gray-50">
      {/* 일간/월간 전환 버튼 */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setMode("daily")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            mode === "daily" ? "bg-indigo-500 text-white" : "bg-white border"
          }`}
        >
          일간
        </button>
        <button
          onClick={() => setMode("monthly")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            mode === "monthly" ? "bg-indigo-500 text-white" : "bg-white border"
          }`}
        >
          월간
        </button>
      </div>

      {/* 모드에 따라 컴포넌트 전환 */}
      {mode === "daily" ? (
        <>
          <LunchSection />
          <DailyVoteDonutGroup />
          <DailyUserStatsBar />
          <DailyKeywordSummary />
        </>
      ) : (
        <>
          <MonthlyEngagementDonutGroup />
          <MonthlyFoodRanking />
        </>
      )}

      {/* 하단 탭 */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t z-50">
        <BottomTab />
      </div>
    </main>
  )
}
