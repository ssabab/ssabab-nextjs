'use client'

import React, { useEffect, useState, useMemo } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/useAuthStore'

type FriendPreVote = {
  friendId: number
  friendName: string
  votedMenuId: number
  votedMenuInfo: { foodId: number; foodName: string }[]
  votedMenuDate: string
}

export default function FriendsSection() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const [loading, setLoading] = useState(false)
  const [dataByMenu, setDataByMenu] = useState<Record<number, number>>({})

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const isMorning = useMemo(() => new Date().getHours() < 12, [])

  useEffect(() => {
    if (!isAuthenticated) return

    setLoading(true)
    ;(async () => {
      try {
        if (isMorning) {
          // 사전 투표 결과
          const res = await api.get<{ votes: FriendPreVote[] }>(
            '/api/vote/friends',
            { params: { date: today } }
          )
          const counts: Record<number, number> = {}
          for (const { votedMenuId } of res.data.votes) {
            counts[votedMenuId] = (counts[votedMenuId] || 0) + 1
          }
          setDataByMenu(counts)
        } else {
          // 메뉴 평점 결과
          const res = await api.get<{
            reviews: { votedMenuId: number; averageMenuScore: number }[]
          }>(
            '/api/review/menu/friends',
            { params: { date: today } }
          )
          const sums: Record<number, { total: number; count: number }> = {}
          for (const { votedMenuId, averageMenuScore } of res.data.reviews) {
            const entry = sums[votedMenuId] || { total: 0, count: 0 }
            entry.total += averageMenuScore
            entry.count += 1
            sums[votedMenuId] = entry
          }
          const avgs: Record<number, number> = {}
          for (const menuIdStr in sums) {
            const menuId = Number(menuIdStr)
            const { total, count } = sums[menuId]
            avgs[menuId] = count > 0 ? total / count : 0
          }
          setDataByMenu(avgs)
        }
      } catch (e) {
        console.error(e)
        setDataByMenu({})
      } finally {
        setLoading(false)
      }
    })()
  }, [isAuthenticated, isMorning, today])

  // 비로그인 안내
  if (!isAuthenticated) {
    return (
      <section className="bg-white shadow rounded-lg p-6 font-sans text-center text-gray-500">
        로그인하시면 친구들의 밥 통계를 볼 수 있습니다!
      </section>
    )
  }

  // 로딩 중
  if (loading) {
    return (
      <section className="bg-white shadow rounded-lg p-6 font-sans text-center text-gray-400">
        로딩 중...
      </section>
    )
  }

  // 데이터 없을 때
  const menuIds = Object.keys(dataByMenu).map(id => Number(id))
  if (menuIds.length === 0) {
    return (
      <section className="bg-white shadow rounded-lg p-6 font-sans text-center text-gray-500">
        아직 친구들 데이터가 없습니다.
      </section>
    )
  }

  // 렌더링
  return (
    <section className="bg-white shadow rounded-lg p-6 space-y-4 font-sans">
      <h3 className="text-lg font-semibold text-gray-800">
        {isMorning ? '친구들의 사전 투표' : '친구들의 평균 평점'}
      </h3>

      <div className="flex justify-around items-center py-4">
        {menuIds.map(menuId => (
          <div key={menuId} className="flex flex-col items-center">
            <span className="text-xl font-bold text-gray-700">메뉴 {menuId}</span>
            <span className={`text-3xl font-extrabold mt-1 ${
              isMorning ? 'text-blue-600' : 'text-green-600'
            }`}>
              {isMorning
                ? `${dataByMenu[menuId]}명`
                : `${dataByMenu[menuId].toFixed(1)}점`}
            </span>
          </div>
        ))}
      </div>

      {isMorning ? (
        <p className="text-center text-gray-500 text-sm">
          총 {menuIds.reduce((sum, id) => sum + dataByMenu[id], 0)}명이 투표했어요!
        </p>
      ) : (
        <p className="text-center text-gray-500 text-sm">
          친구들의 리뷰를 바탕으로 계산된 평균 평점입니다!
        </p>
      )}
    </section>
  )
}
