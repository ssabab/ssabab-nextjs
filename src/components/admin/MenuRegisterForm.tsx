"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuthStore } from "@/stores/useAuthStore"

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

// 음식 1개 기본 생성
const createInitialFood = (): FoodInput => ({
  foodName: "",
  mainSub: "주메뉴",
  category: "한식",
  tag: "밥",
})

// 메뉴 1개 기본 생성 (음식 6개)
const createInitialMenu = (): MenuInput => ({
  foods: Array.from({ length: 6 }, createInitialFood),
})

export default function MenuRegisterForm({ date }: { date: string | Date }) {
  const [menus, setMenus] = useState<MenuInput[]>([
    createInitialMenu(),
    createInitialMenu(),
  ])
  const token = useAuthStore((state) => state.token)

  // ✅ 날짜가 바뀔 때 입력값 초기화
  useEffect(() => {
    setMenus([createInitialMenu(), createInitialMenu()])
  }, [date])

  // 음식 속성 변경 핸들러
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

  // 등록 핸들러
  const handleRegister = async () => {
    if (!token) {
      alert("로그인이 필요합니다.")
      return
    }

    const formattedDate =
      typeof date === "string" ? date : date.toISOString().slice(0, 10)

    try {
      const res = await axios.post(
        `http://localhost:8080/api/menu/${formattedDate}`,
        menus,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.status === 201) {
        alert("메뉴 등록 성공")
      } else {
        throw new Error("등록 실패")
      }
    } catch (err) {
      console.error(err)
      alert("메뉴 등록 중 오류 발생")
    }
  }

  return (
    <div className="border p-4 rounded-md space-y-6">
      <h2>{typeof date === "string" ? date : date.toLocaleDateString()} 메뉴 등록</h2>
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
