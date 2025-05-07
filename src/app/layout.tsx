import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ssabab",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
