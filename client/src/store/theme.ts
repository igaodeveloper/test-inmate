import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,

      toggleTheme: () => {
        set((state) => {
          const newIsDark = !state.isDark;
          document.documentElement.classList.toggle('dark', newIsDark);
          return { isDark: newIsDark };
        });
      },

      setTheme: (isDark: boolean) => {
        set({ isDark });
        document.documentElement.classList.toggle('dark', isDark);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.isDark);
        }
      },
    }
  )
);
