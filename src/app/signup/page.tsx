'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import { useAuthStore } from '@/stores/useAuthStore'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    ssafyGeneration: '',
    ssafyRegion: '대전',
    ssafyClass: '',
    gender: '',
    birthDate: ''
  })
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const signup = useAuthStore((s) => s.signup)

  useEffect(() => {
    // const params = new URLSearchParams(window.location.search);
    // const email = params.get('email') || '';
    // const provider = params.get('provider') || '';
    // const providerId = params.get('providerId') || '';
    // const profileImage = params.get('profileImage') || '';
    // const socialNameFromUrl = params.get('username') || '';
    // setSocialData({
    //   email,
    //   provider,
    //   providerId,
    //   profileImage,
    //   name: decodeURIComponent(socialNameFromUrl)
    // });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // 날짜 형식 검증 (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/
    
    // 입력값이 비어있지 않고 패턴에 맞지 않으면 이전 값 유지
    if (value && !datePattern.test(value)) {
      // 연도가 4자리를 초과하지 않도록 제한
      if (value.length > 10) {
        value = value.substring(0, 10)
      }
    }
    
    // 연도 범위 검증 (1900-2024)
    if (value && datePattern.test(value)) {
      const year = parseInt(value.split('-')[0])
      if (year < 1900 || year > 2024) {
        alert('올바른 연도를 입력해주세요 (1900-2024)')
        return
      }
    }
    
    setFormData(prev => ({
      ...prev,
      birthDate: value
    }))
  }

  const handleGenderChange = (gender: string) => {
    setFormData(prev => ({
      ...prev,
      gender
    }))
  }

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    try {
      await signup(formData.username, password, formData.nickname)
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.")
      router.push("/login")
    } catch (err) {
      console.error("회원가입 실패:", err)
      alert("회원가입에 실패했습니다. 입력 정보를 확인해주세요.")
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <main className="flex-1 pb-24 pt-20 bg-gray-50 font-sans min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-md relative">
            
            {/* 뒤로가기 버튼 */}
            <button
              onClick={handleGoBack}
              className="absolute top-6 left-6 p-2 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="뒤로가기"
            >
              <FaArrowLeft size={20} />
            </button>

            {/* 제목 */}
            <div className="text-center mb-8 mt-4">
              <h1 className="text-2xl font-bold text-gray-800">회원가입</h1>
            </div>

            {/* 회원가입 폼 */}
            <form onSubmit={handleSignup} className="space-y-6">
              
              {/* 유저명 입력 */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  아이디
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="아이디를 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                />
              </div>

              {/* 닉네임 입력 */}
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="닉네임을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                />
              </div>

              {/* 싸피 기수 입력 */}
              <div>
                <label htmlFor="ssafyGeneration" className="block text-sm font-medium text-gray-700 mb-2">
                  싸피 기수
                </label>
                <input
                  type="number"
                  id="ssafyGeneration"
                  name="ssafyGeneration"
                  value={formData.ssafyGeneration}
                  onChange={handleInputChange}
                  placeholder="기수를 입력하세요 (예: 11)"
                  min="1"
                  max="99"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                />
              </div>

              {/* 싸피 반 입력 */}
              <div>
                <label htmlFor="ssafyClass" className="block text-sm font-medium text-gray-700 mb-2">
                  싸피 반
                </label>
                <input
                  type="number"
                  id="ssafyClass"
                  name="ssafyClass"
                  value={formData.ssafyClass}
                  onChange={handleInputChange}
                  placeholder="반을 입력하세요 (예: 1)"
                  min="1"
                  max="99"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                />
              </div>

              {/* 성별 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성별
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={() => handleGenderChange('male')}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">남성</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={() => handleGenderChange('female')}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">여성</span>
                  </label>
                </div>
              </div>

              {/* 생년월일 입력 */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  생년월일
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleBirthDateChange}
                  min="1900-01-01"
                  max="2024-12-31"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">YYYY-MM-DD 형식으로 입력됩니다 (1900-2024)</p>
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                />
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                />
              </div>

              {/* 회원가입 완료 버튼 */}
              <button
                type="submit"
                className="w-full px-4 py-4 bg-gray-600 text-white rounded-lg font-medium text-lg
                  transition-all duration-300 ease-in-out
                  hover:bg-gray-700 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                회원가입 완료하기
              </button>

            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
