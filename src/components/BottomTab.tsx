"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { label: "싸밥", href: "/ssabab", icon: <span>⚫︎</span> },
  { label: "싸페", href: "/ssafe", icon: <span>⚫︎</span> },
  { label: "분석", href: "/analysis", icon: <span>⚫︎</span> },
  { label: "마이", href: "/mypage", icon: <span>⚫︎</span> },
]

export default function BottomTab() {
  const pathname = usePathname()

  return (
    <nav className="flex justify-around border-t px-2 py-2 bg-white">
      {tabs.map(({ label, href, icon }) => {
        const isActive = pathname === href

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center text-xs ${
              isActive ? "text-black font-semibold" : "text-gray-400"
            }`}
          >
            <div className="text-lg mb-1">{icon}</div>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
