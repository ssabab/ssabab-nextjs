"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import CalendarSelector from "@/components/admin/CalendarSelector"
import MenuRegisterForm from "@/components/admin/MenuRegisterForm"
import MenuEditForm from "@/components/admin/MenuEditForm"
import { useAuthStore } from "@/stores/useAuthStore"

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [menus, setMenus] = useState<any[]>([])
  const [checking, setChecking] = useState(true)

  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const initializeAuth = useAuthStore((s) => s.initializeAuth)

  useEffect(() => {
    initializeAuth()

    const verifyAccess = async () => {
      await new Promise((res) => setTimeout(res, 50))
      const latestToken = useAuthStore.getState().token

      if (!latestToken) {
        alert("로그인이 필요합니다.")
        router.replace("/login")
        return
      }

      try {
        const response = await axios.get("http://localhost:8080/admin", {
          headers: { Authorization: `Bearer ${latestToken}` },
        })

        if (response.data.accessLevel !== "admin") {
          alert("관리자 권한이 없습니다.")
          router.replace("/")
        } else {
          setChecking(false)
        }
      } catch (error) {
        console.error("관리자 권한 확인 실패:", error)
        alert("관리자 권한 확인 중 오류가 발생했습니다.")
        router.replace("/")
      }
    }

    verifyAccess()
  }, [router, initializeAuth])

  const handleMenuCheckResult = (date: string, menus: any[]) => {
    setSelectedDate(date)
    setMenus(menus)
  }

  const shouldRenderEdit =
    selectedDate !== null &&
    menus.length > 0 &&
    menus.some((menu) => menu.foods && menu.foods.length > 0)

  const shouldRenderRegister =
    selectedDate !== null &&
    (menus.length === 0 || menus.every((menu) => !menu.foods || menu.foods.length === 0))

  if (checking) return <div className="p-8">접근 권한 확인 중...</div>

  return (
    <div className="w-full px-6 py-8">
      <div className="flex gap-12 items-start">
        <div className="flex flex-col items-center justify-center min-w-[300px]">
          <CalendarSelector onMenuCheckResult={handleMenuCheckResult} />
          <p className="mt-4 text-sm text-gray-500">날짜를 선택해주세요</p>
        </div>

        <div className="flex-1">
          {shouldRenderEdit && (
            <MenuEditForm
              date={selectedDate!}
              menus={menus}
              onDelete={() => setMenus([])}
            />
          )}
          {shouldRenderRegister && (
            <MenuRegisterForm
              date={selectedDate!}
              onSuccess={(newMenus) => setMenus(newMenus)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
