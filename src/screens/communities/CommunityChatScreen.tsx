import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';

interface Props {
  navigation: any;
  route: any;
}

export function CommunityChatScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.back, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('chat.communityChat')}</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={[styles.placeholder, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={{ fontSize: 64 }}>💬</Text>
        <Text style={[styles.placeholderTitle, { color: theme.colors.text }]}>{t('chat.communityChat')}</Text>
        <Text style={[styles.placeholderText, { color: theme.colors.textMuted }]}>
          قريباً في Sprint 5
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  back: { fontSize: 24 },
  title: { fontSize: 20, fontWeight: '600' },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  placeholderTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  placeholderText: { fontSize: 14, marginTop: 8 },
});
