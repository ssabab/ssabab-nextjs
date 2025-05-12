"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Food = {
  foodName: string
  mainSub: string
  category: string
  tag: string
}

type Menu = { foods: Food[] }

type Props = {
  menus: Menu[]
  setMenus: (menus: Menu[]) => void
  onSubmit: () => void
}

export default function MenuForm({ menus, setMenus, onSubmit }: Props) {
  const handleChange = (
    menuIndex: number,
    foodIndex: number,
    field: keyof Food,
    value: string
  ) => {
    const newMenus = [...menus]
    newMenus[menuIndex].foods[foodIndex] = {
      ...newMenus[menuIndex].foods[foodIndex],
      [field]: value
    }
    setMenus(newMenus)
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      {menus.map((menu, menuIndex) => (
        <div key={menuIndex} className="space-y-4 border p-4 rounded-xl">
          <h2 className="text-lg font-semibold">메뉴 {menuIndex + 1}</h2>
          {menu.foods.map((food, foodIndex) => (
            <div
              key={foodIndex}
              className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end"
            >
              <div>
                <Label>음식 이름</Label>
                <Input
                  value={food.foodName}
                  onChange={(e) =>
                    handleChange(menuIndex, foodIndex, "foodName", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>주/서브</Label>
                <Input
                  value={food.mainSub}
                  onChange={(e) =>
                    handleChange(menuIndex, foodIndex, "mainSub", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>카테고리</Label>
                <Input
                  value={food.category}
                  onChange={(e) =>
                    handleChange(menuIndex, foodIndex, "category", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>태그</Label>
                <Input
                  value={food.tag}
                  onChange={(e) =>
                    handleChange(menuIndex, foodIndex, "tag", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ))}
      <Button type="submit" className="w-full">
        저장하기
      </Button>
    </form>
  )
}
