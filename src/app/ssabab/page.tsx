'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import LunchSection from '@/components/ssabab/LunchSection'
import InsightSection from '@/components/ssabab/InsightSection'
import FriendsSection from '@/components/ssabab/newFriendsSection'
import NoticeSection from '@/components/ssabab/NoticeSection'
import SectionTitle from '@/components/common/SectionTitle'

export default function SsababPage() {
  const router = useRouter()
  const { login, initializeAuth } = useAuthStore()

  useEffect(() => {
    // 페이지 로드 시 인증 상태 초기화
    initializeAuth()

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');

    if (accessToken) {
      // useAuthStore를 사용해서 로그인 처리
      login(accessToken);
      router.replace('/ssabab');
    }
  }, [router, login, initializeAuth]);

  return (
    <main className="flex-1 pb-24 pt-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 min-w-0 space-y-6">
            <SectionTitle title="오늘의 점심, 어느 쪽이 더 기대되시나요?" />
            <LunchSection />
          </div>
          <aside className="lg:col-span-4 min-w-0 space-y-6">
            <InsightSection />
            <FriendsSection />
            <NoticeSection />
          </aside>
        </div>
      </div>
    </main>
  )
}