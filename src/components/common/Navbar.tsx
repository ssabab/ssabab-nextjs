'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth, useAuthStore } from '@/stores/useAuthStore'
import { logout as apiLogout } from '@/lib/api'

// react-icons에서 필요한 아이콘 임포트
import { MdLogin, MdOutlineRateReview, MdOutlinePersonOutline, MdLogout } from 'react-icons/md' // MdOutlineRateReview, MdOutlinePersonOutline 아이콘 추가
import { BiBowlRice } from "react-icons/bi";
import { TbPresentationAnalytics } from "react-icons/tb";

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { initializeAuth, clearAuth } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [newFeature, setNewFeature] = useState(true); // 새 기능 알림 (예시)
  

  // 인증 상태 초기화
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // 스크롤 감지하여 Navbar 그림자 조절
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 로고 클릭 애니메이션을 위한 상태
  const [logoClicked, setLogoClicked] = useState(false);
  const handleLogoClick = () => {
    setLogoClicked(true);
    setTimeout(() => setLogoClicked(false), 500); // 0.5초 후 초기화
  };

  // **로그아웃 핸들러**: API 호출 후 스토어·라우터 처리
  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch {
      // 실패해도 토큰 클리어
    }
    clearAuth()
    router.push('/login')
  }

  return (
    <>
      {/* NAVBAR */}
      <header className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'}`}>
        <nav className="w-full flex items-center justify-between h-16 px-6">
          {/* Logo with animation */}
          <Link href="/" aria-label="홈" onClick={handleLogoClick}>
            <Image
              src="/icons/ssbab_logo.png"
              alt="SSABAB 로고"
              width={120}
              height={32}
              className={`transition-transform duration-300 ${logoClicked ? 'scale-105 rotate-3' : ''}`}
            />
          </Link>

          {/* Tabs */}
          <div className="flex items-center space-x-6">
            {/* 1. 싸밥 탭 */}
            <Link
              href="/"
              aria-label="싸밥"
              className={`
                flex flex-col items-center justify-center
                relative pb-1
                group
                transition-transform duration-200 hover:scale-105
              `}
            >
              <BiBowlRice size={24} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span className="mt-1 text-sm text-gray-800 font-medium">싸밥</span>
              <span className={`
                absolute bottom-0 left-0 h-[2px] bg-black
                transition-all duration-300 ease-out
                ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}
              `}></span>
            </Link>

            {/* 2. 평가 탭 (새로 추가) */}
            <Link
              href="/review"
              aria-label="평가"
              className={`
                flex flex-col items-center justify-center
                relative pb-1
                group
                transition-transform duration-200 hover:scale-105
              `}
            >
              <MdOutlineRateReview size={24} className="transition-transform duration-200 group-hover:-rotate-6" /> {/* 아이콘에 회전 효과 */}
              <span className="mt-1 text-sm text-gray-800 font-medium">평가</span>
              <span className={`
                absolute bottom-0 left-0 h-[2px] bg-black
                transition-all duration-300 ease-out
                ${pathname === '/review' ? 'w-full' : 'w-0 group-hover:w-full'}
              `}></span>
            </Link>

            {/* 3. 분석 탭 */}
            <Link
              href="/analysis"
              aria-label="분석"
              className={`
                flex flex-col items-center justify-center
                relative pb-1
                group
                transition-transform duration-200 hover:scale-105
              `}
            >
              <TbPresentationAnalytics size={24} className="transition-transform duration-200 group-hover:rotate-6" />
              <span className="mt-1 text-sm text-gray-800 font-medium">분석</span>
              <span className={`
                absolute bottom-0 left-0 h-[2px] bg-black
                transition-all duration-300 ease-out
                ${pathname === '/analysis' ? 'w-full' : 'w-0 group-hover:w-full'}
              `}></span>
              {newFeature && ( // 새 기능 뱃지
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full animate-pulse">
                  New
                </span>
              )}
            </Link>

            {/* 4. 로그인/마이페이지 탭 */}
            {isAuthenticated ? (
              <>
                <Link
                  href="/mypage"
                  aria-label="마이페이지"
                  className={`
                    flex flex-col items-center justify-center
                    relative pb-1
                    group
                    transition-transform duration-200 hover:scale-105
                  `}
                >
                  <MdOutlinePersonOutline size={24} className="transition-transform duration-200 group-hover:scale-110" />
                  <span className="mt-1 text-sm text-gray-800 font-medium">마이</span>
                  <span className={`
                    absolute bottom-0 left-0 h-[2px] bg-black
                    transition-all duration-300 ease-out
                    ${pathname === '/mypage' ? 'w-full' : 'w-0 group-hover:w-full'}
                  `}></span>
                </Link>

                {/* **로그아웃 버튼** → onClick 으로 처리 */}
                <button
                  onClick={handleLogout}
                  aria-label="로그아웃"
                  className="flex flex-col items-center justify-center relative pb-1 group transition-transform duration-200 hover:scale-105"
                >
                  <MdLogout size={24} className="transition-transform duration-200 group-hover:scale-110" />
                  <span className="mt-1 text-sm text-gray-800 font-medium">로그아웃</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                aria-label="로그인"
                className={`
                  flex flex-col items-center justify-center
                  relative pb-1
                  group
                  transition-transform duration-200 hover:scale-105
                `}
              >
                <MdLogin size={24} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                <span className="mt-1 text-sm text-gray-800 font-medium">로그인</span>
                <span className={`
                  absolute bottom-0 left-0 h-[2px] bg-black
                  transition-all duration-300 ease-out
                  ${pathname === '/login' ? 'w-full' : 'w-0 group-hover:w-full'}
                `}></span>
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  )
}