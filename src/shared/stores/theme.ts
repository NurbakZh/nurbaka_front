import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeType = 'dark' | 'light';

interface IThemeStore {
    fromSystem: boolean;
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    setFromSystem: (fromSystem: boolean) => void;
}

export const useThemeStore = create<IThemeStore>()(
    persist(
        (set) => ({
            fromSystem: false,
            theme: 'dark',
            setTheme: (theme) =>
                set(() => ({
                    theme,
                })),
            setFromSystem: (fromSystem) =>
                set(() => ({
                    fromSystem,
                })),
        }),
        {
            name: 'theme',
            version: 2,
            partialize: (state) =>
                state.fromSystem
                    ? { fromSystem: state.fromSystem }
                    : {
                          theme: state.theme,
                          fromSystem: state.fromSystem,
                      },
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
