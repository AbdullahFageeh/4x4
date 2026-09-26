import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { broncoLight, broncoDark } from '../theme';
import { useAppStore } from '../../store/useAppStore';
import { useBroncoStore } from '../broncoStore';
import { DEMO_TRIPS } from '../../services/demoData';
import { TRIP_CATEGORIES } from '../../types/trip';
import { AdminPanelPart2 } from './AdminPanelPart2';

const SECTIONS = [
  { key: 'trips', icon: '🗺️', label: 'الرحلات', perm: 'trips' },
  { key: 'subscriptions', icon: '💎', label: 'الاشتراكات', perm: 'subscriptions' },
  { key: 'pricing', icon: '💰', label: 'التسعير', perm: 'pricing' },
  { key: 'admins', icon: '👑', label: 'المسؤولون', perm: 'admins' },
  { key: 'analytics', icon: '📊', label: 'التحليلات', perm: 'analytics' },
  { key: 'audit', icon: '📜', label: 'سجل العمليات', perm: 'audit' },
  { key: 'tickets', icon: '🎫', label: 'التذاكر', perm: 'tickets' },
  { key: 'users', icon: '👥', label: 'المستخدمون', perm: 'users' },
];

interface Props {
  navigation: any;
}

export function AdminPanel({ navigation }: Props) {
  const { isDark } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
  const { role, admins, currentUserId, subscriptions, pricing, setPricing, logAction } = useBroncoStore();
  const [active, setActive] = useState('trips');

  const me = admins.find((a) => a.user_id === currentUserId);
  const canSee = (perm: string) => me?.role === 'super_admin' || (me?.permissions ?? []).includes(perm);

  if (role !== 'platform_admin' && !me) {
    return (
      <View style={[styles.noAccess, { backgroundColor: theme.colors.background }]}>
        <Text style={{ fontSize: 56 }}>🔒</Text>
        <Text style={[styles.noAccessTitle, { color: theme.colors.text }]}>صلاحيات غير كافية</Text>
        <Text style={[styles.noAccessSub, { color: theme.colors.textMuted }]}>
          لوحة التحكم متاحة للمسؤولين فقط. بدّل دورك من ملفك الشخصي (زر "تبديل") لتجربة اللوحة.
        </Text>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: theme.colors.primary }]} onPress={navigation.goBack}>
          <Text style={[styles.backText, { color: theme.colors.onPrimary }]}>رجوع</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const visible = SECTIONS.filter((s) => canSee(s.perm));
  const current = visible.find((s) => s.key === active) ?? visible[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Text style={{ color: theme.colors.primary, fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.colors.text }]}>لوحة تحكم البرونكو 🛻</Text>
        <View style={[styles.adminBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.adminBadgeText}>{me?.role === 'super_admin' ? 'أدمن رئيسي' : 'أدمن'}</Text>
        </View>
      </View>

      {/* Section tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
        {visible.map((s) => (
          <TouchableOpacity
            key={s.key}
            style={[
              styles.tab,
              {
                backgroundColor: active === s.key ? theme.colors.primary : theme.colors.card,
                borderColor: active === s.key ? theme.colors.primary : theme.colors.border,
              },
            ]}
            onPress={() => setActive(s.key)}
          >
            <Text style={{ fontSize: 13 }}>{s.icon} </Text>
            <Text style={[styles.tabText, { color: active === s.key ? theme.colors.onPrimary : theme.colors.text }]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {current.key === 'trips' && <TripsAdmin theme={theme} logAction={logAction} />}
        {current.key === 'subscriptions' && <SubsAdmin theme={theme} subscriptions={subscriptions} />}
        {current.key === 'pricing' && <PricingAdmin theme={theme} pricing={pricing} setPricing={setPricing} logAction={logAction} />}
        {current.key === 'admins' && <AdminPanelPart2 page="admins" theme={theme} />}
        {current.key === 'analytics' && <AdminPanelPart2 page="analytics" theme={theme} />}
        {current.key === 'audit' && <AdminPanelPart2 page="audit" theme={theme} />}
        {current.key === 'tickets' && <AdminPanelPart2 page="tickets" theme={theme} />}
        {current.key === 'users' && <AdminPanelPart2 page="users" theme={theme} />}
      </ScrollView>
    </View>
  );
}

function TripsAdmin({ theme, logAction }: { theme: any; logAction: (a: string, t: string, d: string) => void }) {
  const [filter, setFilter] = useState<string>('all');
  const trips = DEMO_TRIPS.filter((t) => (filter === 'all' ? true : t.status === filter));

  return (
    <View>
      <View style={[styles.filterRow]}>
        {[
          { k: 'all', l: 'الكل' },
          { k: 'published', l: 'منشورة' },
          { k: 'cancelled', l: 'ملغاة' },
        ].map((f) => (
          <TouchableOpacity
            key={f.k}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f.k ? theme.colors.primary : theme.colors.card,
                borderColor: filter === f.k ? theme.colors.primary : theme.colors.border,
              },
            ]}
            onPress={() => setFilter(f.k)}
          >
            <Text style={{ color: filter === f.k ? theme.colors.onPrimary : theme.colors.text, fontSize: 12, fontWeight: '600' }}>{f.l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {trips.map((t) => {
        const cat = TRIP_CATEGORIES.find((c) => c.key === t.category);
        return (
          <View key={t.id} style={[styles.adminCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.adminCardTop}>
              <Text style={[styles.adminCardTitle, { color: theme.colors.text }]}>{t.title}</Text>
              <View style={[styles.statusTag, { backgroundColor: t.status === 'published' ? 'rgba(76,175,80,0.15)' : theme.colors.background }]}>
                <Text style={{ color: t.status === 'published' ? theme.colors.success : theme.colors.textMuted, fontSize: 11, fontWeight: '700' }}>
                  {t.status === 'published' ? 'منشورة' : t.status}
                </Text>
              </View>
            </View>
            <Text style={[styles.adminCardMeta, { color: theme.colors.textMuted }]}>
              {cat?.emoji} {cat?.label_ar} • {t.date} • 👥 {t.current_participants}/{t.participant_limit}
            </Text>
            <Text style={[styles.adminCardMeta, { color: theme.colors.textMuted }]}>💰 {t.estimated_cost} ر.س</Text>
            <View style={styles.adminCardActions}>
              <TouchableOpacity
                style={[styles.miniBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                onPress={() => logAction('APPROVE_TRIP', t.id, `موافقة على رحلة ${t.title}`)}
              >
                <Text style={[styles.miniBtnText, { color: theme.colors.success }]}>✓ موافقة</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.miniBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                onPress={() => logAction('CANCEL_TRIP', t.id, `إلغاء رحلة ${t.title}`)}
              >
                <Text style={[styles.miniBtnText, { color: theme.colors.error }]}>✕ إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function SubsAdmin({ theme, subscriptions }: { theme: any; subscriptions: any[] }) {
  const active = subscriptions.filter((s) => s.status === 'active').length;
  const revenue = subscriptions.reduce((sum, s) => sum + (s.tier === 'elite' ? 79 : s.tier === 'pro' ? 29 : 0), 0);

  return (
    <View>
      <View style={[styles.statRow]}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>{active}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>اشتراك نشط</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.statValue, { color: theme.colors.success }]}>{revenue} ر.س</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>إيراد شهري</Text>
        </View>
      </View>
      {subscriptions.map((s) => (
        <View key={s.id} style={[styles.adminCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.adminCardTop}>
            <Text style={[styles.adminCardTitle, { color: theme.colors.text }]}>{s.user?.name}</Text>
            <View style={[styles.tierTag, { backgroundColor: s.tier === 'elite' ? '#C8440B' : s.tier === 'pro' ? '#1D3557' : '#9E9E9E' }]}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>
                {s.tier === 'elite' ? 'إيليت' : s.tier === 'pro' ? 'برو' : 'مجاني'}
              </Text>
            </View>
          </View>
          <Text style={[styles.adminCardMeta, { color: theme.colors.textMuted }]}>
            {s.phone ?? s.user?.phone} • {s.status === 'active' ? '✅ نشط' : s.status === 'past_due' ? '⚠️ متأخر' : 'متوقف'}
          </Text>
          <Text style={[styles.adminCardMeta, { color: theme.colors.textMuted }]}>
            ينتهي: {s.expires_at?.slice(0, 10) ?? '—'}
          </Text>
        </View>
      ))}
    </View>
  );
}

function PricingAdmin({ theme, pricing, setPricing, logAction }: { theme: any; pricing: any; setPricing: (p: any) => void; logAction: (a: string, t: string, d: string) => void }) {
  const [pro, setPro] = useState(String(pricing.pro));
  const [elite, setElite] = useState(String(pricing.elite));

  const save = () => {
    const p = { free: 0, pro: Number(pro) || 0, elite: Number(elite) || 0 };
    setPricing(p);
    logAction('UPDATE_PRICING', 'pricing', `تحديث التسعير: برو ${p.pro} ر.س / إيليت ${p.elite} ر.س`);
  };

  return (
    <View>
      <Text style={[styles.pricingHint, { color: theme.colors.textMuted }]}>
        الأسعار بعملة الريال السعودي / شهريًا. يُعتمد السعر الجديد على كل الاشتراكات الجديدة فورًا.
      </Text>
      {[
        { key: 'pro', label: 'خطة برو', val: pro, set: setPro },
        { key: 'elite', label: 'خطة إيليت', val: elite, set: setElite },
      ].map((p) => (
        <View key={p.key} style={[styles.priceRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.priceLabel, { color: theme.colors.text }]}>{p.label}</Text>
          <View style={[styles.priceInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <TextInput
              style={{ color: theme.colors.text, fontSize: 16, fontWeight: '700', flex: 1, paddingVertical: 8 }}
              value={p.val}
              onChangeText={p.set}
              keyboardType="numeric"
            />
            <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>ر.س/شهر</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]} onPress={save}>
        <Text style={[styles.saveText, { color: theme.colors.onPrimary }]}>حفظ الأسعار</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  noAccess: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  noAccessTitle: { fontSize: 20, fontWeight: '800', marginTop: 12 },
  noAccessSub: { fontSize: 13, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  backBtn: { borderRadius: 12, paddingHorizontal: 32, paddingVertical: 12, marginTop: 20 },
  backText: { fontSize: 15, fontWeight: '700' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1 },
  topTitle: { fontSize: 15, fontWeight: '800' },
  adminBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  adminBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  tabsRow: { paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', gap: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  tabText: { fontSize: 12, fontWeight: '700' },
  content: { flex: 1, padding: 14 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  adminCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  adminCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adminCardTitle: { fontSize: 15, fontWeight: '800', flex: 1 },
  statusTag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  adminCardMeta: { fontSize: 12, marginTop: 5 },
  adminCardActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  miniBtn: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  miniBtnText: { fontSize: 12, fontWeight: '700' },
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 11, marginTop: 4 },
  tierTag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  pricingHint: { fontSize: 12, marginBottom: 12, lineHeight: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  priceLabel: { fontSize: 14, fontWeight: '700' },
  priceInput: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12 },
  saveBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveText: { fontSize: 15, fontWeight: '800' },
});