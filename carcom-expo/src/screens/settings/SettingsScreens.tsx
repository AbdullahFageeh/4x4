import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';

interface Props {
  navigation: any;
}

export function SettingsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark, toggleTheme, language, setLanguage } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  const menuItems = [
    { icon: '🔔', label: t('settings.notifications'), screen: 'Notifications' },
    { icon: '🔒', label: t('settings.privacy'), screen: 'Privacy' },
    { icon: '🎨', label: t('settings.theme'), action: toggleTheme, isToggle: true, value: isDark },
    { icon: '🌐', label: t('settings.language'), action: () => setLanguage(language === 'ar' ? 'en' : 'ar'), subtitle: language === 'ar' ? 'العربية' : 'English' },
    { icon: '☁️', label: t('externalServices.title'), screen: 'ExternalServices' },
    { icon: '❓', label: t('settings.help'), screen: 'Help' },
    { icon: 'ℹ️', label: t('settings.about'), screen: 'About' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('settings.title')}</Text>
      </View>
      <View style={[styles.menuCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={item.action || (() => item.screen && navigation.navigate(item.screen))}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>{item.label}</Text>
              {'subtitle' in item && item.subtitle ? (
                <Text style={[styles.menuSubtitle, { color: theme.colors.textMuted }]}>{item.subtitle}</Text>
              ) : item.isToggle ? (
                <Switch value={item.value} onValueChange={item.action} trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }} />
              ) : (
                <Text style={[styles.menuArrow, { color: theme.colors.textMuted }]}>→</Text>
              )}
            </TouchableOpacity>
            {index < menuItems.length - 1 && <View style={[styles.menuDivider, { backgroundColor: theme.colors.divider }]} />}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

export function NotificationsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const [notifications, setNotifications] = useState({
    tripReminders: true, chatMessages: true, communityUpdates: false, paymentReminders: true, departureAlerts: true,
  });

  const items = [
    { key: 'tripReminders', label: t('settings.tripReminders'), icon: '📅' },
    { key: 'chatMessages', label: t('settings.chatMessages'), icon: '💬' },
    { key: 'communityUpdates', label: t('settings.communityUpdates'), icon: '🏘️' },
    { key: 'paymentReminders', label: t('settings.paymentReminders'), icon: '💰' },
    { key: 'departureAlerts', label: t('settings.departureAlerts'), icon: '🚩' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('settings.notifications')}</Text>
      </View>
      <View style={[styles.menuCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {items.map((item) => (
          <View key={item.key}>
            <View style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuText, { color: theme.colors.text, flex: 1 }]}>{item.label}</Text>
              <Switch
                value={notifications[item.key as keyof typeof notifications]}
                onValueChange={(val) => setNotifications((prev) => ({ ...prev, [item.key]: val }))}
                trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function PrivacyScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const [settings, setSettings] = useState({
    tripVisibility: 'community',
    locationVisibility: 'trip',
    autoExpire: true,
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('settings.privacy')}</Text>
      </View>
      <View style={[styles.menuCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('settings.whoCanSeeTrips')}</Text>
        {[{ value: 'everyone', label: t('settings.everyone') }, { value: 'community', label: t('settings.communityMembers') }].map((opt) => (
          <TouchableOpacity key={opt.value} onPress={() => setSettings((s) => ({ ...s, tripVisibility: opt.value }))} style={styles.radioRow}>
            <View style={[styles.radio, { borderColor: theme.colors.primary }]}>
              {settings.tripVisibility === opt.value && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
            </View>
            <Text style={[styles.radioLabel, { color: theme.colors.text }]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={[styles.menuDivider, { backgroundColor: theme.colors.divider }]} />
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('settings.whoCanSeeLocation')}</Text>
        {[{ value: 'trip', label: t('settings.tripParticipants') }, { value: 'community', label: t('settings.communityMembers') }].map((opt) => (
          <TouchableOpacity key={opt.value} onPress={() => setSettings((s) => ({ ...s, locationVisibility: opt.value }))} style={styles.radioRow}>
            <View style={[styles.radio, { borderColor: theme.colors.primary }]}>
              {settings.locationVisibility === opt.value && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
            </View>
            <Text style={[styles.radioLabel, { color: theme.colors.text }]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={[styles.menuDivider, { backgroundColor: theme.colors.divider }]} />
        <View style={styles.menuItem}>
          <Text style={styles.menuIcon}>⏰</Text>
          <Text style={[styles.menuText, { color: theme.colors.text }]}>{t('settings.autoExpireLocation')}</Text>
          <Switch value={settings.autoExpire} onValueChange={(val) => setSettings((s) => ({ ...s, autoExpire: val }))} trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }} />
        </View>
      </View>
      <View style={[styles.disclaimer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.disclaimerText, { color: theme.colors.textMuted }]}>{t('settings.disclaimer')}</Text>
      </View>
    </ScrollView>
  );
}

export function ExternalServicesScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  const services = [
    { name: 'Supabase', desc: t('externalServices.supabase'), status: 'required' },
    { name: 'Google Maps', desc: t('externalServices.googleMaps'), status: 'required' },
    { name: 'Moyasar', desc: t('externalServices.moyasar'), status: 'test' },
    { name: 'Firebase', desc: t('externalServices.firebase'), status: 'required' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('externalServices.title')}</Text>
      </View>
      <View style={[styles.menuCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {services.map((s) => (
          <View key={s.name} style={styles.serviceRow}>
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceName, { color: theme.colors.text }]}>{s.name}</Text>
              <Text style={[styles.serviceDesc, { color: theme.colors.textMuted }]}>{s.desc}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: s.status === 'test' ? theme.colors.warning : theme.colors.primary }]}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
                {s.status === 'test' ? 'تجريبي' : 'مطلوب'}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={[styles.infoBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
          هذا التطبيق يستخدم خدمات خارجية تتطلب حسابات منفصلة. راجع الوثائق للحصول على تعليمات الإعداد.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  backButton: { fontSize: 24 },
  menuCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, padding: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuText: { flex: 1, fontSize: 16 },
  menuSubtitle: { fontSize: 12 },
  menuArrow: { fontSize: 16 },
  menuDivider: { height: 1, marginVertical: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12, marginTop: 8 },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  radioLabel: { fontSize: 16 },
  disclaimer: { margin: 16, borderRadius: 12, borderWidth: 1, padding: 16 },
  disclaimerText: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '500' },
  serviceDesc: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  infoBox: { margin: 16, borderRadius: 12, borderWidth: 1, padding: 16 },
  infoText: { fontSize: 13, lineHeight: 20 },
});
