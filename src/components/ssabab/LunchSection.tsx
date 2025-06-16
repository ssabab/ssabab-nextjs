'use client'

<<<<<<< HEAD
import React, { useEffect, useState } from 'react' // useState 다시 추가
import { BiBowlRice } from 'react-icons/bi'
import { useMenuStore, dayLabels, computeWeekDates } from '@/stores/useMenuStore'

export default function LunchSection() {
  const currentWeek = useMenuStore(state => state.currentWeek)
  const selectedDay = useMenuStore(state => state.selectedDay)
  const setWeek = useMenuStore(state => state.setWeek)
  const setSelectedDay = useMenuStore(state => state.setSelectedDay)
  const initializeSelectedDay = useMenuStore(state => state.initializeSelectedDay)
  const storeDayMenu = useMenuStore(state => state.currentDayMenu)

  // computeWeekDates로 매번 최신 날짜 계산
  const dates = computeWeekDates(currentWeek)

  // LunchSection 내부에서만 사용될 메뉴 선택 상태 (로컬 상태)
  const [localOption, setLocalOption] = useState<'A' | 'B' | null>(null);

  const canPrev = currentWeek === 'thisWeek'
  const canNext = currentWeek === 'lastWeek'
=======
import React, { useEffect, useState } from 'react';
import { BiBowlRice } from 'react-icons/bi';
import { useMenuStore, dayLabels } from '@/stores/useMenuStore';

export default function LunchSection() {
  // 스토어에서 상태와 액션을 직접 가져옵니다.
  const {
    currentWeek,
    selectedDay,
    weekDates,
    currentWeekMenus,
    isGoToLastWeekEnabled,
    isGoToThisWeekEnabled,
    setWeek,
    setSelectedDay,
    initializeStore,
  } = useMenuStore();

  // 선택된 요일의 메뉴 데이터를 가져옵니다.
  const currentDayMenu = currentWeekMenus[selectedDay];

  const [localSelectedMenuOption, setLocalSelectedMenuOption] = useState<'A' | 'B' | null>(null);
>>>>>>> dev

  // 컴포넌트 마운트 시 스토어 초기화
  useEffect(() => {
<<<<<<< HEAD
    initializeSelectedDay()
  }, [initializeSelectedDay])
=======
    initializeStore();
  }, [initializeStore]);
>>>>>>> dev

  // 요일 또는 주차 변경 시 로컬 메뉴 선택 상태 초기화
  useEffect(() => {
    setLocalOption(null)
  }, [selectedDay, currentWeek])

  const handleMenuSelect = (option: 'A' | 'B') => {
<<<<<<< HEAD
    setLocalOption(option)
    console.log(`LunchSection에서 ${currentWeek} ${selectedDay}의 메뉴 ${option}이(가) 선택되었습니다.`);
  }
=======
    setLocalSelectedMenuOption(option);
  };

  const weekTitle = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    if (currentWeek === 'thisWeek' && (dayOfWeek === 0 || dayOfWeek === 6)) {
      return '다음 주';
    }
    if (currentWeek === 'thisWeek') {
      return '이번 주';
    }
    return '저번 주';
  };
>>>>>>> dev

  return (
    <section className="bg-white rounded-lg shadow-md p-6 font-sans">
      {/* 주차 선택 UI */}
      <div className="flex justify-center items-center mb-6">
        <button
          onClick={() => setWeek('lastWeek')}
          disabled={!canPrev}
          className={`
            p-2 rounded-full transition-colors duration-200 text-xl font-bold
<<<<<<< HEAD
            ${canPrev ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed pointer-events-none'}
=======
            ${isGoToLastWeekEnabled ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed'}
>>>>>>> dev
          `}
          aria-label="저번 주 보기"
        >
          &lt;
        </button>

        <span className="text-2xl font-bold mx-4 font-sans">
          {weekTitle()}
        </span>

        <button
          onClick={() => setWeek('thisWeek')}
          disabled={!canNext}
          className={`
            p-2 rounded-full transition-colors duration-200 text-xl font-bold
<<<<<<< HEAD
            ${canNext ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed pointer-events-none'}
=======
            ${isGoToThisWeekEnabled ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed'}
>>>>>>> dev
          `}
          aria-label="이번 주 보기"
        >
          &gt;
        </button>
      </div>

      {/* 요일 및 날짜 선택 그룹 */}
<<<<<<< HEAD
      <div
        key={currentWeek}
        className={`
          flex justify-center mb-6 border-b pb-4
          transform transition-transform duration-300
          translate-x-0
        `}
      >
        {dates.map(({ dayKey, date }) => (
          <button
            key={dayKey}
            onClick={() => setSelectedDay(dayKey)}
            className={`
              mx-1.5 p-2 w-14 h-16 rounded-md
              ${selectedDay === dayKey
                ? 'bg-orange-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            <div className="text-sm font-semibold">{dayLabels[dayKey]}</div>
            <div className="text-lg font-bold">{date}</div>
          </button>
        ))}
=======
      <div className="flex justify-center items-center mb-6 border-b border-gray-200 pb-4">
        {weekDates.map(({ dayKey, date, fullDate }) => {
          const isToday = new Date().toDateString() === fullDate.toDateString();
          return (
            <button
              key={dayKey}
              onClick={() => setSelectedDay(dayKey)}
              className={`
                flex flex-col items-center justify-center p-2 mx-1.5 rounded-md
                transition-all duration-200 ease-in-out font-sans
                w-14 h-16 relative
                ${selectedDay === dayKey
                  ? 'bg-black text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <span className="text-sm font-semibold">{dayLabels[dayKey]}</span>
              <span className="text-lg font-bold">{date}</span>
              {isToday && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
              )}
            </button>
          );
        })}
>>>>>>> dev
      </div>

      {/* 선택된 요일의 메뉴 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['A','B'] as const).map(opt => {
          const items = opt === 'A' ? storeDayMenu.menuA : storeDayMenu.menuB
          const color = opt === 'A' ? 'blue' : 'green'
          return (
            <div
              key={opt}
              onClick={() => handleMenuSelect(opt)}
              className={`cursor-pointer p-4 rounded-lg transition ${
                localOption === opt
                  ? 'border-2 border-orange-500 bg-orange-100'
                  : 'border border-gray-100 hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 mb-3 bg-${color}-100 rounded-full flex items-center justify-center`}>
                <BiBowlRice size={24} className={`text-${color}-600`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">메뉴 {opt}</h3>
              <ul className="list-disc list-inside text-sm">
                {items.map((it,i) => <li key={i} className="py-0.5">{it}</li>)}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  );
}