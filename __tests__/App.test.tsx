/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('expo-location', () => ({
  getCurrentPositionAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  Accuracy: { High: 3 },
}));

jest.mock('expo-image-picker', () => ({
  launchImagePickerAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  QueryClient: class QueryClient {},
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-mmkv', () => ({
  MMKV: class MMKV {
    getString() { return null; }
    set() {}
    delete() {}
  },
}));

jest.mock('zustand', () => {
  const actual = jest.requireActual('zustand');
  const mockStore: any = {
    user: null,
    isAuthenticated: false,
    language: 'en',
    isDark: false,
    onboardingComplete: false,
    isOffline: false,
    setAuthenticated: jest.fn(),
    signOut: jest.fn(),
    setLanguage: jest.fn(),
    toggleTheme: jest.fn(),
    setOnboardingComplete: jest.fn(),
    setOffline: jest.fn(),
  };
  return {
    ...actual,
    create: () => () => mockStore,
    persist: () => (f: any) => f,
  };
});

jest.mock('../src/i18n', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
  changeLanguage: jest.fn(),
  default: {},
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => React.createElement('div', {}, children),
    Marker: () => null,
    Polyline: () => null,
  };
});

import App from '../App';

test('App component loads without crashing', () => {
  // onboardingComplete is false → App shows OnboardingScreen
  const tree = ReactTestRenderer.create(<App />);
  expect(tree).toBeTruthy();
  ReactTestRenderer.act(() => {});
  tree.unmount();
});

test('ErrorBoundary renders children when no error', () => {
  const { ErrorBoundary } = require('../src/components/ErrorBoundary');
  const tree = ReactTestRenderer.create(
    <ErrorBoundary>
      <React.Fragment />
    </ErrorBoundary>
  );
  expect(tree).toBeTruthy();
  ReactTestRenderer.act(() => {});
  tree.unmount();
});
