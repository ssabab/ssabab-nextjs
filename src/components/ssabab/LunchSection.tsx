'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { BiBowlRice } from 'react-icons/bi'
import { useAuthStore } from '@/stores/useAuthStore'
import { getWeeklyMenuCached, WeeklyMenu, preVote } from '@/lib/api'
import { useMenuStore } from '@/stores/useMenuStore'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'

const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as const
const dayKor = ['월', '화', '수', '목', '금']
const cardColors = ['blue', 'green']
const cacheKey = 'weeklyMenusCache'

interface Food {
  foodId: number;
  foodName: string;
}

interface Menu {
  menuId: number;
  foods: Food[];
}

interface WeeklyMenu {
  date: string;
  menu1: Menu;
  menu2: Menu;
}

function getKSTDateISO(date?: Date) {
  const now = date ?? new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
}

export function LunchSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>점심 메뉴</CardTitle>
        <CardDescription>
          오늘의 점심 메뉴를 확인하고 투표하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>메뉴 정보가 곧 표시됩니다.</p>
      </CardContent>
    </Card>
  )
}