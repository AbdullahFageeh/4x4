import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import './src/i18n';
import { useAppStore } from './src/store/useAppStore';
import { lightTheme, darkTheme } from './src/theme';
import { CommunitiesScreen } from './src/screens/communities/CommunitiesScreen';
import { CreateCommunityScreen } from './src/screens/communities/CreateCommunityScreen';
import { CommunityDetailScreen } from './src/screens/communities/CommunityDetailScreen';
import { TripsScreen } from './src/screens/trips/TripsScreen';
import { CreateTripScreen } from './src/screens/trips/CreateTripScreen';
import { TripDetailScreen } from './src/screens/trips/TripDetailScreen';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 2 } },
});

function PlaceholderScreen({ title }: { title: string }) {
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <ScrollView style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 64 }}>🚧</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>قيد التطوير</Text>
    </ScrollView>
  );
}

function OnboardingScreen() {
  const { isDark, setOnboardingComplete } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 80 }}>🚗</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>CarCom</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>مجتمعات السيارات السعودية</Text>
      <View style={{ height: 60 }} />
      <View style={[styles.button, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]} onPress={() => setOnboardingComplete()}>
          ابدأ الآن
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
      <Text style={{ fontSize: 64 }}>🔑</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>تسجيل الدخول</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>أدخل رقم الجوال للمتابعة</Text>
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
          متابعة كحساب تجريبي
        </Text>
      </View>
      <Text style={[styles.demoLabel, { color: theme.colors.warning }]}>🎬 وضع التجربة</Text>
    </View>
  );
}

function MainTabs() {
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const [activeTab, setActiveTab] = React.useState(0);
  const [navStack, setNavStack] = React.useState<string[]>([]);
  const [navParams, setNavParams] = React.useState<Record<string, any>>({});

  const navigate = (name: string, params?: any) => {
    setNavStack((prev) => [...prev, name]);
    setNavParams((prev) => ({ ...prev, [name]: params }));
  };

  const goBack = () => {
    setNavStack((prev) => prev.slice(0, -1));
  };

  const navigation = { navigate, goBack };

  if (navStack.length > 0) {
    const current = navStack[navStack.length - 1];
    const params = navParams[current];
    if (current === 'CreateCommunity') return <CreateCommunityScreen navigation={navigation} />;
    if (current === 'CommunityDetail') return <CommunityDetailScreen navigation={navigation} route={{ params }} />;
    if (current === 'CommunityChat') return <PlaceholderScreen title="Community Chat" />;
    if (current === 'CreateTrip') return <CreateTripScreen navigation={navigation} />;
    if (current === 'TripDetail') return <TripDetailScreen navigation={navigation} route={{ params }} />;
    if (current === 'TripMap') return <PlaceholderScreen title="Trip Map" />;
    return <PlaceholderScreen title={current} />;
  }

  return (
    <View style={styles.container}>
      {activeTab === 0 && <CommunitiesScreen navigation={navigation} />}
      {activeTab === 1 && <TripsScreen navigation={navigation} />}
      {activeTab === 2 && <PlaceholderScreen title="حسابي" />}
      <View style={[styles.tabBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        {['المجتمعات', 'الرحلات', 'حسابي'].map((label, index) => (
          <TouchableOpacity key={index} onPress={() => { setActiveTab(index); setNavStack([]); }} style={styles.tabItem}>
            <Text style={{ fontSize: 24 }}>{['🏘️', '🗺️', '👤'][index]}</Text>
            <Text style={[styles.tabLabel, { color: activeTab === index ? theme.colors.primary : theme.colors.textMuted }]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function AppNavigator() {
  const { isAuthenticated, onboardingComplete } = useAppStore();
  if (!onboardingComplete) return <OnboardingScreen />;
  if (!isAuthenticated) return <SignInScreen />;
  return <MainTabs />;
}

export default function App() {
  const { isDark } = useAppStore();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={[styles.container, { backgroundColor: isDark ? darkTheme.colors.background : lightTheme.colors.background }]}>
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
  demoLabel: { fontSize: 14, fontWeight: '600', marginTop: 20 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  tabItem: { alignItems: 'center', flex: 1 },
  tabLabel: { fontSize: 12, marginTop: 4 },
});
