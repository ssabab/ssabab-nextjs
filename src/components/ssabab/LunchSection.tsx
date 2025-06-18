'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { BiBowlRice } from 'react-icons/bi'
import { useMenuStore, dayLabels } from '@/stores/useMenuStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Menu, getMenu, preVote } from '@/lib/api'

export default function LunchSection() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  const {
    currentWeek,
    selectedDay,
    weekDates,
    isGoToLastWeekEnabled,
    isGoToThisWeekEnabled,
    setWeek,
    setSelectedDay,
    initializeStore,
  } = useMenuStore()

  // 컴포넌트 로컬 상태
  const [menus, setMenus] = useState<Menu[]>([])
  const [localVote, setLocalVote] = useState<'A'|'B'|null>(null)

  const todayKey = useMemo(() => {
    const d = new Date()
    return `lunchVote_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  }, [])

  // 투표 가능 여부 (00~12시)
  const hour = new Date().getHours()
  const canVote = hour < 12

  // 마운트 시 스토어 초기화, 저장된 투표 로드
  useEffect(() => {
    initializeStore()
    if (isAuthenticated) {
      const saved = localStorage.getItem(todayKey)
      if (saved === 'A' || saved === 'B') setLocalVote(saved)
    }
  }, [initializeStore, isAuthenticated, todayKey])

  // 요일 또는 주차 변경 시 로컬 메뉴 선택 상태 초기화
  useEffect(() => {
    const info = weekDates.find(d => d.dayKey === selectedDay)!
    const iso  = info.fullDate.toISOString().slice(0,10)

    getMenu(iso)
      .then(res => setMenus(res.data.menus))
      .catch(() => setMenus([]))
  }, [currentWeek, selectedDay, weekDates])

  // single-click: 하이라이트만 (로그인 & 조건 검증)
  const handleSelect = (opt: 'A'|'B') => {
    if (!isAuthenticated) return
    if (!canVote && localVote === null) return
    setLocalVote(opt)
  }

  // double-click: 실제 투표 (preVote 헬퍼 사용)
  const handleVote = useCallback(
    async (opt: 'A'|'B') => {
      if (!isAuthenticated || !canVote) return
      const idx = opt === 'A' ? 0 : 1
      const menu = menus[idx]
      if (!menu) return
      try {
        await preVote({ menuId: menu.menuId })
        localStorage.setItem(todayKey, opt)
        setLocalVote(opt)
        alert('투표 완료!')
      } catch {
        alert('투표에 실패했습니다.')
      }
    },
    [menus, canVote, isAuthenticated, todayKey]
  )

  return (
    <section className="bg-white rounded-lg shadow-md p-6 font-sans">
      {/* 주차 선택 UI */}
      <div className="flex justify-center items-center mb-6">
        <button
          onClick={() => setWeek('lastWeek')}
          disabled={!isGoToLastWeekEnabled}
          className={`
            p-2 rounded-full transition-colors duration-200 text-xl font-bold
            ${isGoToLastWeekEnabled ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed'}
          `}
          aria-label="저번 주 보기"
        >
          &lt;
        </button>
        <span className="text-2xl font-bold mx-4 font-sans">
          {currentWeek === 'thisWeek' ? '이번 주' : '저번 주'}
        </span>
        <button
          onClick={() => setWeek('thisWeek')}
          disabled={!isGoToThisWeekEnabled}
          className={`
            p-2 rounded-full transition-colors duration-200 text-xl font-bold
            ${isGoToThisWeekEnabled ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed'}
          `}
          aria-label="이번 주 보기"
        >
          &gt;
        </button>
      </div>

      {/* 요일 및 날짜 선택 그룹 */}
      <div className="flex justify-center items-center mb-6 border-b border-gray-200 pb-4">
        {weekDates.map(({ dayKey, date, fullDate }) => {
          const isToday = fullDate.toDateString() === new Date().toDateString()
          return (
            <button
              key={dayKey}
              onClick={() => setSelectedDay(dayKey)}
              className={`
                flex flex-col items-center justify-center p-2 mx-1.5 rounded-md
                transition-all duration-200 ease-in-out font-sans
                w-14 h-16 relative
                ${selectedDay === dayKey
                  ? 'bg-black text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <span className="text-sm font-semibold">{dayLabels[dayKey]}</span>
              <span className="text-lg font-bold">{date}</span>
              {isToday && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* 선택된 요일의 메뉴 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['A','B'] as const).map(opt => {
          const idx   = opt === 'A' ? 0 : 1
          const color = opt === 'A' ? 'blue' : 'green'
          const menu  = menus[idx]
          const items = menu?.foods.map(f => f.foodName) || []
          const isSel = localVote === opt

          return (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              onDoubleClick={() => handleVote(opt)}
              className={`cursor-pointer p-4 rounded-lg transition
                ${isSel
                  ? 'border-2 border-orange-500 bg-orange-100'
                  : 'border border-gray-100 hover:shadow-md' }`}
            >
              <div className={`w-12 h-12 mb-3 bg-${color}-100 rounded-full flex items-center justify-center`}>
                <BiBowlRice size={24} className={`text-${color}-600`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">메뉴 {opt}</h3>
              <ul className="list-disc list-inside text-sm">
                {items.length > 0
                  ? items.map((name, i) => <li key={i} className="py-0.5">{name}</li>)
                  : <li className="py-0.5 text-gray-400">메뉴 없음</li>}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  );
}