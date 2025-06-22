'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth, useAuthStore } from '@/stores/useAuthStore'
import { logout as apiLogout } from '@/lib/api'

import {
  MdLogin,
  MdOutlinePersonOutline,
  MdLogout,
} from 'react-icons/md'
import { BiBowlRice } from 'react-icons/bi'
import { TbPresentationAnalytics } from 'react-icons/tb'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { initializeAuth, clearAuth } = useAuthStore()

  const [scrolled, setScrolled] = useState(false)
  const [logoClicked, setLogoClicked] = useState(false)

  const newFeature = true

  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)
  const handleLogoClick = () => {
    setLogoClicked(true)
    clickTimerRef.current = setTimeout(() => setLogoClicked(false), 500)
  }

  /* cleanup */ 
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    }
  }, [])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  /* ------------------------------ ④ 스크롤 그림자 ------------------------------ */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll, { passive: true }) // passive 옵션
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ------------------------------ ⑤ 로그아웃 ------------------------------ */
  const handleLogout = async () => {
    try {
      await apiLogout()
      // TODO: 로딩/에러 토스트 처리 등 UX 개선
    } catch {
      console.error('로그아웃 실패')
    }
    clearAuth()
    router.push('/login')
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-lg' : 'shadow-md'
        }`}
      >
        <nav className="w-full flex items-center justify-between h-16 px-6">
          <Link href="/" aria-label="홈" onClick={handleLogoClick}>
            <Image
              src="/icons/ssbab_logo.png"
              alt="SSABAB 로고"
              width={120}
              height={32}
              priority                               /* LCP 최적화 */
              className={`transition-transform duration-300 ${
                logoClicked ? 'scale-105 rotate-3' : ''
              }`}
            />
          </Link>

          {/* Tabs */}
          <div className="flex items-center space-x-6">

            <Link
              href="/"
              aria-label="싸밥"
              className="
                flex flex-col items-center relative pb-1 group
                transition-transform duration-200 hover:scale-105
              "
            >
              <BiBowlRice
                size={24}
                className="transition-transform duration-200 group-hover:-translate-y-0.5"
              />
              <span className="mt-1 text-sm text-gray-800 font-medium">싸밥</span>
              <span
                className={`
                  absolute bottom-0 left-0 h-[2px] bg-black
                  transition-all duration-300 ease-out
                  ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}
                `}
              />
            </Link>

            <Link
              href="/analysis"
              aria-label="분석"
              className="
                flex flex-col items-center relative pb-1 group
                transition-transform duration-200 hover:scale-105
              "
            >
              <TbPresentationAnalytics
                size={24}
                className="transition-transform duration-200 group-hover:rotate-6"
              />
              <span className="mt-1 text-sm text-gray-800 font-medium">분석</span>
              <span
                className={`
                  absolute bottom-0 left-0 h-[2px] bg-black
                  transition-all duration-300 ease-out
                  ${pathname === '/analysis' ? 'w-full' : 'w-0 group-hover:w-full'}
                `}
              />
              {newFeature && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full animate-pulse"
                  aria-label="새로운 기능"
                >
                  New
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/my"
                  aria-label="마이페이지"
                  className="
                    flex flex-col items-center relative pb-1 group
                    transition-transform duration-200 hover:scale-105
                  "
                >
                  <MdOutlinePersonOutline
                    size={24}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                  <span className="mt-1 text-sm text-gray-800 font-medium">마이</span>
                  <span
                    className={`
                      absolute bottom-0 left-0 h-[2px] bg-black
                      transition-all duration-300 ease-out
                      ${pathname === '/my' ? 'w-full' : 'w-0 group-hover:w-full'}
                    `}
                  />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="로그아웃"
                  className="
                    flex flex-col items-center relative pb-1 group
                    transition-transform duration-200 hover:scale-105
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-offset-2 focus-visible:ring-black
                  "
                >
                  <MdLogout
                    size={24}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                  <span className="mt-1 text-sm text-gray-800 font-medium">로그아웃</span>
                  <span
                    className="
                      absolute bottom-0 left-0 h-[2px] bg-black
                      transition-all duration-300 ease-out w-0 group-hover:w-full
                    "
                  />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                aria-label="로그인"
                className="
                  flex flex-col items-center relative pb-1 group
                  transition-transform duration-200 hover:scale-105
                "
              >
                <MdLogin
                  size={24}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
                <span className="mt-1 text-sm text-gray-800 font-medium">로그인</span>
                <span
                  className={`
                    absolute bottom-0 left-0 h-[2px] bg-black
                    transition-all duration-300 ease-out
                    ${pathname === '/login' ? 'w-full' : 'w-0 group-hover:w-full'}
                  `}
                />
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  )
}
