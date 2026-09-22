import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { lightTheme, darkTheme } from '../theme';

interface PlaceholderProps {
  title: string;
  subtitle: string;
}

function PlaceholderScreen({ title, subtitle }: PlaceholderProps) {
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center' },
});

// Tab screen wrappers
export function CommunitiesScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('community.title')} subtitle="Coming in Sprint 1" />;
}

export function TripsScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('trip.title')} subtitle="Coming in Sprint 2" />;
}

export function ProfileScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('profile.myProfile')} subtitle="Coming in Sprint 6" />;
}
