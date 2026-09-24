import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

import './src/i18n';
import { useAppStore } from './src/store/useAppStore';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { lightTheme, darkTheme } from './src/theme';
import { CommunitiesScreen } from './src/screens/communities/CommunitiesScreen';
import { CreateCommunityScreen } from './src/screens/communities/CreateCommunityScreen';
import { CommunityDetailScreen } from './src/screens/communities/CommunityDetailScreen';
import { TripsScreen } from './src/screens/trips/TripsScreen';
import { CreateTripScreen } from './src/screens/trips/CreateTripScreen';
import { TripDetailScreen } from './src/screens/trips/TripDetailScreen';
import { TripMapScreen } from './src/screens/maps/TripMapScreen';
import { PlaceSearchScreen } from './src/screens/maps/PlaceSearchScreen';
import { LiveLocationScreen } from './src/screens/maps/LiveLocationScreen';
import { ChatScreen } from './src/screens/chat/ChatScreen';
import { PaymentsScreen } from './src/screens/payments/PaymentsScreen';
import { ProfileScreen } from './src/screens/profile/ProfileScreen';
import { SettingsScreen, NotificationsScreen, PrivacyScreen, ExternalServicesScreen } from './src/screens/settings/SettingsScreens';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 2 } },
});

function PlaceholderScreen({ title }: { title: string }) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <ScrollView style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 64 }}>🚧</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{t('onboarding.comingSoon')}</Text>
      <Text style={[styles.demoLabel, { color: theme.colors.warning }]}>🎬 {t('onboarding.demo')}</Text>
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
  const { t } = useTranslation();
  const { isDark, setAuthenticated } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSignIn = async () => {
    if (!phone || !password) {
      setError(t('auth.phoneRequired'));
      return;
    }
    setIsLoading(true);
    setError(null);

    const { signInWithPhone } = await import('./src/services/supabase');
    const { data, error: signInError } = await signInWithPhone(phone, password);

    setIsLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    if (data?.user) {
      setAuthenticated({
        id: data.user.id,
        name: data.user.user_metadata?.name || 'مستخدم',
        avatarUrl: null,
        phone: data.user.phone || phone,
        preferredLanguage: 'ar',
        carModel: '',
        carDetails: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <ScrollView style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 64 }}>🔑</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{t('auth.signIn')}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{t('auth.welcomeBack')}</Text>
      <View style={{ height: 40 }} />
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
        value={phone}
        onChangeText={setPhone}
        placeholder={t('auth.phone')}
        placeholderTextColor={theme.colors.placeholder}
        keyboardType="phone-pad"
      />
      <View style={{ height: 12 }} />
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
        value={password}
        onChangeText={setPassword}
        placeholder={t('auth.password')}
        placeholderTextColor={theme.colors.placeholder}
        secureTextEntry
      />
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      )}
      <View style={{ height: 20 }} />
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isLoading}
        style={[styles.button, { backgroundColor: isLoading ? theme.colors.disabled : theme.colors.primary }]}
      >
        <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
          {isLoading ? t('common.loading') : t('auth.signIn')}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.demoLabel, { color: theme.colors.warning }]}>🎬 {t('onboarding.demo')}</Text>
    </ScrollView>
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
    switch (current) {
      case 'CreateCommunity': return <CreateCommunityScreen navigation={navigation} />;
      case 'CommunityDetail': return <CommunityDetailScreen navigation={navigation} route={{ params }} />;
      case 'CommunityChat': return <ChatScreen navigation={navigation} route={{ params: { channelId: params?.id, channelType: 'community' } }} />;
      case 'CreateTrip': return <CreateTripScreen navigation={navigation} />;
      case 'TripDetail': return <TripDetailScreen navigation={navigation} route={{ params }} />;
      case 'TripMap': return <TripMapScreen navigation={navigation} route={{ params }} />;
      case 'PlaceSearch': return <PlaceSearchScreen navigation={navigation} route={{ params }} />;
      case 'TripChat': return <ChatScreen navigation={navigation} route={{ params: { channelId: params?.id, channelType: 'trip' } }} />;
      case 'LiveLocation': return <LiveLocationScreen navigation={navigation} route={{ params }} />;
      case 'Payments': return <PaymentsScreen navigation={navigation} route={{ params }} />;
      case 'Profile': return <ProfileScreen navigation={navigation} />;
      case 'Settings': return <SettingsScreen navigation={navigation} />;
      case 'Notifications': return <NotificationsScreen navigation={navigation} />;
      case 'Privacy': return <PrivacyScreen navigation={navigation} />;
      case 'ExternalServices': return <ExternalServicesScreen navigation={navigation} />;
      default: return <PlaceholderScreen title={current} />;
    }
  }

  return (
    <View style={styles.container}>
      {activeTab === 0 && <CommunitiesScreen navigation={navigation} />}
      {activeTab === 1 && <TripsScreen navigation={navigation} />}
      {activeTab === 2 && <ProfileScreen navigation={navigation} />}
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
        <ErrorBoundary>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <View style={[styles.container, { backgroundColor: isDark ? darkTheme.colors.background : lightTheme.colors.background }]}>
            <AppNavigator />
          </View>
        </ErrorBoundary>
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
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    minWidth: 200,
    width: 280,
  },
  errorText: { fontSize: 14, marginTop: 8 },
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
