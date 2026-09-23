import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';

interface Props {
  navigation: any;
}

export function ProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark, user, signOut } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [carModel, setCarModel] = useState(user?.carModel || '');

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('profile.myProfile')}</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={[styles.editButton, { color: theme.colors.primary }]}>{isEditing ? t('common.done') : t('common.edit')}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile card */}
      <View style={[styles.profileCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={{ fontSize: 32, color: theme.colors.onPrimary }}>👤</Text>
        </View>
        {isEditing ? (
          <>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={name}
              onChangeText={setName}
              placeholder={t('auth.name')}
              placeholderTextColor={theme.colors.placeholder}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={carModel}
              onChangeText={setCarModel}
              placeholder={t('profile.carModel')}
              placeholderTextColor={theme.colors.placeholder}
            />
          </>
        ) : (
          <>
            <Text style={[styles.userName, { color: theme.colors.text }]}>{user?.name}</Text>
            <Text style={[styles.userInfo, { color: theme.colors.textMuted }]}>{user?.phone}</Text>
            <Text style={[styles.userInfo, { color: theme.colors.primaryLight }]}>🚗 {user?.carModel}</Text>
          </>
        )}
      </View>

      {/* Stats */}
      <View style={[styles.statsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>3</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{t('profile.myCommunities')}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>5</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{t('profile.myTrips')}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>2</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>سنة</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={[styles.menuCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={[styles.menuText, { color: theme.colors.text }]}>{t('settings.title')}</Text>
          <Text style={[styles.menuArrow, { color: theme.colors.textMuted }]}>→</Text>
        </TouchableOpacity>
        <View style={[styles.menuDivider, { backgroundColor: theme.colors.divider }]} />
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={[styles.menuText, { color: theme.colors.text }]}>{t('settings.notifications')}</Text>
          <Text style={[styles.menuArrow, { color: theme.colors.textMuted }]}>→</Text>
        </TouchableOpacity>
        <View style={[styles.menuDivider, { backgroundColor: theme.colors.divider }]} />
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={[styles.menuText, { color: theme.colors.text }]}>{t('settings.privacy')}</Text>
          <Text style={[styles.menuArrow, { color: theme.colors.textMuted }]}>→</Text>
        </TouchableOpacity>
        <View style={[styles.menuDivider, { backgroundColor: theme.colors.divider }]} />
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ExternalServices')}>
          <Text style={styles.menuIcon}>☁️</Text>
          <Text style={[styles.menuText, { color: theme.colors.text }]}>{t('externalServices.title')}</Text>
          <Text style={[styles.menuArrow, { color: theme.colors.textMuted }]}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Sign out */}
      <TouchableOpacity onPress={signOut} style={[styles.signOutButton, { backgroundColor: theme.colors.error }]}>
        <Text style={[styles.signOutText, { color: '#fff' }]}>{t('profile.signOut')}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  editButton: { fontSize: 14, fontWeight: '500' },
  profileCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, padding: 20, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  userName: { fontSize: 20, fontWeight: '700' },
  userInfo: { fontSize: 14, marginTop: 4 },
  input: { width: '100%', height: 44, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, marginBottom: 10, fontSize: 16 },
  statsCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, flexDirection: 'row', padding: 16, marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 11, marginTop: 4 },
  divider: { width: 1 },
  menuCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, padding: 8, marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuText: { flex: 1, fontSize: 16 },
  menuArrow: { fontSize: 16 },
  menuDivider: { height: 1, marginHorizontal: 14 },
  signOutButton: { marginHorizontal: 16, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  signOutText: { fontSize: 16, fontWeight: '600' },
});
