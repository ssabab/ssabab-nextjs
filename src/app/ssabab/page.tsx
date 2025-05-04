import LunchSection from "@/components/ssabab/LunchSection"
import InsightSection from "@/components/ssabab/InsightSection"
import HistorySection from "@/components/ssabab/HistorySection"
import FriendsSection from "@/components/ssabab/FriendsSection"
import BottomTab from "@/components/BottomTab"

export default function SsababPage() {
  return (
    <main className="min-h-screen pb-24 px-4 pt-6 space-y-6 bg-gray-50">
      <LunchSection />
      <InsightSection />
      <HistorySection />
      <FriendsSection />
      <div className="fixed bottom-0 left-0 w-full bg-white border-t z-50">
        <BottomTab />
      </div>
    </main>
  )
}
