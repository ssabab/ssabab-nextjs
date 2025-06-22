'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BiBowlRice } from 'react-icons/bi'
import { useMenuStore, dayLabels } from '@/stores/useMenuStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Menu, getMenu, preVote, updatePreVote } from '@/lib/api'

export default function LunchSection() {
  const router = useRouter() 
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
  const [reviewedMenu, setReviewedMenu] = useState<'A'|'B'|null>(null)

  const todayKey = useMemo(() => {
    const d = new Date()
    return `lunchVote_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  }, [])

  const reviewKey = useMemo(() => todayKey.replace('lunchVote', 'lunchReview'), [todayKey])

  const hour = new Date().getHours()
  const canVote = hour < 12

  const isViewingToday = useMemo(() => {
    const info = weekDates.find(d => d.dayKey === selectedDay)!
    return info.fullDate.toDateString() === new Date().toDateString()
  }, [selectedDay, weekDates])

  if (hour >= 23) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 font-sans text-center">
        <p className="text-lg font-semibold">데이터를 정리하고 있습니다! (23:00 - 00:00)</p>
      </section>
    )
  }

  // 마운트 시 스토어 초기화, 저장된 투표 로드
  useEffect(() => {
    initializeStore()
    if (isAuthenticated) {
      const v = localStorage.getItem(todayKey)
      if (v==='A'||v==='B') setLocalVote(v)
      const r = localStorage.getItem(reviewKey)
      if (r==='A'||r==='B') setReviewedMenu(r)
    }
  }, [initializeStore, isAuthenticated, todayKey, reviewKey])

  // 요일 또는 주차 변경 시 로컬 메뉴 선택 상태 초기화
  useEffect(() => {
    const info = weekDates.find(d => d.dayKey === selectedDay)!
    const iso  = info.fullDate.toISOString().slice(0,10)

    getMenu(iso)
      .then(res => {
        setMenus(res.data.menus)
        const rk = `lunchReview_${iso}`
        const rv = localStorage.getItem(rk)
        setReviewedMenu(rv==='A'||rv==='B' ? rv : null)
      })
      .catch(() => {
        setMenus([])
        setReviewedMenu(null)
      })
  }, [currentWeek, selectedDay, weekDates])

  // single-click: 하이라이트만 (리뷰된 다른 옵션은 무시, 오늘이 아닐 땐 무시)
  const handleSelect = (opt: 'A'|'B') => {
    if (!isViewingToday) return
    if (!isAuthenticated) return
    if (!canVote && localVote === null) return
    if (reviewedMenu && reviewedMenu !== opt) return
    setLocalVote(opt)
  }
  
  // double-click: 투표 or 리뷰 페이지 로드 (오늘이 아닐 땐 무시)
  const handleVote = useCallback(
    async (opt: 'A'|'B') => {
      if (!isViewingToday) return

      const idx = opt === 'A' ? 0 : 1
      const menu = menus[idx]
      if (!menu) return

      if (hour >= 12) {
        if (reviewedMenu && reviewedMenu !== opt) return
        router.push(`/review/${menu.menuId}`)
        return
      }

      if (!isAuthenticated) return

      try {
        if (localVote && localVote !== opt) {
          await updatePreVote({ menuId: menu.menuId })
        } else {
          await preVote({ menuId: menu.menuId })
        }
        localStorage.setItem(todayKey, opt)
        setLocalVote(opt)
        alert('투표 완료!')
      } catch {
        alert('투표에 실패했습니다.')
      }
    },
    [menus, hour, isAuthenticated, localVote, reviewedMenu, router, todayKey, isViewingToday]
  )

  const infoMessage = useMemo(() => {
    if (hour < 12) return '더블 클릭하여 사전 투표에 참여해보세요!'
    if (hour < 23) return '드신 메뉴를 클릭하여 리뷰를 남겨보세요!'
    return null
  }, [hour])


  return (
    <section className="bg-white rounded-lg shadow-md p-6 font-sans">
      {infoMessage && (
        <p className="text-sm text-gray-500 mb-4 text-center">
          {infoMessage}
        </p>
      )}
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
          const menu = menus?.[idx] ?? { foods: [] }
          const items = menu.foods.map(f => f.foodName)
          const isSel = localVote === opt
          const isReviewed = reviewedMenu===opt
          const disabled   = !isViewingToday || (reviewedMenu !== null && reviewedMenu !== opt)

          const hoverCls   = disabled ? '' : 'hover:shadow-md'
          const baseBorder = 'border border-gray-100'
          const wrapperCls = disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
          const highlightCls = isReviewed
            ? 'border-2 border-purple-500 bg-purple-100'
            : isSel
              ? 'border-2 border-orange-500 bg-orange-100'
              : `${baseBorder} ${hoverCls}`

          return (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              onDoubleClick={() => handleVote(opt)}
              className={`${wrapperCls} p-4 rounded-lg transition ${highlightCls} relative`}
            >
              {isReviewed && (
                <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                  리뷰되었습니다!
                </span>
              )}
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
  )
}