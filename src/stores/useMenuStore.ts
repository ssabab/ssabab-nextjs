import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// --- 타입 정의 ---
export const dayLabels = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
} as const
export type DayOfWeek = keyof typeof dayLabels
export type WeekType = 'thisWeek' | 'lastWeek'

interface MenuData {
  menuA: string[];
  menuB: string[];
}

export type WeekMenus = Record<DayOfWeek, MenuData>

export interface WeekDateInfo {
  dayKey: DayOfWeek;
  date: number;
  fullDate: Date;
}

interface WeekDateInfo {
  dayKey: DayOfWeek;
  date: number;
  fullDate: Date;
}

interface MenuStoreState {
  // 상태
  currentWeek: WeekType;
  selectedDay: DayOfWeek;
  weekDates: WeekDateInfo[];
  currentWeekMenus: WeekMenus;

  // 파생된/Computed 상태 (컴포넌트에서 필요 시 계산)
  isGoToLastWeekEnabled: boolean;
  isGoToThisWeekEnabled: boolean;

  // 액션
  setWeek: (week: WeekType) => void;
  setSelectedDay: (day: DayOfWeek) => void;
  initializeStore: () => void; // 초기화 액션 통합
  _updateDerivedState: () => void; // 파생 상태 업데이트 내부 함수
}

export const dayLabels: Record<DayOfWeek, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
};

// --- 유틸리티 함수 ---

const getMonday = (date: Date, weekOffset: number = 0): Date => {
  const d = new Date(date);
  // getDay()는 일요일=0, 월요일=1, ..., 토요일=6을 반환합니다.
  // 월요일을 주의 시작으로 간주하기 위해, 일요일(0)을 7로 취급합니다.
  const day = d.getDay() || 7; 
  if (day !== 1) {
    // 현재 요일이 월요일이 아니면, 월요일로 이동시킵니다.
    d.setHours(-24 * (day - 1));
  }
  // 주차 오프셋 적용
  d.setDate(d.getDate() + weekOffset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const computeWeekDates = (currentWeekType: WeekType): WeekDateInfo[] => {
  const today = new Date();
  const offset = currentWeekType === 'thisWeek' ? 0 : -1;
  const monday = getMonday(today, offset);

  return Object.keys(dayLabels).map((dayKey, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return {
      dayKey: dayKey as DayOfWeek,
      date: day.getDate(),
      fullDate: day,
    };
  });
};

const generateMenuForDate = (date: Date): MenuData => {
  const dayOfMonth = date.getDate();
  const monthOffset = date.getMonth();
  
  const menuOptions = [
    {
      menuA: ["쌀밥", "제육볶음", "상추쌈", "계란찜", "콩나물국", "배추김치"],
      menuB: ["보리밥", "된장찌개", "두부조림", "오이무침", "멸치볶음", "깍두기"],
    },
    {
      menuA: ["잡곡밥", "닭갈비", "깻잎쌈", "어묵볶음", "미역국", "갓김치"],
      menuB: ["현미밥", "고등어구이", "시금치나물", "연근조림", "소고기무국", "열무김치"],
    },
    {
      menuA: ["흑미밥", "소불고기", "잡채", "호박전", "순두부찌개", "총각김치"],
      menuB: ["쌀밥", "돈까스", "양배추샐러드", "마카로니콘샐러드", "크림스프", "깍두기"],
    },
    {
      menuA: ["카레라이스", "치킨가라아게", "오복지무침", "유부장국", "샐러리피클", "배추김치"],
      menuB: ["김치볶음밥", "계란후라이", "미니돈까스", "콩나물국", "단무지", "콘샐러드"],
    },
    {
      menuA: ["잔치국수", "왕만두", "단무지무침", "부추겉절이", "계란지단", "멸치육수"],
      menuB: ["짜장면", "탕수육", "군만두", "단무지", "양파", "짬뽕국물"],
    },
  ];
  
  return menuOptions[(dayOfMonth + monthOffset) % menuOptions.length];
};

const generateWeekMenus = (weekDates: WeekDateInfo[]): WeekMenus => {
    return {
        MONDAY: generateMenuForDate(weekDates[0].fullDate),
        TUESDAY: generateMenuForDate(weekDates[1].fullDate),
        WEDNESDAY: generateMenuForDate(weekDates[2].fullDate),
        THURSDAY: generateMenuForDate(weekDates[3].fullDate),
        FRIDAY: generateMenuForDate(weekDates[4].fullDate),
    };
};

// --- 스토어 생성 ---
const initialWeekDates = getWeekDates('thisWeek');
const initialMenus = generateWeekMenus(initialWeekDates);

export const useMenuStore = create<MenuStoreState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      currentWeek: 'thisWeek',
      selectedDay: 'MONDAY',
      weekDates: initialWeekDates,
      currentWeekMenus: initialMenus,
      isGoToLastWeekEnabled: true,
      isGoToThisWeekEnabled: false,

      // 파생 상태 업데이트 함수
      _updateDerivedState: () => {
        const currentWeek = get().currentWeek;
        const weekDates = getWeekDates(currentWeek);
        const currentWeekMenus = generateWeekMenus(weekDates);
        set({
          weekDates,
          currentWeekMenus,
          isGoToLastWeekEnabled: currentWeek === 'thisWeek',
          isGoToThisWeekEnabled: currentWeek === 'lastWeek',
        });
      },

      // 액션
      setWeek: (week) => {
        set({ currentWeek: week });
        get()._updateDerivedState();
      },
      
      setSelectedDay: (day) => set({ selectedDay: day }),

      initializeStore: () => {
        const today = new Date();
        const dayOfWeek = today.getDay();

        // 주말(토, 일)이면 currentWeek를 'thisWeek'으로 유지하고 (다음 주를 의미)
        // selectedDay는 월요일로 설정합니다.
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          set({ selectedDay: 'MONDAY', currentWeek: 'thisWeek' });
        } else {
        // 평일이면 오늘 요일로 설정합니다.
          const todayDayKey = Object.keys(dayLabels)[dayOfWeek - 1] as DayOfWeek;
          set({ selectedDay: todayDayKey, currentWeek: 'thisWeek' });
        }
        get()._updateDerivedState();
      },
    }),
    {
      name: 'menu-store',
    }
  )
);