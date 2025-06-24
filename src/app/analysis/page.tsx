"use client"; // Client Component임을 명시합니다.

import React, { useState } from 'react';
// 월간 분석 및 개인 분석 컴포넌트를 임포트합니다.
import MonthlyAnalysis from '@/components/analysis/MonthlyAnalysis'; 
import { PersonalAnalysis } from '@/components/analysis/PersonalAnalysis'; 

export default function AnalyticsPage() {
  // 현재 활성화된 탭을 관리하는 상태 변수입니다. 초기값은 'monthly' 입니다.
  const [activeTab, setActiveTab] = useState('monthly'); 

  // activeTab 값에 따라 보여줄 컴포넌트를 결정합니다.
  const renderContent = () => {
    switch (activeTab) {
      case 'monthly':
        return <MonthlyAnalysis />;
      case 'personal':
        return <PersonalAnalysis />;
      default:
        return null;
    }
  };

  return (
    // 전체 페이지 컨테이너: flex-1, 패딩, 배경색, 최소 높이를 설정합니다.
    <main className="flex-1 pb-24 pt-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* 탭 버튼들을 감싸는 컨테이너: 이미지처럼 하나의 타원으로 보이도록 수정 */}
        <div className="flex justify-center mb-8">
          <div className="
            relative flex items-center bg-gray-200 rounded-full p-1 
            shadow-inner border border-gray-300
          ">
            {/* 활성 탭 배경을 위한 오버레이 (버튼과 동일한 크기와 위치) */}
            <div 
              className={`
                absolute top-1 bottom-1 
                w-1/2 bg-orange-500 rounded-full shadow transition-all duration-300 ease-in-out
                ${activeTab === 'monthly' ? 'left-1' : 'left-1/2 ml-1'}
              `}
              style={{ width: `calc(50% - 8px)` }} // 양쪽 p-1 (4px) 제거
            ></div>

            {/* '월간 분석' 탭 버튼 */}
            <button
              className={`
                relative z-10 px-6 py-2 rounded-full transition-colors duration-300 ease-in-out
                font-semibold text-base whitespace-nowrap
                ${activeTab === 'monthly' 
                  ? 'text-white' 
                  : 'text-gray-700 hover:text-gray-900'
                }
              `}
              onClick={() => setActiveTab('monthly')}
            >
              월간
            </button>
            {/* '개인 분석' 탭 버튼 */}
            <button
              className={`
                relative z-10 px-6 py-2 rounded-full transition-colors duration-300 ease-in-out
                font-semibold text-base whitespace-nowrap
                ${activeTab === 'personal' 
                  ? 'text-white' 
                  : 'text-gray-700 hover:text-gray-900'
                }
              `}
              onClick={() => setActiveTab('personal')}
            >
              개인
            </button>
          </div>
        </div>

        {/* 탭 콘텐츠를 표시하는 영역입니다. */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
          {renderContent()} {/* 현재 활성화된 탭에 맞는 컴포넌트를 렌더링 */}
        </div>
      </div>
    </main>
  );
}

