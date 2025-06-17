'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MdOutlineRateReview } from 'react-icons/md'
import { useAuthStore } from '@/stores/useAuthStore'

export default function ReviewButtonSection() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    // 로그인돼 있고, 12시(정오) 이후 ~ 23시 사이일 때만 보여줌
    setShow(isAuthenticated && hour >= 12)
  }, [isAuthenticated])

  if (!show) return null

  return (
    <section className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center font-sans">
      <Link
        href="/review"
        className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-full text-lg font-bold
                   transition-all duration-300 ease-in-out
                   hover:bg-gray-800 hover:scale-105 hover:shadow-lg"
        aria-label="평가하러 가기"
      >
        <MdOutlineRateReview size={24} className="mr-3" />
        <span>오늘의 점심 평가하러 가기</span>
      </Link>
    </section>
  )
}