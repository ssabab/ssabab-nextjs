'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import MenuForm from './MenuForm'
import MenuDeleteModal from './MenuDeleteModal'
import {
  getMenu,
  postMenu,
  updateMenu,
  deleteMenu,
} from '@/lib/api'

type Food = {
  foodName: string
  mainSub: string
  category: string
  tag: string
}

type Menu = {
  menuId?: number
  date?: string
  foods: Food[]
}

const EMPTY_MENUS: Menu[] = [
  { foods: Array(6).fill({ foodName: '', mainSub: '', category: '', tag: '' }) },
  { foods: Array(6).fill({ foodName: '', mainSub: '', category: '', tag: '' }) },
]

export default function AdminMenuPanel() {
  const [selectedDate, setSelectedDate]       = useState(new Date())
  const [menus, setMenus]                     = useState<Menu[]>(EMPTY_MENUS)
  const [hasExisting, setHasExisting]         = useState(false)

  const formattedDate = format(selectedDate, 'yyyy-MM-dd')

  // — GET /api/menu?date=YYYY-MM-DD
  useEffect(() => {
    getMenu(formattedDate)
      .then(res => {
        const data = res.data.menus
        if (Array.isArray(data) && data.length === 2) {
          setMenus(data)
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

  // — POST or PUT
  const handleSubmit = useCallback(async () => {
    const payloads = menus.map(menu => ({
      date: formattedDate,
      foods: menu.foods,
    }))

    if (hasExisting) {
      // PUT /api/menu/{menuId}
      await Promise.all(
        menus.map(menu =>
          updateMenu(menu.menuId!, { date: formattedDate, foods: menu.foods })
        )
      )
      alert('수정 완료')
    } else {
      // POST /api/menu
      const created = await Promise.all(
        payloads.map(body => postMenu(body))
      )
      // 서버가 반환해 준 menuId 등을 state에 반영하고 싶다면:
      setMenus(created.map(r => r.data))
      setHasExisting(true)
      alert('등록 완료')
    }
  }, [menus, hasExisting, formattedDate])

  // — DELETE /api/menu/{menuId}
  const handleDelete = useCallback(async () => {
    await Promise.all(
      menus
        .filter(menu => menu.menuId != null)
        .map(menu => deleteMenu(menu.menuId!))
    )
    alert('삭제 완료')
    setMenus(EMPTY_MENUS)
    setHasExisting(false)
  }, [menus])

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
          <MenuForm
            menus={menus}
            setMenus={setMenus}
            onSubmit={handleSubmit}
          />
          {hasExisting && (
            <MenuDeleteModal onDelete={handleDelete} />
          )}
        </>
      )}
    </div>
  )
}
