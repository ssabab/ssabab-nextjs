'use client'

export default function FriendsSection() {
  const friendsData = [
    { name: 'A팀', percent: 72 },
    { name: 'B팀', percent: 28 },
  ]

  return (
    <section className="bg-white shadow rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold">동료별 선호도</h3>
      <ul className="space-y-2">
        {friendsData.map(({ name, percent }) => (
          <li key={name} className="flex items-center space-x-2">
            <span className="w-16 text-sm">{name}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-8 text-right text-sm">{percent}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
