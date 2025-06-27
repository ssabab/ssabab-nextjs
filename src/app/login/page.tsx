'use client' // 클라이언트 컴포넌트로 지정

import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // 브라우저를 백엔드 로그인 엔드포인트로 직접 리디렉션하여 Google OAuth 흐름 시작
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/account/login`;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-2">로그인</h1>
        <p className="text-gray-600 mb-6">다양한 식단 평가와 추천을 받아보세요.</p>
        
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {isLoading ? (
            '로그인 중...'
          ) : (
            <>
              <FcGoogle className="h-5 w-5" />
              <span>Google 계정으로 로그인</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}