// src/components/analysis/TempDonutChart.tsx
import React from 'react';

interface TempDonutChartProps {
  percentage: number; // 0-100%
  color?: string;
}

export default function TempDonutChart({ percentage, color = '#3B82F6' }: TempDonutChartProps) {
  // SVG를 이용한 도넛 차트 시뮬레이션
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className="text-orange-500" // 이미지와 유사한 색상
          strokeWidth="10"
          stroke={color}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-800">{percentage}%</span>
      </div>
    </div>
  );
}

