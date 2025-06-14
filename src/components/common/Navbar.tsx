'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const tabs = [
  {
    label: '분석',
    href: "/analysis",
    icon: (
      <Image
        src="/icons/analysis.png"
        alt="analysis"
        width={50}
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
        alt="mypage"
        width={50}
        height={24}
        aria-hidden={true}
      />
    ),
  },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-md">
      <nav className="w-full flex items-center justify-between h-16 px-6">
        <Link href="/" aria-label="홈">
          <Image src="/icons/ssbab_logo.png" alt="logo" width={120} height={32} />
        </Link>

        <div className="flex items-center space-x-6">
          {tabs.map(({ label, href, icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={`
                  pb-1 border-b-2 transition-colors
                  ${isActive
                    ? 'border-black'
                    : 'border-transparent hover:border-gray-600'}
                `}
              >
                {icon}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
