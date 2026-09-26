import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

import './src/i18n';
import { useAppStore } from './src/store/useAppStore';
import { useBroncoStore } from './src/bronco/broncoStore';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { broncoLight, broncoDark } from './src/bronco/theme';
import { BroncoOnboarding } from './src/bronco/screens/BroncoOnboarding';
import { BroncoTripsScreen } from './src/bronco/screens/BroncoTripsScreen';
import { BroncoTripDetailScreen } from './src/bronco/screens/BroncoTripDetailScreen';
import { BroncoProfileScreen } from './src/bronco/screens/BroncoProfileScreen';
import { SubscriptionsScreen } from './src/bronco/screens/SubscriptionsScreen';
import { OfflineMapsScreen } from './src/bronco/screens/OfflineMapsScreen';
import { VoiceCallScreen } from './src/bronco/screens/VoiceCallScreen';
import { SOSOverlay } from './src/bronco/components/SOSOverlay';
import { AdminPanel } from './src/bronco/admin/AdminPanel';
import { ChatScreen } from './src/screens/chat/ChatScreen';
import { CommunitiesScreen } from './src/screens/communities/CommunitiesScreen';
import { CreateCommunityScreen } from './src/screens/communities/CreateCommunityScreen';
import { CommunityDetailScreen } from './src/screens/communities/CommunityDetailScreen';
import { CreateTripScreen } from './src/screens/trips/CreateTripScreen';
import { TripMapScreen } from './src/screens/maps/TripMapScreen';
import { PlaceSearchScreen } from './src/screens/maps/PlaceSearchScreen';
import { LiveLocationScreen } from './src/screens/maps/LiveLocationScreen';
import { PaymentsScreen } from './src/screens/payments/PaymentsScreen';
import { SettingsScreen, NotificationsScreen, PrivacyScreen, ExternalServicesScreen } from './src/screens/settings/SettingsScreens';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 2 } },
});

function PlaceholderScreen({ title }: { title: string }) {
  const { isDark } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
  return (
    <ScrollView style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 64 }}>🚧</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.demoLabel, { color: theme.colors.warning }]}>🎬 Demo Mode</Text>
    </ScrollView>
  );
}

function SignInScreen() {
  const { t } = useTranslation();
  const { isDark, setAuthenticated } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
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
      // demo mode: allow any credentials
      const { setUserId } = useBroncoStore.getState();
      setUserId('user-001');
      setAuthenticated({
        id: 'user-001',
        name: 'عبدالله الفقي',
        avatarUrl: null,
        phone: phone || '+966501234567',
        preferredLanguage: 'ar',
        carModel: 'Ford Bronco Badlands',
        carDetails: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    if (data?.user) {
      setAuthenticated({
        id: data.user.id,
        name: data.user.user_metadata?.name || 'مستخدم',
        avatarUrl: null,
        phone: data.user.phone || phone,
        preferredLanguage: 'ar',
        carModel: 'Ford Bronco',
        carDetails: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <ScrollView style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 64 }}>🛻</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>Bronco Edition</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>كروب الفورد برونكو السعودي</Text>
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
      {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
      <View style={{ height: 20 }} />
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isLoading}
        style={[styles.button, { backgroundColor: isLoading ? theme.colors.disabled : theme.colors.primary }]}
      >
        <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>{isLoading ? t('common.loading') : 'دخول 🛻'}</Text>
      </TouchableOpacity>
      <Text style={[styles.demoLabel, { color: theme.colors.warning }]}>🎬 وضع تجريبي — أي بيانات دخول تقبل</Text>
    </ScrollView>
  );
}

function BroncoMainTabs() {
  const { isDark } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
  const { role, liveSharing } = useBroncoStore();
  const [activeTab, setActiveTab] = React.useState(0);
  const [navStack, setNavStack] = React.useState<string[]>([]);
  const [navParams, setNavParams] = React.useState<Record<string, any>>({});

  const navigate = (name: string, params?: any) => {
    setNavStack((prev) => [...prev, name]);
    setNavParams((prev) => ({ ...prev, [name]: params }));
  };

  const goBack = () => setNavStack((prev) => prev.slice(0, -1));
  const navigation = { navigate, goBack };

  if (navStack.length > 0) {
    const current = navStack[navStack.length - 1];
    const params = navParams[current];
    switch (current) {
      case 'BroncoTripDetail': return <BroncoTripDetailScreen navigation={navigation} route={{ params }} />;
      case 'BroncoVoice': return <VoiceCallScreen navigation={navigation} />;
      case 'BroncoSubscriptions': return <SubscriptionsScreen navigation={navigation} />;
      case 'BroncoOfflineMaps': return <OfflineMapsScreen navigation={navigation} />;
      case 'BroncoAdmin': return <AdminPanel navigation={navigation} />;
      case 'BroncoPayments': return <PaymentsScreen navigation={navigation} route={{ params }} />;
      case 'BroncoCommunity': return <CommunitiesScreen navigation={navigation} />;
      case 'BroncoSettings': return <SettingsScreen navigation={navigation} />;
      case 'Notifications': return <NotificationsScreen navigation={navigation} />;
      case 'Privacy': return <PrivacyScreen navigation={navigation} />;
      case 'ExternalServices': return <ExternalServicesScreen navigation={navigation} />;
      case 'CreateCommunity': return <CreateCommunityScreen navigation={navigation} />;
      case 'CommunityDetail': return <CommunityDetailScreen navigation={navigation} route={{ params }} />;
      case 'CreateTrip': return <CreateTripScreen navigation={navigation} />;
      case 'TripMap': return <TripMapScreen navigation={navigation} route={{ params }} />;
      case 'PlaceSearch': return <PlaceSearchScreen navigation={navigation} route={{ params }} />;
      case 'LiveLocation': return <LiveLocationScreen navigation={navigation} route={{ params }} />;
      default: return <PlaceholderScreen title={current} />;
    }
  }

  const tabs = [
    { label: 'الرحلات', icon: '🗺️', screen: <BroncoTripsScreen navigation={navigation} /> },
    { label: 'الخرائط', icon: '📍', screen: <OfflineMapsScreen navigation={navigation} /> },
    { label: 'الدردشة', icon: '💬', screen: <ChatScreen navigation={navigation} route={{ params: { channelId: 'comm-001', channelType: 'community' } }} /> },
    { label: 'حسابي', icon: '👤', screen: <BroncoProfileScreen navigation={navigation} /> },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.broncoHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.broncoLogo, { color: theme.colors.primary }]}>🛻 Bronco</Text>
        {liveSharing && <Text style={[styles.livePill, { color: theme.colors.success }]}>🟢 موقعي مباشر</Text>}
        <TouchableOpacity onPress={() => navigate('BroncoAdmin')}>
          <Text style={{ fontSize: 18 }}>
            {role === 'platform_admin' ? '⚙️' : '👤'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.flex}>{tabs[activeTab].screen}</View>

      <SOSOverlay />

      <View style={[styles.tabBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => { setActiveTab(index); setNavStack([]); }}
            style={styles.tabItem}
          >
            <Text style={{ fontSize: 22 }}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, { color: activeTab === index ? theme.colors.primary : theme.colors.textMuted }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useAppStore();
  const { broncoOnboardingComplete } = useBroncoStore();
  if (!broncoOnboardingComplete) return <BroncoOnboarding onFinished={() => useBroncoStore.getState().setBroncoOnboardingComplete()} />;
  if (!isAuthenticated) return <SignInScreen />;
  return <BroncoMainTabs />;
}

export default function App() {
  const { isDark } = useAppStore();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <View style={[styles.container, { backgroundColor: isDark ? broncoDark.colors.background : broncoLight.colors.background }]}>
            <AppNavigator />
          </View>
        </ErrorBoundary>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
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
  broncoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  broncoLogo: { fontSize: 17, fontWeight: '900' },
  livePill: { fontSize: 12, fontWeight: '700' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8, paddingBottom: 16, borderTopWidth: 1 },
  tabItem: { alignItems: 'center', flex: 1 },
  tabLabel: { fontSize: 11, marginTop: 3 },
});