'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BiBowlRice } from 'react-icons/bi'
import { useAuthStore } from '@/stores/useAuthStore'
import { getWeeklyMenuCached, WeeklyMenu, preVote } from '@/lib/api'

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


  // 오늘 날짜 KST ISO
  useEffect(() => {
    setTodayISO(getKSTDateISO())
  }, [])

  // 00시(날짜 바뀔 때) 이전 투표/리뷰 값 자동 정리 (오늘 날짜만 남김)
  useEffect(() => {
    if (!todayISO) return
    // 모든 lunchVote_*, lunchReview_* 키 확인
    const removeOldKeys = (prefix: string) => {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix) && !key.endsWith(todayISO)) {
          localStorage.removeItem(key)
        }
      })
    }
    removeOldKeys('lunchVote_')
    removeOldKeys('lunchReview_')
  }, [todayISO])

  // 주간 메뉴 fetch + 캐시
  useEffect(() => {
    setLoading(true)
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) {
          setWeeklyMenus(parsed)
          const todayISO = getKSTDateISO()
          const todayIdx = parsed.findIndex((m: any) => m.date === todayISO)
          setSelectedIdx(todayIdx !== -1 ? todayIdx : 5)
        }
      } catch {}
      setLoading(false)
    }
    getWeeklyMenuCached()
      .then(res => {
        const menus = Array.isArray(res.data.weeklyMenus) ? res.data.weeklyMenus : []
        setWeeklyMenus(menus)
        localStorage.setItem(cacheKey, JSON.stringify(menus))
        const todayISO = getKSTDateISO()
        const todayIdx = menus.findIndex((m: any) => m.date === todayISO)
        setSelectedIdx(todayIdx !== -1 ? todayIdx : 5)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // 오늘 리뷰/투표 임시값 갱신 (오늘만 관리)
  useEffect(() => {
    if (!todayISO || !weeklyMenus[selectedIdx]) return
    const currDate = weeklyMenus[selectedIdx]?.date || todayISO
    const r = localStorage.getItem(`lunchReview_${currDate}`)
    setTodayReview(r ? Number(r) : null)
    const v = localStorage.getItem(`lunchVote_${currDate}`)
    setTodayVote(v ? Number(v) : null)
    console.log('[투표값] todayVote:', v, 'todayReview:', r)
  }, [todayISO, selectedIdx, weeklyMenus])

  const current = weeklyMenus[selectedIdx]
  const isToday = current?.date === todayISO
  const hour = new Date().getHours()

  // 메뉴 리스트
  const menus = useMemo(() => {
    if (!current) return []
    return [current.menu1, current.menu2].filter(m => m && m.menuId)
  }, [current])
  
  // 안내 메시지
  const infoMessage = useMemo(() => {
    if (isToday && hour < 12) return '더블 클릭하여 사전 투표에 참여해보세요!'
    if (isToday && hour < 23) return '드신 메뉴를 클릭하여 리뷰를 남겨보세요!'
    return null
  }, [isToday, hour])

  // 요일 버튼
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

  // 주차 이동, 요일 이동
  const handleWeekChange = (toThisWeek: boolean) => {
    const offset = toThisWeek ? 5 : 0
    setSelectedIdx(offset + (selectedIdx % 5))
  }
  const handleDayChange = (dayIdx: number) => {
    const baseIdx = selectedIdx < 5 ? 0 : 5
    setSelectedIdx(baseIdx + dayIdx)
  }

  // 투표/리뷰 액션(더블클릭)
  const handleVoteOrReview = async (menu) => {
    if (!isToday || !isAuthenticated) return
    if (hour < 12) {
      console.log(todayVote, menu.menuId)
      if (todayVote && todayVote !== menu.menuId) {        
        alert('이미 다른 메뉴에 투표하셨습니다.')
      }
      else if (todayVote && todayVote === menu.menuId) {
        alert('이미 투표되었습니다.')
      }
      else if (!todayVote) {
        // 최초 투표(post)
        await preVote({ menuId: menu.menuId })
        setTodayVote(menu.menuId)
        localStorage.setItem(`lunchVote_${todayISO}`, String(menu.menuId))
        alert('투표 완료!')
      }
      return
    }
    if (hour >= 12  && hour < 23) {
      // console.log(menu.menuId)
      // if (todayReview === menu.menuId) {
      //   const ok = window.confirm('기존에 작성한 리뷰가 초기화 됩니다. 다시 작성하시겠습니까?')
      //   if (!ok) return
      // }
      // if (todayReview && todayReview !== menu.menuId) return
      // localStorage.setItem(
      //   `reviewPage_menu_${current.date}_${menu.menuId}`,
      //   JSON.stringify(menu)
      // );
      // localStorage.setItem(`lunchReview_${todayISO}`, String(menu.menuId))
      // setTodayReview(menu.menuId)
      router.push(`/review/${current.date}/${menu.menuId}`)
    }
  }

  // 카드 임팩트 클래스
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

  // 데이터 로딩/정상여부 체크 후 렌더

  if (hour === 23) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 font-sans">
        <div className="flex justify-center items-center">
          데이터를 정리하고 있습니다! (23:00 ~ 00:59)
        </div>
      </section>
    )
  }

  if (loading || !weeklyMenus || weeklyMenus.length === 0) {
    return (
      <section className="flex flex-col justify-center items-center py-20">
        <div className="text-gray-500 text-lg font-medium mb-4">메뉴 정보를 불러오는 중...</div>
      </section>
    )
  }
  if (selectedIdx < 0 || selectedIdx >= weeklyMenus.length) {
    return (
      <section className="flex flex-col justify-center items-center py-20">
        <div className="text-gray-500 text-lg font-medium mb-4">유효한 날짜의 메뉴가 없습니다.</div>
      </section>
    )
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
              onDoubleClick={() => !disabled && handleVoteOrReview(menu)}
              className={`flex flex-col items-center justify-center cursor-pointer p-4 rounded-lg transition ${cardClass} relative w-full min-w-[220px] max-w-[430px] mx-auto`}
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
              <ul className="list-none list-inside text-sm">
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