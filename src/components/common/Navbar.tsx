'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { getProfile } from '@/lib/api'
// LoginForm 컴포넌트 임포트 (이제 SocialLoginModal 역할을 함)
import { LoginForm } from '@/components/authentication/LoginForm'

// react-icons에서 필요한 아이콘 임포트
import { MdPerson, MdLogin } from 'react-icons/md'
import { BiBowlRice } from "react-icons/bi";
import { TbPresentationAnalytics } from "react-icons/tb"; // TbPresentationAnalytics 아이콘 임포트

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  // 1) 마운트 시 내 프로필 조회 → 로그인 여부 결정
  useEffect(() => {
    getProfile()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
  }, [])

  // 2) 마이페이지/로그인 클릭 핸들러
  const handleMyPageClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isLoggedIn) {
      router.push('/mypage')
    } else {
      setShowLogin(true) // 로그인 모달 표시
    }
  }

  return (
    <>
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-md">
        <nav className="w-full flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link href="/" aria-label="홈">
            <Image
              src="/icons/ssbab_logo.png"
              alt="SSABAB 로고"
              width={120}
              height={32}
            />
          </Link>

          {/* Tabs */}
          <div className="flex items-center space-x-6">
            {/* 싸밥 탭 (링크) - BiBowlRice 아이콘 사용 */}
            <Link
              href="/"
              aria-label="싸밥"
              className={`
                flex flex-col items-center justify-center
                pb-1 border-b-2 transition-colors
                ${pathname === '/'
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-600'}
              `}
            >
              <BiBowlRice size={24} /> {/* BiBowlRice 아이콘 사용 */}
              <span className="mt-1 text-sm">싸밥</span>
            </Link>

            {/* 분석 탭 (링크) - TbPresentationAnalytics 아이콘 사용 */}
            <Link
              href="/analysis"
              aria-label="분석"
              className={`
                flex flex-col items-center justify-center
                pb-1 border-b-2 transition-colors
                ${pathname === '/analysis'
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-600'}
              `}
            >
              <TbPresentationAnalytics size={24} /> {/* TbPresentationAnalytics 아이콘 사용 */}
              <span className="mt-1 text-sm">분석</span>
            </Link>

            {/* 마이/로그인 탭 (버튼) - 로그인 상태에 따라 아이콘 변경 */}
            <button
              onClick={handleMyPageClick}
              aria-label={isLoggedIn ? "마이페이지" : "로그인"}
              className={`
                flex flex-col items-center justify-center
                pb-1 border-b-2 transition-colors
                ${(pathname === '/mypage' && isLoggedIn) || (!isLoggedIn && showLogin) // 로그인 폼이 떠있을 때도 활성화되도록 조건 추가
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-600'}
              `}
            >
              {isLoggedIn ? (
                <MdPerson size={24} /> // 로그인 시 마이페이지 아이콘
              ) : (
                <MdLogin size={24} /> // 로그아웃 시 로그인 아이콘
              )}
              <span className="mt-1 text-sm">{isLoggedIn ? "마이" : "로그인"}</span>
            </button>
          </div>
        </nav>
      </header>

      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)} // 모달 닫기 함수를 prop으로 전달
        />
      )}
    </>
  )
}