import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './src/i18n';
import { useAppStore } from './src/store/useAppStore';
import { lightTheme, darkTheme } from './src/theme';

import { OnboardingScreen } from './src/screens/onboarding/OnboardingScreen';
import { SignInScreen } from './src/screens/auth/SignInScreen';
import { SignUpScreen } from './src/screens/auth/SignUpScreen';
import { ProfileScreen } from './src/screens/PlaceholderScreens';
import { CommunitiesScreen } from './src/screens/communities/CommunitiesScreen';
import { CreateCommunityScreen } from './src/screens/communities/CreateCommunityScreen';
import { CommunityDetailScreen } from './src/screens/communities/CommunityDetailScreen';
import { CommunityChatScreen } from './src/screens/communities/CommunityChatScreen';
import { TripsScreen } from './src/screens/trips/TripsScreen';
import { CreateTripScreen } from './src/screens/trips/CreateTripScreen';
import { TripDetailScreen } from './src/screens/trips/TripDetailScreen';
import { TripChatScreen, TripPaymentsScreen } from './src/screens/trips/TripChatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="CommunitiesTab" component={CommunitiesScreen} />
      <Tab.Screen name="TripsTab" component={TripsScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, onboardingComplete } = useAppStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingComplete ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !isAuthenticated ? (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="CreateCommunity" component={CreateCommunityScreen} />
          <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
          <Stack.Screen name="CommunityChat" component={CommunityChatScreen} />
          <Stack.Screen name="CreateTrip" component={CreateTripScreen} />
          <Stack.Screen name="TripDetail" component={TripDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const { isDark } = useAppStore();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
          />
          <AppNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
