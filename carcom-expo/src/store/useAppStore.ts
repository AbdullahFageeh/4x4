import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

export interface User {
  id: string;
  name: string;
  avatarUrl: string | null;
  phone: string;
  preferredLanguage: 'ar' | 'en';
  carModel: string;
  carDetails: {
    year: number;
    color: string;
    modifications: string[];
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  setAuthenticated: (user: User) => void;
  signOut: () => void;
  language: 'ar' | 'en';
  setLanguage: (lng: 'ar' | 'en') => void;
  isDark: boolean;
  toggleTheme: () => void;
  onboardingComplete: boolean;
  setOnboardingComplete: () => void;
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuthenticated: (user) => set({ user, isAuthenticated: true }),
      signOut: () => set({ user: null, isAuthenticated: false }),
      language: 'ar',
      setLanguage: (language) => set({ language }),
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      onboardingComplete: false,
      setOnboardingComplete: () => set({ onboardingComplete: true }),
      isOffline: false,
      setOffline: (isOffline) => set({ isOffline }),
    }),
    {
      name: 'carcom-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        language: state.language,
        isDark: state.isDark,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);
