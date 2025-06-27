import type { Metadata } from "next"
import Navbar from '@/components/common/Navbar'
import "./globals.css"

export const metadata: Metadata = {
  title: "ssabab",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow pt-16 pb-12">
          {children}
        </main>
      </body>
    </html>
  )
}
