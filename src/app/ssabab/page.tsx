'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LunchSection from '@/components/ssabab/LunchSection'
import InsightSection from '@/components/ssabab/InsightSection'
import FriendsSection from '@/components/ssabab/FriendsSection'
import NoticeSection from '@/components/ssabab/NoticeSection'
import SectionTitle from '@/components/common/SectionTitle'
import ReviewButtonSection from '@/components/ssabab/ReviewButtonSection'

export default function SsababPage() {
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');

    if (accessToken) {
      const expires = new Date(Date.now() + 30 * 60 * 1000).toUTCString();
      document.cookie = `accessToken=${accessToken}; path=/; SameSite=Lax; expires=${expires}`;
      console.log('Access Token 저장됨:', accessToken);

      router.replace('/ssabab');
    }
  }, [router]);

  return (
    <main className="flex-1 pb-24 pt-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 min-w-0 space-y-6">
            <SectionTitle title="오늘의 점심, 어느 쪽이 더 기대되시나요?" />
            <LunchSection />
            <ReviewButtonSection />
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