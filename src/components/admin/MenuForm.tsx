"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Menu } from "@/lib/api"

interface MenuFormProps {
  menus: Menu[]
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>
  onSubmit: () => void
}

export default function MenuForm({ menus, setMenus, onSubmit }: MenuFormProps) {
  const handleChange = (menuIndex: number, foodIndex: number, value: string) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu, mi) => {
        if (mi !== menuIndex) return menu
        const foods = [...menu.foods]
        foods[foodIndex] = { ...foods[foodIndex], foodName: value }
        return { ...menu, foods }
      })
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      {menus.map((menu, mi) => (
        <div key={mi} className="space-y-4 border p-4 rounded-xl">
          <h2 className="text-lg font-semibold">메뉴 {mi + 1}</h2>
          {menu.foods.map((food, fi) => (
            <div key={fi} className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`foodName-${mi}-${fi}`}>음식 이름</Label>
                <Input
                  id={`foodName-${mi}-${fi}`}
                  value={food.foodName}
                  onChange={(e) => handleChange(mi, fi, e.target.value)}
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
  );
}