import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, Text, StyleSheet } from 'react-native';

import './src/i18n';
import { useAppStore } from './src/store/useAppStore';
import { lightTheme, darkTheme } from './src/theme';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 2 } },
});

function OnboardingScreen() {
  const { isDark, setOnboardingComplete } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 64 }}>🚗</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>CarCom</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Saudi Car Communities</Text>
      <View style={{ height: 40 }} />
      <View style={[styles.button, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]} onPress={() => setOnboardingComplete()}>
          Get Started
        </Text>
      </View>
    </View>
  );
}

function SignInScreen() {
  const { isDark, setAuthenticated } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 48 }}>🔑</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>Sign In</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
        Demo mode — tap to continue
      </Text>
      <View style={{ height: 40 }} />
      <View style={[styles.button, { backgroundColor: theme.colors.primary }]}>
        <Text
          style={[styles.buttonText, { color: theme.colors.onPrimary }]}
          onPress={() =>
            setAuthenticated({
              id: 'demo-user-001',
              name: 'عبدالله',
              avatarUrl: null,
              phone: '+966500000000',
              preferredLanguage: 'ar',
              carModel: 'Toyota Land Cruiser 2022',
              carDetails: { year: 2022, color: 'White', modifications: [] },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          }>
          Continue as Demo User
        </Text>
      </View>
    </View>
  );
}

function MainScreen() {
  const { isDark, user, signOut } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 64 }}>🏁</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>Welcome!</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{user?.name}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{user?.carModel}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
        {user?.phone}
      </Text>
      <View style={{ height: 40 }} />
      <Text style={[styles.demoLabel, { color: theme.colors.warning }]}>
        🎬 Demo Mode — Supabase not configured
      </Text>
      <Text style={[styles.demoText, { color: theme.colors.textMuted }]}>
        Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable real auth
      </Text>
      <View style={{ height: 20 }} />
      <View style={[styles.button, { backgroundColor: theme.colors.error }]}>
        <Text style={[styles.buttonText, { color: '#fff' }]} onPress={signOut}>
          Sign Out
        </Text>
      </View>
    </View>
  );
}

function AppNavigator() {
  const { isAuthenticated, onboardingComplete } = useAppStore();
  if (!onboardingComplete) return <OnboardingScreen />;
  if (!isAuthenticated) return <SignInScreen />;
  return <MainScreen />;
}

export default function App() {
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <AppNavigator />
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 16 },
  subtitle: { fontSize: 14, marginTop: 4 },
  button: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, minWidth: 200, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  demoLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  demoText: { fontSize: 12, textAlign: 'center', paddingHorizontal: 20 },
});
