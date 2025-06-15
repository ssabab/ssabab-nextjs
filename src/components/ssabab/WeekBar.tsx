'use client'

import React, { useState, useEffect } from 'react'

type WeekBarProps = {
  onDateChange?: (date: string) => void
}

export default function WeekBar({ onDateChange }: WeekBarProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [dates, setDates] = useState<Date[]>([])
  const [selected, setSelected] = useState<Date>(new Date())
  const labels = ['월','화','수','목','금']

  useEffect(() => {
    const today = new Date()
    // 기준 날짜: today + weekOffset 주
    const base = new Date(today)
    base.setDate(today.getDate() + weekOffset * 7)
    // 그 주 월요일
    const day = base.getDay()          // 일=0,... 토=6
    const monday = new Date(base)
    monday.setDate(base.getDate() - ((day + 6) % 7))

    // 월〜금 날짜 생성
    const arr: Date[] = []
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      arr.push(d)
    }
    setDates(arr)

    // 기본 선택: 이번주는 today(주말이면 arr[4]), 지난주는 arr[0] (월요일)
    let pick: Date
    if (weekOffset === 0) {
      const todayIdx = arr.findIndex(d => d.toDateString() === today.toDateString())
      pick = todayIdx !== -1 ? arr[todayIdx] : arr[4]
    } else {
      pick = arr[0]
    }
    setSelected(pick)
    onDateChange?.(pick.toISOString().slice(0,10))
  }, [weekOffset, onDateChange])
  
  return (
    <div className="flex items-center space-x-2">
      {/* 지난주 버튼 */}
      <button
        onClick={() => setWeekOffset(weekOffset - 1)}
        className={`
          px-2 py-1 rounded focus:outline-none
          transition-opacity transition-transform duration-150
          opacity-100 hover:opacity-80 active:translate-x-1
        `}
      >
        &lt;&lt;
      </button>

      {/* 요일 버튼들 */}
      {dates.map((date, idx) => {
        const isSelected = date.toDateString() === selected.toDateString()
        return (
          <div key={date.toISOString()} className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-700">{labels[idx]}</span> {/* 요일 표시 */}
            <button
              onClick={() => {
                setSelected(date)
                onDateChange?.(date.toISOString().slice(0,10))
              }}
              className={`
                px-3 py-1 rounded focus:outline-none mt-1
                transition-colors duration-150
                ${isSelected
                  ? 'border-2 border-orange-500 bg-white hover:bg-gray-100 font-semibold' // 선택된 경우 주황색 테두리
                  : 'border border-transparent bg-white hover:bg-gray-200 font-normal'}
              `}
            >
              {date.getDate()} {/* 날짜 숫자 표시 */}
            </button>
          </div>
        )
      })}

      {/* 다음주 버튼 */}
      <button
        onClick={() => setWeekOffset(weekOffset + 1)}
        className={`
          px-2 py-1 rounded focus:outline-none
          transition-opacity transition-transform duration-150
          opacity-100 hover:opacity-80 active:-translate-x-1
        `}
      >
        &gt;&gt;
      </button>
    </div>
  )
}