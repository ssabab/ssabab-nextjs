"use client"

import { useState } from "react"
// 일간 컴포넌트
import LunchSection from "@/components/ssabab/LunchSection"
import DailyVoteDonutGroup from "@/components/analysis/daily/DailyVoteDonutGroup"
import DailyUserStatsBar from "@/components/analysis/daily/DailyUserStatsBar"
import DailyKeywordSummary from "@/components/analysis/daily/DailyKeywordSummary"
// 월간 컴포넌트
import MonthlyEngagementDonutGroup from "@/components/analysis/monthly/MonthlyEngagementDonutGroup"
import MonthlyFoodRanking from "@/components/analysis/monthly/MonthlyFoodRanking"
// 개인 컴포넌트
import PersonalPreferredTag from "@/components/analysis/personal/PersonalPreferredTag"
import PersonalFoodRanking from "@/components/analysis/personal/PersonalFoodRanking"
import PersonalRatingComparison from "@/components/analysis/personal/PersonalRatingComparison"
import BottomTab from "@/components/BottomTab"

export default function AnalysisPage() {
  const [mode, setMode] = useState<"daily" | "monthly" | "personal">("daily")

  return (
    <main className="min-h-screen pb-24 px-4 pt-6 space-y-6 bg-gray-50">
      {/* 모드 전환 버튼 */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setMode("daily")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${mode === "daily" ? "bg-indigo-500 text-white" : "bg-white border"}`}
        >
          일간
        </button>
        <button
          onClick={() => setMode("monthly")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${mode === "monthly" ? "bg-indigo-500 text-white" : "bg-white border"}`}
        >
          월간
        </button>
        <button
          onClick={() => setMode("personal")}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${mode === "personal" ? "bg-indigo-500 text-white" : "bg-white border"}`}
        >
          개인
        </button>
      </div>

      {/* 모드에 따른 컴포넌트 분기 */}
      {mode === "daily" && (
        <>
          <LunchSection />
          <DailyVoteDonutGroup />
          <DailyUserStatsBar />
          <DailyKeywordSummary />
        </>
      )}
      {mode === "monthly" && (
        <>
          <MonthlyEngagementDonutGroup />
          <MonthlyFoodRanking />
        </>
      )}
      {mode === "personal" && (
        <>
          <PersonalPreferredTag />
          <PersonalFoodRanking />
          <PersonalRatingComparison />
        </>
      )}

      {/* 하단 탭 */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t z-50">
        <BottomTab />
      </div>
    </main>
  )
}