"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import axios from "axios"
import { Calendar } from "@/components/ui/calendar"
import MenuForm from "./MenuForm"
import MenuDeleteModal from "./MenuDeleteModal"

type Food = {
  foodName: string
  mainSub: string
  category: string
  tag: string
}

type Menu = { foods: Food[] }

const EMPTY_MENUS: Menu[] = [
  { foods: Array(6).fill({ foodName: "", mainSub: "", category: "", tag: "" }) },
  { foods: Array(6).fill({ foodName: "", mainSub: "", category: "", tag: "" }) }
]

export default function AdminMenuPanel() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [menus, setMenus] = useState<Menu[]>(EMPTY_MENUS)
  const [hasExisting, setHasExisting] = useState(false)

  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""

  useEffect(() => {
    if (!formattedDate) return

    axios
      .get(`http://localhost:8080/menu/${formattedDate}`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length === 2) {
          setMenus(res.data)
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

  const handleSubmit = async () => {
    const cleanedMenus = menus.map(menu => ({
      foods: menu.foods.filter(food =>
        food.foodName && food.mainSub && food.category && food.tag
      )
    }))

    if (hasExisting) {
      await axios.put(`http://localhost:8080/menu/${formattedDate}`, cleanedMenus)
      alert("수정 완료")
    } else {
      await axios.post(`http://localhost:8080/menu/${formattedDate}`, cleanedMenus)
      alert("등록 완료")
      setHasExisting(true)
    }
  }

  const handleDelete = async () => {
    await axios.delete(`http://localhost:8080/menu/${formattedDate}`)
    alert("삭제 완료")
    setMenus(EMPTY_MENUS)
    setHasExisting(false)
  }

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