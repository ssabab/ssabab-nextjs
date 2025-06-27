// src/components/analysis/TempBarChart.tsx
import React from 'react';

interface TempBarChartProps {
  value: number; // 막대의 상대적 높이 (예: 0-100)
  label: string; // 막대 하단 라벨
}

export default function TempBarChart({ value, label }: TempBarChartProps) {
  // 최대 높이를 80%로 가정하고 값에 비례하여 높이 조절
  const height = (value / 100) * 80; 

  return (
    <div className="flex flex-col items-center justify-end h-full">
      <div
        className="w-8 bg-gray-700 rounded-t-md transition-all duration-300 ease-out"
        style={{ height: `${height}%` }}
      ></div>
      <span className="text-xs text-gray-600 mt-1">{label}</span>
    </div>
  );
}

