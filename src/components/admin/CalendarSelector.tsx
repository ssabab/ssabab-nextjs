"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { ko } from "date-fns/locale"
import axios from "axios"

interface CalendarSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function CalendarSelector({ selectedDate, onDateChange }: CalendarSelectorProps) {

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">날짜 선택</h2>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateChange}
        className="rounded-md border"
      />
    </div>
  )
}
