"use client"

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LoginForm } from '@/components/authentication/LoginForm'

const tabs = [
  {
    label: '분석',
    href: "/analysis",
    icon: (
      <Image
        src="/icons/analysis.png"
        alt="분석 아이콘"
        width={24}
        height={24}
        aria-hidden={true}
      />
    ),
  },
  {
    label: '마이',
    href: "/mypage",
    icon: (
      <Image
        src="/icons/mypage.png"
        alt="마이 페이지 아이콘"
        width={24}
        height={24}
        aria-hidden={true}
      />
    ),
  },
]

export default function BottomTab() {
  const pathname = usePathname()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const isLoggedIn = false

  const handleClick = (href: string) => {
    if (href === '/mypage') {
      if (isLoggedIn) {
        router.push(href)
      } else {
        setShowLoginModal(true)
      }
    } else {
      router.push(href)
    }
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t bg-white px-2 py-2 z-50">
        {tabs.map(({ label, href, icon }) => {
          const isActive = pathname === href
          return (
            <button
              key={href}
              aria-label={label}
              onClick={() => handleClick(href)}
              className={`flex flex-col items-center text-xs ${
                isActive ? 'text-black font-semibold' : 'text-gray-400'
              }`}
            >
              <div className="mb-1">{icon}</div>
              <span className="sr-only">{label}</span>
            </button>
          )
        })}
      </nav>
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-opacity-30 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
          <div className="relative border border-gray-200 shadow-md bg-white rounded-lg p-6 max-w-md w-full z-10">
            <LoginForm className="w-full" />
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 px-4 py-2 rounded"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  )
}
