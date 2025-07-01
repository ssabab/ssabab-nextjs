"use client"

import { useEffect, useState } from "react"
import api, { Menu, FoodInfo } from "@/lib/api"

const MAIN_SUB_OPTIONS = ["주메뉴", "서브메뉴", "일반메뉴"]
const CATEGORY_OPTIONS = ["한식", "중식", "일식", "양식"]
const TAG_OPTIONS = ["밥", "면", "국", "생선", "고기", "야채", "기타"]

interface MenuEditFormProps {
  date: string
  menus: Menu[]
  onDelete?: () => void
}

export default function MenuEditForm({
  date,
  menus,
  onDelete,
}: MenuEditFormProps) {
  const [editedMenus, setEditedMenus] = useState<Menu[]>([])

  useEffect(() => {
    setEditedMenus(menus)
  }, [menus])

  const updateFood = (
    menuId: number,
    foodId: number,
    field: keyof FoodInfo,
    value: string
  ) => {
    setEditedMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.menuId !== menuId
          ? menu
          : {
              ...menu,
              foods: menu.foods.map((food) =>
                food.foodId !== foodId ? food : { ...food, [field]: value }
              ),
            }
      )
    )
  }

  const handleEdit = async (menu: Menu) => {
    try {
      await api.put(
        `/menus/${menu.menuId}`,
        menu.foods.map((food) => ({
          foodName: food.foodName,
          mainSub: food.mainSub,
          category: food.category,
          tag: food.tag,
        }))
      )
      alert("메뉴 수정 성공")
    } catch (err) {
      console.error(err)
      alert("메뉴 수정 중 오류가 발생했습니다.")
    }
  }

  const handleDeleteAllMenus = async () => {
    if (!confirm(`${date}의 메뉴를 정말 삭제하시겠습니까?`)) return

    try {
      await api.delete(`/menus/date/${date}`)

      alert("메뉴 삭제 성공")
      setEditedMenus([])
      if (onDelete) onDelete()
    } catch (err) {
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
          {menu.foods.map((food) => (
            <div
              key={food.foodId}
              className="grid grid-cols-4 gap-2 items-center"
            >
              <input
                className="border p-2 rounded bg-gray-100"
                type="text"
                value={food.foodName}
                onChange={(e) =>
                  updateFood(
                    menu.menuId,
                    food.foodId,
                    "foodName",
                    e.target.value
                  )
                }
              />
              <select
                className="border p-2 rounded bg-gray-100"
                value={food.mainSub}
                onChange={(e) =>
                  updateFood(
                    menu.menuId,
                    food.foodId,
                    "mainSub",
                    e.target.value
                  )
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
                  updateFood(
                    menu.menuId,
                    food.foodId,
                    "category",
                    e.target.value
                  )
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
