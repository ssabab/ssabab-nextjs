"use client"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import MenuForm from "./MenuForm"
import MenuDeleteModal from "./MenuDeleteModal"
import { Menu, getMenu, postMenu, updateMenu, deleteMenu } from "@/lib/api"

const EMPTY_MENUS: Menu[] = [
  {
    menuId: 0,
    date: undefined,
    foods: Array(6).fill({ foodId: 0, foodName: "" }),  // FoodInfo 형태
  },
  {
    menuId: 0,
    date: undefined,
    foods: Array(6).fill({ foodId: 0, foodName: "" }),
  },
]

export default function AdminMenuPanel() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [menus, setMenus] = useState<Menu[]>(EMPTY_MENUS)
  const [hasExisting, setHasExisting] = useState(false)

  const formattedDate = format(selectedDate, "yyyy-MM-dd")


  useEffect(() => {
    if (!formattedDate) return
    getMenu(formattedDate)
      .then(res => {
        const arr = res.data.menus
        if (arr.length === 2) {
          setMenus(arr)
          setHasExisting(true)
        } else {
          setMenus(EMPTY_MENUS)
          setHasExisting(false)
        }
      })
      .catch(() => {
        setMenus(EMPTY_MENUS)
        setHasExisting(false)
      })
  }, [formattedDate])

  // 저장(등록/수정) 버튼
  const handleSubmit = useCallback(async () => {
    if (!formattedDate) return
    if (hasExisting) {
      await Promise.all(
        menus.map(menu => updateMenu(menu.menuId, { date: formattedDate, foods: menu.foods }))
      )
      alert("수정 완료")
    } else {
      // 새로 등록
      await Promise.all(
        menus.map(menu => postMenu({ date: formattedDate, foods: menu.foods }))
      )
      alert("등록 완료")
      setHasExisting(true)
    }
  }, [menus, formattedDate, hasExisting])

  // 삭제 버튼
  const handleDelete = useCallback(async () => {
    if (!formattedDate) return
    await Promise.all(menus.map(menu => deleteMenu(menu.menuId)))
    alert("삭제 완료")
    setMenus(EMPTY_MENUS)
    setHasExisting(false)
  }, [menus, formattedDate])


  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="max-w-md">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>

      {menus.length === 2 && (
        <>
          <MenuForm menus={menus} setMenus={setMenus} onSubmit={handleSubmit} />
          {hasExisting && <MenuDeleteModal onDelete={handleDelete} />}
        </>
      )}
    </div>
  )
}