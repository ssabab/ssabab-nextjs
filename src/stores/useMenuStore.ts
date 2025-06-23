import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getWeeklyMenuCached, WeeklyMenu } from '@/lib/api';

interface MenuStoreState {
  weeklyMenus: WeeklyMenu[];
  loading: boolean;
  selectedDate: string | null;
  selectedMenuId: number | null;
  setWeeklyMenus: (menus: WeeklyMenu[]) => void;
  setSelected: (date: string, menuId: number) => void;
  fetchWeeklyMenus: () => Promise<void>;
}

export const useMenuStore = create<MenuStoreState>()(
  devtools(
    (set) => ({
      weeklyMenus: [],
      loading: false,
      selectedDate: null,
      selectedMenuId: null,

      setWeeklyMenus: (menus) => set({ weeklyMenus: menus }),
      setSelected: (date, menuId) => set({ selectedDate: date, selectedMenuId: menuId }),

      fetchWeeklyMenus: async () => {
        set({ loading: true });
        try {
          const res = await getWeeklyMenuCached();
          set({ weeklyMenus: res.data.weeklyMenus, loading: false });
        } catch (e) {
          set({ loading: false });
        }
      },
    }),
    { name: 'menu-store' }
  )
);
