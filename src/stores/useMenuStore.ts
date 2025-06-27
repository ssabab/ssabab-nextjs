import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '@/lib/api';

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

interface MenuState {
  weeklyMenus: WeeklyMenu[];
  loading: boolean;
  selectedDate: string | null;
  selectedMenuId: number | null;
  setWeeklyMenus: (menus: WeeklyMenu[]) => void;
  setSelected: (date: string, menuId: number) => void;
  fetchWeeklyMenus: (date: string) => Promise<void>;
}

export const useMenuStore = create<MenuState>()(
  devtools(
    (set) => ({
      weeklyMenus: [],
      loading: false,
      selectedDate: null,
      selectedMenuId: null,

      setWeeklyMenus: (menus) => set({ weeklyMenus: menus }),
      setSelected: (date, menuId) => set({ selectedDate: date, selectedMenuId: menuId }),

      fetchWeeklyMenus: async (date) => {
        set({ loading: true });
        try {
          const response = await api.get<{ weeklyMenus: WeeklyMenu[] }>(`/api/menu/weekly?date=${date}`);
          set({ weeklyMenus: response.data.weeklyMenus, loading: false });
        } catch (error) {
          console.error("Failed to fetch weekly menus:", error);
          set({ loading: false });
        }
      },
    }),
    { name: 'menu-store' }
  )
);
