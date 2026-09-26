import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { broncoLight, broncoDark } from '../theme';
import { useAppStore } from '../../store/useAppStore';
import { useBroncoStore, useCurrentBroncoUser } from '../broncoStore';

const SOS_TYPES = [
  { key: 'stuck', label: 'متعطل/تطعيس', icon: '🪨' },
  { key: 'accident', label: 'حادث', icon: '🚨' },
  { key: 'medical', label: 'حالة طبية', icon: '🏥' },
  { key: 'flat_tire', label: 'إطار مثقب', icon: '🛞' },
  { key: 'no_fuel', label: 'نفد الوقود', icon: '⛽' },
  { key: 'other', label: 'أخرى', icon: '❓' },
] as const;

interface Props {
  tripId?: string;
}

export function SOSOverlay({ tripId }: Props) {
  const { isDark } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
  const { sendSos, resolveSos, sosAlerts, logAction } = useBroncoStore();
  const user = useCurrentBroncoUser();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const fire = (type: (typeof SOS_TYPES)[number]['key']) => {
    sendSos({
      user_id: user?.id ?? 'user-001',
      trip_id: tripId ?? null,
      type,
      location: { lat: 24.71, lng: 46.68, label: 'طريق الرياض — عرعر' },
    });
    logAction('SOS_ALERT', tripId ?? 'user', `تنبيه SOS (${type}) من ${user?.name}`);
    setOpen(false);
    setSent(true);
  };

  return (
    <>
      {/* Floating SOS button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.error }]}
        onPress={() => {
          setSent(false);
          setOpen(true);
        }}
      >
        <Text style={styles.fabText}>SOS</Text>
        <Text style={styles.fabSub}>🆘</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View style={[styles.backdrop, { backgroundColor: theme.colors.backdrop }]}>
          <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.sheetHeader, { backgroundColor: theme.colors.error }]}>
              <Text style={styles.sheetTitle}>🆘 طلب مساعدة</Text>
              <Text style={styles.sheetSub}>
                سيُخطر أقرب مسؤول/منظّم في القروب بموقعك الحالي فورًا.
              </Text>
            </View>
            {sent ? (
              <View style={styles.sentBox}>
                <Text style={{ fontSize: 48 }}>✅</Text>
                <Text style={[styles.sentTitle, { color: theme.colors.text }]}>تم إرسال التنبيه</Text>
                <Text style={[styles.sentSub, { color: theme.colors.textMuted }]}>
                  أخطرنا سالم الحربي (منظّم) ونوف العتيبي (مسؤولة) بموقعك. عادة يستجيب أحدهم خلال 5 دقائق.
                </Text>
                <TouchableOpacity style={[styles.cta, { backgroundColor: theme.colors.primary }]} onPress={() => setOpen(false)}>
                  <Text style={[styles.ctaText, { color: theme.colors.onPrimary }]}>تم</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={styles.gridWrap}>
                <View style={styles.grid}>
                  {SOS_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t.key}
                      style={[styles.gridItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                      onPress={() => fire(t.key)}
                    >
                      <Text style={{ fontSize: 28 }}>{t.icon}</Text>
                      <Text style={[styles.gridLabel, { color: theme.colors.text }]}>{t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {sosAlerts.length > 0 && (
                  <View style={{ padding: 16 }}>
                    <Text style={[styles.historyTitle, { color: theme.colors.textMuted }]}>آخر التنبيهات</Text>
                    {sosAlerts.slice(0, 3).map((a) => (
                      <View key={a.id} style={[styles.historyRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                        <Text style={{ color: a.status === 'resolved' ? theme.colors.success : theme.colors.warning }}>
                          {a.status === 'resolved' ? '✅' : '🔴'}
                        </Text>
                        <Text style={[styles.historyLabel, { color: theme.colors.text }]} numberOfLines={1}>
                          {SOS_TYPES.find((t) => t.key === a.type)?.label} — {a.location.label}
                        </Text>
                        {a.status !== 'resolved' && (
                          <TouchableOpacity onPress={() => resolveSos(a.id)}>
                            <Text style={{ color: theme.colors.primary, fontSize: 12, fontWeight: '600' }}>حل</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>
                )}
                <TouchableOpacity style={styles.closeRow} onPress={() => setOpen(false)}>
                  <Text style={[styles.closeText, { color: theme.colors.textMuted }]}>إلغاء</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 88,
    right: 16,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: { color: '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 1 },
  fabSub: { fontSize: 12 },
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderRadius: 20, overflow: 'hidden', maxHeight: '80%' },
  sheetHeader: { padding: 16, alignItems: 'center' },
  sheetTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  sheetSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4, textAlign: 'center', lineHeight: 18 },
  gridWrap: { paddingBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 10 },
  gridItem: { width: '30%', aspectRatio: 1, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  gridLabel: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  sentBox: { padding: 28, alignItems: 'center' },
  sentTitle: { fontSize: 17, fontWeight: '700', marginTop: 8 },
  sentSub: { fontSize: 13, marginTop: 8, lineHeight: 20, textAlign: 'center' },
  cta: { borderRadius: 12, paddingVertical: 14, minWidth: 160, alignItems: 'center', marginTop: 16 },
  ctaText: { fontSize: 15, fontWeight: '700' },
  historyTitle: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10, borderWidth: 1, marginBottom: 6 },
  historyLabel: { flex: 1, fontSize: 13 },
  closeRow: { padding: 12, alignItems: 'center' },
  closeText: { fontSize: 14 },
});