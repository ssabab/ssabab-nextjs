import SectionTitle from "@/components/common/SectionTitle"

const friends = Array.from({ length: 5 })

export default function FriendsSection() {
  return (
    <section className="space-y-3">
      <SectionTitle title="동료들의 선택" />
      <div className="flex items-center gap-4">
        {friends.map((_, idx) => (
          <div
            key={idx}
            className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
          >
            👤
          </div>
        ))}
      </div>
    </section>
  )
}
