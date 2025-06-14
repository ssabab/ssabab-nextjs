'use client'

import React, { useState, useEffect } from 'react'

type WeekBarProps = {
  onDateChange?: (date: string) => void
}

export default function WeekBar({ onDateChange }: WeekBarProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [dates, setDates] = useState<Date[]>([])
  const [selected, setSelected] = useState<Date>(new Date())

  useEffect(() => {
    // 기준으로 사용할 날짜 (이번주 기준)
    const today = new Date()
    const base = new Date(today)
    base.setDate(today.getDate() + weekOffset * 7)
    // 해당 주의 월요일 계산
    const day = base.getDay()
    const monday = new Date(base)
    monday.setDate(base.getDate() - ((day + 6) % 7))

    // 월~금 날짜 배열 생성
    const arr: Date[] = []
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      arr.push(d)
    }
    setDates(arr)

    // 초기 선택 및 콜백
    if (arr.length > 0) {
      setSelected(arr[0])
      onDateChange?.(arr[0].toISOString().slice(0, 10))
    }
  }, [weekOffset, onDateChange])

  return (
    <div className="flex items-center space-x-2">
      {/* 지난주 */}
      <button
        onClick={() => setWeekOffset(-1)}
        disabled={weekOffset === -1}
        className={`px-2 py-1 rounded focus:outline-none transition-opacity ${
          weekOffset === -1 ? 'opacity-50' : 'opacity-100 hover:opacity-80'
        }`}
      >
        &lt;&lt;
      </button>

      {/* 요일 버튼 */}
      {dates.map((date) => {
        const labelArr = ['일', '월', '화', '수', '목', '금', '토']
        const label = labelArr[date.getDay()]
        const isSelected = date.toDateString() === selected.toDateString()
        return (
          <button
            key={date.toISOString()}
            onClick={() => {
              setSelected(date)
              onDateChange?.(date.toISOString().slice(0, 10))
            }}
            className={`px-3 py-1 rounded focus:outline-none transition-colors ${
              isSelected
                ? 'border-2 border-tomato-500 bg-white hover:bg-gray-100'
                : 'border border-transparent bg-white hover:bg-gray-200'
            }`}
          >
            <span className={isSelected ? 'font-semibold' : 'font-normal'}>
              {label}
            </span>
          </button>
        )
      })}

      {/* 이번주 */}
      <button
        onClick={() => setWeekOffset(0)}
        disabled={weekOffset === 0}
        className={`px-2 py-1 rounded focus:outline-none transition-opacity ${
          weekOffset === 0 ? 'opacity-50' : 'opacity-100 hover:opacity-80'
        }`}
      >
        &gt;&gt;
      </button>
    </div>
  )
}
