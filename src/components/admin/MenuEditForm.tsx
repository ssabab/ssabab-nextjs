"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useAuthStore } from "@/stores/useAuthStore"

const MAIN_SUB_OPTIONS = ["주메뉴", "서브메뉴", "일반메뉴"]
const CATEGORY_OPTIONS = ["한식", "중식", "일식", "양식"]
const TAG_OPTIONS = ["밥", "면", "국", "생선", "고기", "야채", "기타"]

export default function MenuEditForm({
  date,
  menus,
}: {
  date: string
  menus: any[]
}) {
  const token = useAuthStore((state) => state.token)
  const [editedMenus, setEditedMenus] = useState(menus)

  // 날짜 바뀔 때마다 메뉴 반영
  useEffect(() => {
    setEditedMenus(menus)
  }, [menus])

  // 음식 수정 핸들러
  const updateFood = (menuId: number, foodId: number, field: string, value: string) => {
    setEditedMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.menuId !== menuId
          ? menu
          : {
              ...menu,
              foods: menu.foods.map((food: any) =>
                food.foodId !== foodId ? food : { ...food, [field]: value }
              ),
            }
      )
    )
  }

  const handleEdit = async (menu: any) => {
    if (!token) {
      alert("로그인이 필요합니다.")
      return
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/api/menu/${menu.menuId}`,
        {
          date: menu.date,
          foods: menu.foods.map((food: any) => ({
            foodId: food.foodId,
            foodName: food.foodName,
            mainSub: food.mainSub,
            category: food.category,
            tag: food.tag,
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert("메뉴가 성공적으로 수정되었습니다.")
    } catch (err: any) {
      console.error(err)
      alert("메뉴 수정 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="border p-4 rounded-md space-y-6">
      <h2>{date} 메뉴 수정</h2>

      {editedMenus.map((menu, menuIdx) => (
        <div key={menu.menuId} className="space-y-2 pb-4">
          <h3 className="font-medium">메뉴 {menuIdx + 1}</h3>
          {menu.foods.map((food: any) => (
            <div
              key={food.foodId}
              className="grid grid-cols-4 gap-2 items-center"
            >
              <input
                className="border p-2 rounded bg-gray-100"
                type="text"
                value={food.foodName}
                onChange={(e) =>
                  updateFood(menu.menuId, food.foodId, "foodName", e.target.value)
                }
              />
              <select
                className="border p-2 rounded bg-gray-100"
                value={food.mainSub}
                onChange={(e) =>
                  updateFood(menu.menuId, food.foodId, "mainSub", e.target.value)
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
                  updateFood(menu.menuId, food.foodId, "category", e.target.value)
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
                  updateFood(menu.menuId, food.foodId, "tag", e.target.value)
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
          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleEdit(menu)}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              수정
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
