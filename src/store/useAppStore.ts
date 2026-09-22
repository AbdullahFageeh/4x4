import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
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
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setAuthenticated: (user: User) => void;
  signOut: () => void;

  // Language
  language: 'ar' | 'en';
  setLanguage: (lng: 'ar' | 'en') => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Onboarding
  onboardingComplete: boolean;
  setOnboardingComplete: () => void;

  // Offline
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      setAuthenticated: (user) =>
        set({ user, isAuthenticated: true }),
      signOut: () =>
        set({ user: null, isAuthenticated: false }),

      // Language
      language: 'ar',
      setLanguage: (language) => set({ language }),

      // Theme
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),

      // Onboarding
      onboardingComplete: false,
      setOnboardingComplete: () => set({ onboardingComplete: true }),

      // Offline
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
