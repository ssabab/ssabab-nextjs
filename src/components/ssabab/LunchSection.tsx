'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BiBowlRice } from 'react-icons/bi'
import { useAuthStore } from '@/stores/useAuthStore'
import { getWeeklyMenuCached , WeeklyMenu } from '@/lib/api'

const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as const
const dayKor = ['월', '화', '수', '목', '금']
const cardColors = ['blue', 'green']
const cacheKey = 'weeklyMenusCache'

function getKSTDateISO(date?: Date) {
  const now = date ?? new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
}

export default function LunchSection() {
  const router = useRouter()
  const [weeklyMenus, setWeeklyMenus] = useState<WeeklyMenu[]>([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reviewedMenus, setReviewedMenus] = useState<{ [date: string]: number | null }>({})
  const [localVote, setLocalVote] = useState<number | null>(null)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [todayISO, setTodayISO] = useState('')


  // menuId 받아오면 => prevote 업데이트
  useEffect(() => {
    setTodayISO(getKSTDateISO())
  }, [])


  useEffect(() => {
    setLoading(true)
    getWeeklyMenuCached()
      .then(res => {
        setWeeklyMenus(res.data.weeklyMenus);
        localStorage.setItem(cacheKey, JSON.stringify(res.data.weeklyMenus))
        const todayISO = new Date().toISOString().slice(0, 10)
        const todayIdx = res.data.weeklyMenus.findIndex(m => m.date === todayISO)
        setSelectedIdx(todayIdx !== -1 ? todayIdx : 5)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !weeklyMenus.length || !todayISO) return
    const obj: { [date: string]: number | null } = {}
    weeklyMenus.forEach(menu => {
      const r = localStorage.getItem(`lunchReview_${menu.date}`)
      obj[menu.date] = r ? Number(r) : null
    })
    setReviewedMenus(obj)
    const todayVote = localStorage.getItem(`lunchVote_${todayISO}`)
    setLocalVote(todayVote ? Number(todayVote) : null)
  }, [isAuthenticated, weeklyMenus, todayISO])

  const handleWeekChange = (toThisWeek: boolean) => {
    const offset = toThisWeek ? 5 : 0
    setSelectedIdx(offset + (selectedIdx % 5))
  }
  const handleDayChange = (dayIdx: number) => {
    const baseIdx = selectedIdx < 5 ? 0 : 5
    setSelectedIdx(baseIdx + dayIdx)
  }

  const current = weeklyMenus[selectedIdx]
  const menus = useMemo(() => (current ? [current.menu1, current.menu2] : []), [current])
  const isToday = current?.date === todayISO
  const canVote = isToday && new Date().getHours() < 12

  // 오늘만 동작
  const handleSelect = (menuId: number) => {
    if (!isToday) return
    if (!isAuthenticated) return
    if (!canVote && localVote === null) return
    if (reviewedMenus[current.date] && reviewedMenus[current.date] !== menuId) return
    setLocalVote(menuId)
  }
  const handleVoteOrReview = (menuId: number) => {
    if (!isToday) return
    if (!isAuthenticated) return
    const menu = menus.find(m => m.menuId === menuId)
  if (!menu) return
  if (new Date().getHours() >= 12) {
      if (reviewedMenus[current.date] && reviewedMenus[current.date] !== menuId) return
      router.push(`/review/${current.date}/${menuId}`)
      return
    }
    localStorage.setItem(`lunchVote_${current.date}`, String(menuId))
    setLocalVote(menuId)
    alert('투표 완료!')
  }

  const infoMessage = useMemo(() => {
    if (isToday && new Date().getHours() < 12) return '더블 클릭하여 사전 투표에 참여해보세요!'
    if (isToday && new Date().getHours() < 23) return '드신 메뉴를 클릭하여 리뷰를 남겨보세요!'
    return null
  }, [isToday])

  const weekDayButtons = useMemo(() => {
    const baseIdx = selectedIdx < 5 ? 0 : 5
    return weekDays.map((day, idx) => {
      const menu = weeklyMenus[baseIdx + idx]
      if (!menu) return null
      const isSelected = selectedIdx === baseIdx + idx
      const isCurrentToday = menu.date === todayISO
      return (
        <button
          key={menu.date}
          onClick={() => handleDayChange(idx)}
          className={`flex flex-col items-center justify-center p-2 mx-1.5 rounded-md w-14 h-16
            ${isSelected ? 'bg-black text-white shadow-md scale-105' : 'text-gray-700 hover:bg-gray-100'}
            relative
          `}
          disabled={loading}
        >
          <span className="text-sm font-semibold">{dayKor[idx]}</span>
          <span className="text-lg font-bold">{menu.date.slice(8, 10)}</span>
          {isCurrentToday && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" />
          )}
        </button>
      )
    })
  }, [weeklyMenus, selectedIdx, todayISO, loading])

  return (
    <section className="bg-white rounded-lg shadow-md p-6 font-sans">
      {infoMessage && (
        <p className="text-sm text-gray-500 mb-4 text-center">
          {infoMessage}
        </p>
      )}
      {/* 주차 선택 */}
      <div className="flex justify-center items-center mb-6">
        <button
          onClick={() => handleWeekChange(false)}
          disabled={selectedIdx < 5}
          className={`p-2 rounded-full text-xl font-bold ${selectedIdx < 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
        >&lt;</button>
        <span className="text-2xl font-bold mx-4 font-sans">
          {selectedIdx < 5 ? '저번 주' : '이번 주'}
        </span>
        <button
          onClick={() => handleWeekChange(true)}
          disabled={selectedIdx >= 5}
          className={`p-2 rounded-full text-xl font-bold ${selectedIdx >= 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
        >&gt;</button>
      </div>
      <div className="flex justify-center items-center mb-6 border-b border-gray-200 pb-4">
        {weekDayButtons}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menus.map((menu, idx) => {
          if (!menu) return null
          const menuId = menu.menuId
          const items = menu.foods.map(f => f.foodName)
          const isSel = isToday && localVote === menuId
          const isReviewed = isToday && reviewedMenus[current?.date ?? ''] === menuId
          const disabled = !isToday

          const hoverCls = disabled ? '' : 'hover:shadow-md'
          const baseBorder = 'border border-gray-100'
          const wrapperCls = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          const highlightCls = isReviewed
            ? 'border-2 border-purple-500 bg-purple-100'
            : isSel
              ? 'border-2 border-orange-500 bg-orange-100'
              : `${baseBorder} ${hoverCls}`

          return (
            <div
              key={menuId}
              onClick={() => !disabled && handleSelect(menuId)}
              onDoubleClick={() => !disabled && handleVoteOrReview(menuId)}
              className={`${wrapperCls} p-4 rounded-lg transition ${highlightCls} relative`}
              style={{ pointerEvents: disabled ? 'none' : 'auto' }}
            >
              {isReviewed && (
                <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                  리뷰되었습니다!
                </span>
              )}
              <div className={`w-12 h-12 mb-3 bg-${cardColors[idx]}-100 rounded-full flex items-center justify-center`}>
                <BiBowlRice size={24} className={`text-${cardColors[idx]}-600`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">메뉴 {idx === 0 ? 'A' : 'B'}</h3>
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
