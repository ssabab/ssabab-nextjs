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

interface TempLunchMenus {
  thisWeek: WeekMenus;
  lastWeek: WeekMenus;
}

interface MenuStoreState {
  // 상태
  currentWeek: WeekType;
  selectedDay: DayOfWeek;
  // selectedMenuOption: 'A' | 'B' | null; <-- 이 줄 제거

  // 파생된/Computed 상태 (getter처럼 사용)
  weekDates: WeekDateInfo[];
  currentWeekMenus: WeekMenus;
  currentDayMenu: MenuData;
  isGoToLastWeekEnabled: boolean;
  isGoToThisWeekEnabled: boolean;

  getTempLunchMenusData: () => TempLunchMenus;

  // 액션
  setWeek: (week: WeekType) => void;
  setSelectedDay: (day: DayOfWeek) => void;
  // setSelectedMenuOption: (option: 'A' | 'B' | null) => void; <-- 이 줄 제거
  initializeSelectedDay: () => void;
}

// --- 임시 메뉴 데이터 ---
const tempLunchMenus: TempLunchMenus = {
  thisWeek: {
    MONDAY: {
      menuA: ["쌀밥", "제육볶음", "상추쌈", "계란찜", "콩나물국", "배추김치"],
      menuB: ["보리밥", "된장찌개", "두부조림", "오이무침", "멸치볶음", "깍두기"],
    },
    TUESDAY: {
      menuA: ["잡곡밥", "김치찌개", "고등어구이", "시금치나물", "어묵볶음", "깍두기"],
      menuB: ["밥", "돈까스", "스프", "샐러드", "단무지", "피클"],
    },
    WEDNESDAY: {
      menuA: ["현미밥", "비빔밥", "고추장", "참기름", "미역국", "김치"],
      menuB: ["초밥", "미소장국", "새우튀김", "락교", "생강절임", "간장"],
    },
    THURSDAY: {
      menuA: ["밥", "닭갈비", "볶음밥재료", "쌈무", "동치미", "야채"],
      menuB: ["파스타", "마늘빵", "샐러드", "피클", "콜라", "수제피클"],
    },
    FRIDAY: {
      menuA: ["밥", "불고기", "잡채", "호박전", "콩자반", "김치"],
      menuB: ["치킨", "감자튀김", "콜라", "치킨무", "샐러드", "소스"],
    },
  },
  lastWeek: {
    MONDAY: {
      menuA: ["콩밥", "카레라이스", "감자채볶음", "오징어젓갈", "맑은 장국", "총각김치"],
      menuB: ["쌀밥", "순두부찌개", "계란말이", "미역줄기볶음", "김자반", "배추김치"],
    },
    TUESDAY: {
      menuA: ["보리밥", "순대국밥", "깍두기", "부추무침", "새우젓", "양파"],
      menuB: ["흰쌀밥", "김치볶음밥", "계란후라이", "단무지", "콘샐러드", "유부장국"],
    },
    WEDNESDAY: {
      menuA: ["잡곡밥", "고추장불고기", "쌈채소", "마늘", "쌈장", "물김치"],
      menuB: ["볶음밥", "짜장면", "탕수육", "군만두", "단무지", "짬뽕국물"],
    },
    THURSDAY: {
      menuA: ["쌀밥", "삼계탕", "깍두기", "인삼주", "마늘", "대추"],
      menuB: ["현미밥", "생선구이", "콩나물국", "진미채볶음", "취나물", "배추김치"],
    },
    FRIDAY: {
      menuA: ["김밥", "떡볶이", "순대", "튀김", "어묵탕", "단무지"],
      menuB: ["햄버거", "감자튀김", "콜라", "케첩", "피클", "양파링"],
    },
  },
};

// export const dayLabels: Record<DayOfWeek, string> = {
//   MONDAY: '월',
//   TUESDAY: '화',
//   WEDNESDAY: '수',
//   THURSDAY: '목',
//   FRIDAY: '금',
// };

const getMonday = (date: Date, weekOffset: number = 0) => {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + (weekOffset * 7));
  d.setHours(0, 0, 0, 0);
  return d;
};

const getWeekDates = (currentWeekType: WeekType): WeekDateInfo[] => {
  const today = new Date();
  const offset = currentWeekType === 'thisWeek' ? 0 : -1;
  const monday = getMonday(today, offset);

  const dates: WeekDateInfo[] = [];
  for (let i = 0; i < 5; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const dayKey = Object.keys(dayLabels)[i] as DayOfWeek;
    dates.push({ dayKey: dayKey, date: day.getDate(), fullDate: day });
  }
  return dates;
};

export const useMenuStore = create<MenuStoreState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      currentWeek: 'thisWeek',
      selectedDay: 'MONDAY',
      // selectedMenuOption: null, <-- 이 줄 제거

      // 파생된/Computed 상태
      get weekDates() {
        return getWeekDates(get().currentWeek);
      },
      get currentWeekMenus() {
        return tempLunchMenus[get().currentWeek];
      },
      get currentDayMenu() {
        return tempLunchMenus[get().currentWeek][get().selectedDay];
      },
      get isGoToLastWeekEnabled() {
        return get().currentWeek === 'thisWeek';
      },
      get isGoToThisWeekEnabled() {
        return get().currentWeek === 'lastWeek';
      },
      getTempLunchMenusData: () => tempLunchMenus,

      // 액션
      setWeek: (week) => set({ currentWeek: week }), // selectedMenuOption 초기화 로직 제거
      setSelectedDay: (day) => set({ selectedDay: day }), // selectedMenuOption 초기화 로직 제거
      // setSelectedMenuOption: (option) => set({ selectedMenuOption: option }), <-- 이 액션 제거
      initializeSelectedDay: () => {
        const today = new Date();
        const currentDayOfWeek = today.getDay();
        if (currentDayOfWeek >= 1 && currentDayOfWeek <= 5) {
          const todayDayKey = Object.keys(dayLabels)[currentDayOfWeek - 1] as DayOfWeek;
          set({ selectedDay: todayDayKey });
        } else {
          set({ selectedDay: 'MONDAY' });
        }
      },
    }),
    {
      name: 'menu-store',
    }
  )
);