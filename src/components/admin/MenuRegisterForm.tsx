"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import api, { Menu } from "@/lib/api"

const MAIN_SUB_OPTIONS = ["주메뉴", "서브메뉴", "일반메뉴"]
const CATEGORY_OPTIONS = ["한식", "중식", "일식", "양식"]
const TAG_OPTIONS = ["밥", "면", "국", "생선", "고기", "야채", "기타"]

type FoodInput = {
  foodName: string
  mainSub: string
  category: string
  tag: string
}

type MenuInput = {
  foods: FoodInput[]
}

const createInitialFood = (): FoodInput => ({
  foodName: "",
  mainSub: "주메뉴",
  category: "한식",
  tag: "밥",
})

const createInitialMenu = (): MenuInput => ({
  foods: Array.from({ length: 6 }, createInitialFood),
})

interface MenuRegisterFormProps {
  date: string
  onSuccess?: (menus: Menu[]) => void
}

export default function MenuRegisterForm({
  date,
  onSuccess,
}: MenuRegisterFormProps) {
  const [menus, setMenus] = useState<MenuInput[]>([
    createInitialMenu(),
    createInitialMenu(),
  ])

  useEffect(() => {
    setMenus([createInitialMenu(), createInitialMenu()])
  }, [date])

  const handleChange = (
    menuIndex: number,
    foodIndex: number,
    key: keyof FoodInput,
    value: string
  ) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu, mIdx) =>
        mIdx === menuIndex
          ? {
              ...menu,
              foods: menu.foods.map((food, fIdx) =>
                fIdx === foodIndex ? { ...food, [key]: value } : food
              ),
            }
          : menu
      )
    )
  }

  const handleRegister = async () => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd")

    const payload = menus
      .map((menu) => ({
        foods: menu.foods.filter((food) => food.foodName.trim() !== ""),
      }))
      .filter((menu) => menu.foods.length > 0)

    if (payload.length === 0) {
      alert("등록할 메뉴가 없습니다.")
      return
    }

    try {
      await Promise.all(
        payload.map((p) => api.post("/menus", { date: formattedDate, ...p }))
      )

      alert("메뉴 등록 성공")

      if (onSuccess) {
        const res = await api.get(`/menus/date/${formattedDate}`)
        onSuccess(res.data)
      }
    } catch (err) {
      console.error(err)
      alert("메뉴 등록 중 오류 발생")
    }
  }

  return (
    <div className="border p-4 rounded-md space-y-6">
      <h2 className="text-lg font-semibold">{date} 메뉴 등록</h2>
      {menus.map((menu, menuIdx) => (
        <div key={menuIdx} className="space-y-2">
          <h3 className="font-medium">메뉴 {menuIdx + 1}</h3>
          {menu.foods.map((food, foodIdx) => (
            <div key={foodIdx} className="grid grid-cols-4 gap-2 items-center">
              <input
                className="border p-2 rounded bg-gray-100"
                type="text"
                placeholder="음식 이름"
                value={food.foodName}
                onChange={(e) =>
                  handleChange(menuIdx, foodIdx, "foodName", e.target.value)
                }
              />
              <select
                className="border p-2 rounded bg-gray-100"
                value={food.mainSub}
                onChange={(e) =>
                  handleChange(menuIdx, foodIdx, "mainSub", e.target.value)
                }
              >
                {MAIN_SUB_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <select
                className="border p-2 rounded bg-gray-100"
                value={food.category}
                onChange={(e) =>
                  handleChange(menuIdx, foodIdx, "category", e.target.value)
                }
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <select
                className="border p-2 rounded bg-gray-100"
                value={food.tag}
                onChange={(e) =>
                  handleChange(menuIdx, foodIdx, "tag", e.target.value)
                }
              >
                {TAG_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={handleRegister}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
        >
          등록
        </button>
      </div>
    </div>
  )
}
