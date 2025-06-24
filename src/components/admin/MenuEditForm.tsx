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
  onDelete,
}: {
  date: string
  menus: any[]
  onDelete?: () => void
}) {
  const token = useAuthStore((state) => state.token)
  const [editedMenus, setEditedMenus] = useState<any[]>([])

  useEffect(() => {
    const normalized = menus.map((menu) => ({
      ...menu,
      foods: menu.foods.map((food: any) => ({
        ...food,
        id: food.foodId,
      })),
    }))
    setEditedMenus(normalized)
  }, [menus])

  const updateFood = (menuId: number, foodId: number, field: string, value: string) => {
    setEditedMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.menuId !== menuId
          ? menu
          : {
              ...menu,
              foods: menu.foods.map((food: any) =>
                food.id !== foodId ? food : { ...food, [field]: value }
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
      await axios.put(
        `http://localhost:8080/api/menu/${menu.menuId}`,
        menu.foods.map((food: any) => ({
          foodName: food.foodName,
          mainSub: food.mainSub,
          category: food.category,
          tag: food.tag,
        })),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert("메뉴 수정 성공")
    } catch (err: any) {
      console.error(err)
      alert("메뉴 수정 중 오류가 발생했습니다.")
    }
  }

  const handleDeleteAllMenus = async () => {
    if (!token) {
      alert("로그인이 필요합니다.")
      return
    }

    if (!confirm(`${date}의 메뉴를 정말 삭제하시겠습니까?`)) return

    try {
      await axios.delete(`http://localhost:8080/api/menu/${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("메뉴 삭제 성공")
      setEditedMenus([])
      if (onDelete) onDelete()
    } catch (err: any) {
      console.error(err)
      alert("메뉴 삭제 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="border p-4 rounded-md space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{date} 메뉴 수정</h2>
        <button
          onClick={handleDeleteAllMenus}
          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          전체 삭제
        </button>
      </div>

      {editedMenus.map((menu, menuIdx) => (
        <div key={menu.menuId} className="space-y-2 pb-4">
          <h3 className="font-medium">메뉴 {menuIdx + 1}</h3>
          {menu.foods.map((food: any) => (
            <div key={food.id} className="grid grid-cols-4 gap-2 items-center">
              <input
                className="border p-2 rounded bg-gray-100"
                type="text"
                value={food.foodName}
                onChange={(e) =>
                  updateFood(menu.menuId, food.id, "foodName", e.target.value)
                }
              />
              <select
                className="border p-2 rounded bg-gray-100"
                value={food.mainSub}
                onChange={(e) =>
                  updateFood(menu.menuId, food.id, "mainSub", e.target.value)
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
                  updateFood(menu.menuId, food.id, "category", e.target.value)
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
                  updateFood(menu.menuId, food.id, "tag", e.target.value)
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
