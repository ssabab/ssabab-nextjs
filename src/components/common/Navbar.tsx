'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { getProfile } from '@/lib/api'
import { LoginForm } from '@/components/authentication/LoginForm'

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

  // 2) 마이페이지 클릭 핸들러
  const handleMyPageClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isLoggedIn) {
      router.push('/mypage')
    } else {
      setShowLogin(true)
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
            {/* 분석 탭 (링크) */}
            <Link
              href="/analysis"
              aria-label="분석"
              className={`
                pb-1 border-b-2 transition-colors
                ${pathname === '/analysis'
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-600'}
              `}
            >
              <Image
                src="/icons/analysis.png"
                alt=""
                width={50}
                height={24}
                aria-hidden
              />
            </Link>

            {/* 마이 탭 (버튼) */}
            <button
              onClick={handleMyPageClick}
              aria-label="마이페이지"
              className={`
                pb-1 border-b-2 transition-colors
                ${pathname === '/mypage'
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-600'}
              `}
            >
              <Image
                src="/icons/mypage.png"
                alt=""
                width={50}
                height={24}
                aria-hidden
              />
            </button>
          </div>
        </nav>
      </header>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLogin(false)}
        >
          {/* 안쪽 영역 클릭은 모달 닫기 방지 */}
          <div onClick={(e) => e.stopPropagation()}>
            <LoginForm
              className="max-w-sm w-full"
              // LoginForm에 직접 onClose prop은 없으니
              // 외부에서 감싸는 이 레이어로 닫기 처리합니다.
            />
          </div>
        </div>
      )}
    </>
  )
}