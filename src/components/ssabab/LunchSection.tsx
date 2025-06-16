// components/ssabab/LunchSection.tsx
'use client'

import React, { useEffect, useState } from 'react'; // useState 다시 추가
import { BiBowlRice } from 'react-icons/bi';
import { useMenuStore, dayLabels } from '@/stores/useMenuStore'; // useMenuStore 임포트

export default function LunchSection() {
  // Zustand 스토어에서 필요한 상태와 액션 가져오기
  const {
    currentWeek,
    selectedDay,
    weekDates,
    currentDayMenu,
    isGoToLastWeekEnabled,
    isGoToThisWeekEnabled,
    setWeek,
    setSelectedDay,
    initializeSelectedDay,
  } = useMenuStore();

  // LunchSection 내부에서만 사용될 메뉴 선택 상태 (로컬 상태)
  const [localSelectedMenuOption, setLocalSelectedMenuOption] = useState<'A' | 'B' | null>(null);

  // 컴포넌트 마운트 시 초기 요일 설정
  useEffect(() => {
    initializeSelectedDay();
  }, [initializeSelectedDay]);

  // 요일 또는 주차 변경 시 로컬 메뉴 선택 상태 초기화
  useEffect(() => {
    setLocalSelectedMenuOption(null);
  }, [selectedDay, currentWeek]);


  const handleMenuSelect = (option: 'A' | 'B') => {
    setLocalSelectedMenuOption(option); // 로컬 상태 업데이트
    console.log(`LunchSection에서 ${currentWeek} ${selectedDay}의 메뉴 ${option}이(가) 선택되었습니다.`);
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 font-sans">
      {/* 주차 선택 UI */}
      <div className="flex justify-center items-center mb-6">
        <button
          onClick={() => setWeek('lastWeek')}
          disabled={!isGoToLastWeekEnabled}
          className={`
            p-2 rounded-full transition-colors duration-200 text-xl font-bold
            ${isGoToLastWeekEnabled ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed pointer-events-none'}
          `}
          aria-label="저번 주 보기"
        >
          &lt;
        </button>

        <span className="text-2xl font-bold mx-4 font-sans">
          {currentWeek === 'thisWeek' ? '이번 주' : '저번 주'}
        </span>

        <button
          onClick={() => setWeek('thisWeek')}
          disabled={!isGoToThisWeekEnabled}
          className={`
            p-2 rounded-full transition-colors duration-200 text-xl font-bold
            ${isGoToThisWeekEnabled ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed pointer-events-none'}
          `}
          aria-label="이번 주 보기"
        >
          &gt;
        </button>
      </div>

      {/* 요일 및 날짜 선택 그룹 */}
      <div className="flex justify-center items-center mb-6 border-b border-gray-200 pb-4">
        {weekDates.map(({ dayKey, date, fullDate }) => (
          <button
            key={dayKey}
            onClick={() => setSelectedDay(dayKey)}
            className={`
              flex flex-col items-center justify-center p-2 mx-1.5 rounded-md
              transition-all duration-200 ease-in-out font-sans
              w-14 h-16
              ${selectedDay === dayKey
                ? 'bg-black text-white shadow-md transform scale-105'
                : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            <span className="text-sm font-semibold">{dayLabels[dayKey]}</span>
            <span className="text-lg font-bold">{date}</span>
          </button>
        ))}
      </div>

      {/* 선택된 요일의 메뉴 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 메뉴 A 카드 */}
        <div
          onClick={() => handleMenuSelect('A')}
          className={`
            flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer
            transition-all duration-200 ease-in-out
            ${localSelectedMenuOption === 'A' ? 'border-2 border-orange-500 transform scale-102 shadow-lg' : 'border border-gray-100 hover:shadow-md'}
          `}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
             <BiBowlRice size={24} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 font-sans">메뉴 A</h3>
          <ul className="text-gray-700 text-sm list-disc list-inside text-left w-full px-4 font-sans">
            {currentDayMenu.menuA.map((item, index) => (
              <li key={index} className="py-0.5">{item}</li>
            ))}
          </ul>
        </div>

        {/* 메뉴 B 카드 */}
        <div
          onClick={() => handleMenuSelect('B')}
          className={`
            flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer
            transition-all duration-200 ease-in-out
            ${localSelectedMenuOption === 'B' ? 'border-2 border-orange-500 transform scale-102 shadow-lg' : 'border border-gray-100 hover:shadow-md'}
          `}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <BiBowlRice size={24} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 font-sans">메뉴 B</h3>
          <ul className="text-gray-700 text-sm list-disc list-inside text-left w-full px-4 font-sans">
            {currentDayMenu.menuB.map((item, index) => (
              <li key={index} className="py-0.5">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}