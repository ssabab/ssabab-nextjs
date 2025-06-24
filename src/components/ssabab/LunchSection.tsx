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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [todayISO, setTodayISO] = useState('')
  const [todayReview, setTodayReview] = useState<number | null>(null)
  const [todayVote, setTodayVote] = useState<number | null>(null)

  // menuId 받아오면 => prevote 업데이트
  useEffect(() => {
    setTodayISO(getKSTDateISO())
  }, [])

  useEffect(() => {
    setLoading(true)
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        setWeeklyMenus(parsed)
        const todayISO = getKSTDateISO()
        const todayIdx = parsed.findIndex((m: any) => m.date === todayISO)
        setSelectedIdx(todayIdx !== -1 ? todayIdx : 5)
        setLoading(false)
      } catch {}
    }
    getWeeklyMenuCached()
      .then(res => {
        setWeeklyMenus(res.data.weeklyMenus);
        localStorage.setItem(cacheKey, JSON.stringify(res.data.weeklyMenus))
        const todayISO = getKSTDateISO()
        const todayIdx = res.data.weeklyMenus.findIndex((m: any) => m.date === todayISO)
        setSelectedIdx(todayIdx !== -1 ? todayIdx : 5)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // 오늘 리뷰/투표 임시값 갱신 (오늘만 관리) 디버깅 해보기
  useEffect(() => {
    if (!todayISO) return
    // localStorage에서 오늘 리뷰/투표 정보 임시로만 관리
    const r = localStorage.getItem(`lunchReview_${todayISO}`)
    setTodayReview(r ? Number(r) : null)
    const v = localStorage.getItem(`lunchVote_${todayISO}`)
    setTodayVote(v ? Number(v) : null)
    console.log('[투표값] todayVote:', v, 'todayReview:', r)
  }, [todayISO])

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     setTodayMenus([])
  //     return
  //   }
  //   const todayISO = getKSTDateISO()
  //   getMenu(todayISO)
  //     .then(res => {
  //       setTodayMenus([res.data.menu1, res.data.menu2]) // [{menuId, foods}]
  //       console.log('[오늘 메뉴] todayMenus:', res.data.menu1, res.data.menu2)
  //     })
  //     .catch(() => setTodayMenus([]))
  // }, [isAuthenticated])

  // useEffect(() => {
  //   if (!isAuthenticated || !weeklyMenus.length || !todayISO) return
  //   const obj: { [date: string]: number | null } = {}
  //   weeklyMenus.forEach(menu => {
  //     const r = localStorage.getItem(`lunchReview_${menu.date}`)
  //     obj[menu.date] = r ? Number(r) : null
  //   })
  //   setReviewedMenus(obj)
  //   // const todayVote = localStorage.getItem(`lunchVote_${todayISO}`)
  //   // setLocalVote(todayVote ? Number(todayVote) : null)
  // }, [isAuthenticated, weeklyMenus, todayISO])

  const handleWeekChange = (toThisWeek: boolean) => {
    const offset = toThisWeek ? 5 : 0
    setSelectedIdx(offset + (selectedIdx % 5))
  }
  const handleDayChange = (dayIdx: number) => {
    const baseIdx = selectedIdx < 5 ? 0 : 5
    setSelectedIdx(baseIdx + dayIdx)
  }
console.log('selectedIdx', selectedIdx, 'todayISO', todayISO, 'todayVote', todayVote, 'todayReview', todayReview, 'weeklyMenus', weeklyMenus) 
  // 5. 렌더용 데이터
  const current = weeklyMenus[selectedIdx]
  const isToday = current?.date === todayISO

  // 오늘/주간 모두 menuId 기준으로 안전하게 메뉴 렌더
  const menus = useMemo(() => {
    if (!current) return []
    return [current.menu1, current.menu2].filter(Boolean)
  }, [current])

  // 6. 투표/리뷰 카드 액션
  const canVote = isToday && isAuthenticated && new Date().getHours() < 12

  // 오늘만 동작
  const handleSelect = (menuId: number) => {
    if (!isToday || !isAuthenticated) return
    if (!canVote) return
    if (todayVote && todayVote !== menuId) return
    setTodayVote(menuId)
    localStorage.setItem(`lunchVote_${todayISO}`, String(menuId))
    console.log('[투표됨] menuId:', menuId)
  }
  const handleVoteOrReview = (menuId: number) => {
    if (!isToday || !isAuthenticated) return
    const menu = menus.find(m => m.menuId === menuId)
    console.log('handleVoteOrReview', menuId, 'menu', menu)
    if (!menu) return
    if (new Date().getHours() >= 12) {
      if (todayReview && todayReview !== menuId) return
      localStorage.setItem(`lunchReview_${todayISO}`, String(menuId))
      setTodayReview(menuId)
      console.log('[리뷰됨] menuId:', menuId)
      router.push(`/review/${current.date}/${menuId}`)
      return
    }
    if (todayVote && todayVote !== menuId) return
    setTodayVote(menuId)
    localStorage.setItem(`lunchVote_${todayISO}`, String(menuId))
    console.log('[투표됨] menuId:', menuId)
    alert('투표 완료!')
  }

  // 8. 카드 클래스 (임팩트)
  const getCardClass = (menuId: number) => {
    if (!isToday || !isAuthenticated) return 'border border-gray-100 hover:shadow-md'
    if (todayReview !== null)
      return todayReview === menuId
        ? 'border-2 border-purple-500 bg-purple-100'
        : 'border border-gray-100 hover:shadow-md'
    if (todayVote !== null)
      return todayVote === menuId
        ? 'border-2 border-orange-500 bg-orange-100'
        : 'border border-gray-100 hover:shadow-md'
    return 'border border-gray-100 hover:shadow-md'
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

  if (loading) return <div className="text-center py-20">식단 정보를 불러오는 중입니다...</div>
  if (!weeklyMenus.length || selectedIdx >= weeklyMenus.length) {
    return <div className="text-center py-20">이번 주 식단 정보가 없습니다.</div>
  }

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
          const items = (menu.foods ?? []).map(f => f.foodName)
          const menuId = menu.menuId
          const cardClass = getCardClass(menuId)
          const disabled = !isToday || !isAuthenticated

          return (
            <div
              key={menuId}
              onClick={() => !disabled && handleSelect(menuId)}
              onDoubleClick={() => !disabled && handleVoteOrReview(menuId)}
              className={`cursor-pointer p-4 rounded-lg transition ${cardClass} relative`}
              style={{ pointerEvents: disabled ? 'none' : 'auto' }}
            >
              {isToday && todayReview === menuId && (
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
