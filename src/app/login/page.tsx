"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaGoogle } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/account/login`;
  }

  return (
    <main className="flex-1 pb-24 pt-20 bg-gray-50 font-sans min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-start justify-center min-h-[calc(100vh-160px)]">
          <div className="bg-white p-8 sm:p-10 rounded-lg shadow-md border border-gray-200 w-full max-w-md flex flex-col items-center text-center
                      transform transition-all duration-300 hover:shadow-lg">

            <div className="mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🍚</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">싸밥에 오신 것을 환영합니다!</h1>
              <p className="text-gray-600 text-sm">
                소셜 계정으로 간편하게 로그인하세요.
              </p>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-700 bg-white
                  group relative overflow-hidden
                  transition-all duration-300 ease-in-out
                  hover:bg-gray-50 hover:text-gray-900 hover:shadow-md hover:border-gray-400
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 mr-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                ) : (
                  <FaGoogle className="w-5 h-5 mr-3 text-red-500 transition-transform duration-200 group-hover:-translate-y-0.5" />
                )}
                Google로 계속하기
              </button>
            </div>
            
            <div className="flex items-center w-full my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">또는</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <button
              onClick={() => {
                alert('데모 모드: 게스트로 로그인되었습니다!')
                router.push('/')
              }}
              className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl font-medium
                transition-all duration-300 ease-in-out
                hover:bg-orange-600 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
            >
              게스트로 둘러보기
            </button>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-xs">
                로그인하면 <a href="/terms" className="text-orange-500 hover:underline transition-colors duration-200">이용약관</a> 및{' '}
                <a href="/privacy" className="text-orange-500 hover:underline transition-colors duration-200">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                문의사항: <a href="/help" className="text-orange-500 hover:underline transition-colors duration-200">도움말</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}