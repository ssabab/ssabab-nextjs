'use client'

import LunchSection   from '@/components/ssabab/LunchSection'
import InsightSection from '@/components/ssabab/InsightSection'
import FriendsSection from '@/components/ssabab/FriendsSection'

export default function SsababPage() {
  return (
    <main className="min-h-screen pb-24 pt-6 px-4 bg-gray-50 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 min-w-0">
          <LunchSection />
        </div>

        <div className="space-y-4 lg:col-span-1 min-w-0">
          <InsightSection />
          <FriendsSection />
        </div>
      </div>
    </main>
  )
}

// TODO: 배열 다시 맞춰야 함
