'use client'

import React, { useEffect, useState, useMemo } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/useAuthStore'

// (1) 백엔드 구조에 맞는 타입
type FriendPreVote = {
  friendId: number
  friendName: string
  votedMenuId: number
  votedMenuInfo: { foodId: number; foodName: string }[]
  votedMenuDate: string
}

type FriendMenuReview = {
  friendId: number
  friendName: string
  votedMenuId: number
  votedMenuInfo: { foodId: number; foodName: string }[]
  votedMenuDate: string
  averageMenuScore: number
}

export default function FriendsSection() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const [loading, setLoading] = useState(false)
  // menuId별로 { count, names, menuFoods } 저장
  const [dataByMenu, setDataByMenu] = useState<Record<number, { count: number; names: string[]; menuFoods: string[] }>>({})
  const [reviewByMenu, setReviewByMenu] = useState<Record<number, { totalScore: number; count: number; menuFoods: string[]; friends: string[] }>>({})

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const isMorning = useMemo(() => new Date().getHours() < 12, [])

  const isVoteTime = isMorning

  const menuIds = useMemo(() => {
    return isVoteTime
      ? Object.keys(dataByMenu).map(Number)
      : Object.keys(reviewByMenu).map(Number)
  }, [isVoteTime, dataByMenu, reviewByMenu])

  useEffect(() => {
    if (!isAuthenticated) return
    setLoading(true)
    ;(async () => {
      try {
        if (isMorning) {
          // (2) 사전투표 결과(메뉴별, 친구이름별, 메뉴명까지 집계)
          const res = await api.get<{ votes: FriendPreVote[] }>(
            '/api/vote/friends',
            { params: { date: today } }
          )
          const counts: Record<number, { count: number; names: string[]; menuFoods: string[] }> = {}
          for (const vote of res.data.votes) {
            const id = vote.votedMenuId
            if (!counts[id]) {
              // 메뉴 이름: foodName 여러개면 쉼표로 연결(첫번째만 쓰고 싶으면 [0]만)
              const menuFoods = vote.votedMenuInfo.map(f => f.foodName)
              counts[id] = { count: 0, names: [], menuFoods }
            }
            counts[id].count += 1
            counts[id].names.push(vote.friendName)
          }
          setDataByMenu(counts)
        } else {
          // (3) 평점 결과 기존대로 사용
          const res = await api.get<{ reviews: FriendMenuReview[] }>(
            '/api/review/menu/friends',
            { params: { date: today } }
          )
          console.log('Friend reviews:', res.data.reviews)
          const byMenu: Record<number, { totalScore: number; count: number; menuFoods: string[]; friends: string[] }> = {}
          for (const r of res.data.reviews) {
            const id = r.votedMenuId
            if (!byMenu[id]) {
              byMenu[id] = { totalScore: 0, count: 0, menuFoods: r.votedMenuInfo.map(f => f.foodName), friends: [] }
            }
            byMenu[id].totalScore += r.averageMenuScore
            byMenu[id].count += 1
            byMenu[id].friends.push(r.friendName)
          }
          setReviewByMenu(byMenu)
        }
      } catch (e) {
        setDataByMenu({})
      } finally {
        setLoading(false)
      }
    })()
  }, [isAuthenticated, isMorning, today])

  if (!isAuthenticated) {
    return <section className="bg-white shadow rounded-lg p-6 font-sans text-center text-gray-500">로그인하시면 친구들의 밥 통계를 볼 수 있습니다!</section>
  }
  if (loading) {
    return <section className="bg-white shadow rounded-lg p-6 font-sans text-center text-gray-400">로딩 중...</section>
  }

  if (menuIds.length === 0) {
    return <section className="bg-white shadow rounded-lg p-6 font-sans text-center text-gray-500">아직 친구들 데이터가 없습니다.</section>
  }

  // (4) 렌더링에서 메뉴명/친구명까지 보여줌
  return (
    <section className="bg-white shadow rounded-lg p-6 space-y-4 font-sans">
      <h3 className="text-lg font-semibold text-gray-800">
        {isMorning ? '친구들의 사전 투표' : '친구들의 평균 평점'}
      </h3>

      <div className="flex justify-around items-center py-4">
{menuIds.map(menuId => {
  const menuData = isVoteTime ? dataByMenu[menuId] : reviewByMenu[menuId]
  // vote면 count, names, menuFoods 사용
  // review면 totalScore, count, menuFoods, friends 사용
  const avg = !isVoteTime && menuData.count > 0 ? (menuData.totalScore / menuData.count) : 0

  return (
    <div key={menuId} className="flex flex-col items-center w-40">
      <span className="text-xl font-bold text-gray-700 mb-2">메뉴 {menuId % 2 === 1 ? "A" : "B"}</span>
      <span className={`text-3xl font-extrabold mt-1 ${isVoteTime ? 'text-blue-600' : 'text-green-600'}`}>
        {isVoteTime ? `${menuData.count}명` : `${avg.toFixed(1)}점`}
      </span>
      {isVoteTime && (
        <ul className="mt-2 text-xs text-gray-500 max-h-20 overflow-auto text-center">
          {menuData.names.map(friend => <li key={friend}>{friend}</li>)}
        </ul>
      )}
    </div>
  )
})}
      </div>
      {isMorning ? (
        <p className="text-center text-gray-500 text-sm">
          총 {menuIds.reduce((sum, id) => sum + dataByMenu[id].count, 0)}명이 투표했어요!
        </p>
      ) : (
        <p className="text-center text-gray-500 text-sm">
          친구들의 리뷰를 바탕으로 계산된 평균 평점입니다!
        </p>
      )}
    </section>
  )
}