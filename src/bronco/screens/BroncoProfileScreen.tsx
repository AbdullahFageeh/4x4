import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { broncoLight, broncoDark } from '../theme';
import { useAppStore } from '../../store/useAppStore';
import { useBroncoStore, useCurrentBroncoUser } from '../broncoStore';
import { UserRole } from '../types';

interface Props {
  navigation: any;
}

const ROLE_LABELS: Record<string, string> = {
  member: '🚙 عضو',
  organizer: '🗺️ منظّم رحلات',
  community_admin: '🛠️ مسؤول مجتمع',
  platform_admin: '👑 مسؤول منصة',
};

const TIER_BADGES: Record<string, { label: string; bg: string }> = {
  free: { label: 'مجاني', bg: '#9E9E9E' },
  pro: { label: 'برو', bg: '#1D3557' },
  elite: { label: 'إيليت', bg: '#C8440B' },
};

export function BroncoProfileScreen({ navigation }: Props) {
  const { isDark, signOut } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
  const user = useCurrentBroncoUser();
  const { reviews, subscriptions, setRole } = useBroncoStore();
  const [roleSheet, setRoleSheet] = useState(false);

  if (!user) return null;
  const tier = TIER_BADGES[user.subscription ?? 'free'];
  const myReviews = reviews.filter((r) => r.user_id === user.id);
  const avgRating = myReviews.length
    ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1)
    : '—';

  const car = user.car;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header card */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerTop}>
          <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
            <Text style={{ fontSize: 34 }}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.phone}>{user.phone} • {user.city}</Text>
            <TouchableOpacity onPress={() => setRoleSheet(true)}>
              <View style={styles.rolePill}>
                <Text style={styles.roleText}>{ROLE_LABELS[user.role]}</Text>
                <Text style={styles.changeRole}>تبديل ⇄</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.hStat}>
            <Text style={styles.hStatValue}>5</Text>
            <Text style={styles.hStatLabel}>رحلات</Text>
          </View>
          <View style={styles.hDivider}>
            <View style={styles.hStat}>
              <Text style={styles.hStatValue}>2</Text>
              <Text style={styles.hStatLabel}>مجتمعات</Text>
            </View>
          </View>
          <View style={styles.hStat}>
            <Text style={styles.hStatValue}>{avgRating}</Text>
            <Text style={styles.hStatLabel}>تقييمي ★</Text>
          </View>
        </View>
      </View>

      {/* Subscription badge */}
      <View style={[styles.subCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          <View style={[styles.tierBadge, { backgroundColor: tier.bg }]}>
            <Text style={styles.tierBadgeText}>{tier.label}</Text>
          </View>
          <View>
            <Text style={[styles.subTitle, { color: theme.colors.text }]}>اشتراكك الحالي</Text>
            <Text style={[styles.subDate, { color: theme.colors.textMuted }]}>
              {user.subscription === 'free'
                ? 'خطة مجانية'
                : `ينتهي ${subscriptions.find((s) => s.user_id === user.id)?.expires_at?.slice(0, 10) ?? '—'}`}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.upgradeBtn, { backgroundColor: theme.colors.primary }]} onPress={() => navigation.navigate('BroncoSubscriptions')}>
          <Text style={[styles.upgradeText, { color: theme.colors.onPrimary }]}>تطوير</Text>
        </TouchableOpacity>
      </View>

      {/* Car card */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🛻 سيارتي</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BroncoSettings')}>
            <Text style={[styles.editLink, { color: theme.colors.primary }]}>تعديل</Text>
          </TouchableOpacity>
        </View>
        {car ? (
          <View>
            <Text style={[styles.carModel, { color: theme.colors.text }]}>{car.model}</Text>
            <View style={styles.specRow}>
              <SpecItem label="الموديل" value={String(car.year)} theme={theme} />
              <SpecItem label="اللون" value={car.color} theme={theme} />
              <SpecItem label="المحرك" value={car.engine} theme={theme} />
              <SpecItem label="الناقل" value={car.driveType} theme={theme} />
              <SpecItem label="اللوحة" value={car.plate} theme={theme} />
              <SpecItem label="آخر صيانة" value={car.lastService ?? '—'} theme={theme} />
            </View>
            <View style={styles.modRow}>
              {car.modifications.map((m) => (
                <View key={m} style={[styles.modChip, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                  <Text style={[styles.modText, { color: theme.colors.textMuted }]}>{m}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{ fontSize: 40 }}>🚗</Text>
            <Text style={[styles.noCar, { color: theme.colors.textMuted }]}>لم تضف سيارتك بعد</Text>
            <TouchableOpacity style={[styles.addCarBtn, { backgroundColor: theme.colors.primary }]} onPress={() => navigation.navigate('BroncoSettings')}>
              <Text style={[styles.addCarText, { color: theme.colors.onPrimary }]}>إضافة سيارتي</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Info sections */}
      <SectionRow theme={theme} icon="🪪" title="الهوية" value={user.nationalId ?? '—'} />
      <SectionRow theme={theme} icon="🏘️" title="النقابة" value={user.club ?? 'غير مسجل'} onPress={() => navigation.navigate('BroncoCommunity')} />
      <SectionRow theme={theme} icon="⭐" title="آخر تقييماتي" value={myReviews[0]?.comment.slice(0, 40) + '…' || 'لا توجد'} onPress={() => navigation.navigate('TripDetail', { id: 'trip-001' })} />

      <TouchableOpacity style={[styles.signOutBtn, { borderColor: theme.colors.error }]} onPress={signOut}>
        <Text style={[styles.signOutText, { color: theme.colors.error }]}>تسجيل الخروج</Text>
      </TouchableOpacity>

      {/* Role switch modal */}
      <Modal visible={roleSheet} transparent animationType="fade">
        <View style={[styles.modalBackdrop, { backgroundColor: theme.colors.backdrop }]}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>تبديل الدور (وضع تجريبي)</Text>
            {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleRow,
                  {
                    backgroundColor: user.role === r ? theme.colors.primary : theme.colors.background,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => {
                  setRole(r);
                  setRoleSheet(false);
                }}
              >
                <Text style={{ color: user.role === r ? theme.colors.onPrimary : theme.colors.text, fontSize: 14, fontWeight: '700' }}>
                  {ROLE_LABELS[r]}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setRoleSheet(false)}>
              <Text style={[styles.modalCloseText, { color: theme.colors.textMuted }]}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function SpecItem({ label, value, theme }: { label: string; value: string; theme: any }) {
  return (
    <View style={[styles.spec, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
      <Text style={[styles.specLabel, { color: theme.colors.textMuted }]}>{label}</Text>
      <Text style={[styles.specValue, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );
}

function SectionRow({ theme, icon, title, value, onPress }: { theme: any; icon: string; title: string; value: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={onPress}
    >
      <View style={styles.sectionHead}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{icon} {title}</Text>
      </View>
      <Text style={[styles.rowValue, { color: theme.colors.textMuted }]} numberOfLines={1}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  name: { color: '#fff', fontSize: 19, fontWeight: '800', marginLeft: 12 },
  phone: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginLeft: 12, marginTop: 2 },
  rolePill: { flexDirection: 'row', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 12, marginTop: 8 },
  roleText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  changeRole: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginLeft: 6 },
  headerStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 18 },
  hStat: { alignItems: 'center' },
  hDivider: { justifyContent: 'center', alignItems: 'center' },
  hStatValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  hStatLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  subCard: { flexDirection: 'row', alignItems: 'center', margin: 16, borderRadius: 14, borderWidth: 1, padding: 14 },
  tierBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  tierBadgeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  subTitle: { fontSize: 14, fontWeight: '700' },
  subDate: { fontSize: 12, marginTop: 2 },
  upgradeBtn: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  upgradeText: { fontWeight: '700', fontSize: 13 },
  section: { marginHorizontal: 16, marginBottom: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  editLink: { fontSize: 13, fontWeight: '600' },
  carModel: { fontSize: 17, fontWeight: '800', marginBottom: 12 },
  specRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  spec: { borderRadius: 10, borderWidth: 1, padding: 8, flexBasis: '30%' },
  specLabel: { fontSize: 10 },
  specValue: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  modRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  modChip: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
  modText: { fontSize: 11 },
  noCar: { fontSize: 13, marginTop: 8 },
  addCarBtn: { borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10, marginTop: 12 },
  addCarText: { fontWeight: '700', fontSize: 13 },
  rowValue: { fontSize: 13 },
  signOutBtn: { margin: 16, borderRadius: 12, borderWidth: 1, paddingVertical: 14, alignItems: 'center', marginBottom: 28 },
  signOutText: { fontWeight: '700' },
  modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  modalCard: { width: '100%', borderRadius: 16, padding: 18, gap: 8 },
  modalTitle: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  roleRow: { borderRadius: 12, borderWidth: 1, paddingVertical: 13, alignItems: 'center' },
  modalClose: { alignItems: 'center', paddingVertical: 8 },
  modalCloseText: { fontSize: 13 },
});