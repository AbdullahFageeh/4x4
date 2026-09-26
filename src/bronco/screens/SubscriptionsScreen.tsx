import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { broncoLight, broncoDark } from '../theme';
import { useAppStore } from '../../store/useAppStore';
import { useBroncoStore, useCurrentBroncoUser } from '../broncoStore';
import { DEMO_SUBSCRIPTION_PLANS } from '../demoData';
import { DEMO_SPONSORS } from '../demoData';
import { SubscriptionTier } from '../types';

interface Props {
  navigation: any;
}

export function SubscriptionsScreen({ navigation }: Props) {
  const { isDark } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
  const user = useCurrentBroncoUser();
  const { setSubscriptionTier, logAction, pricing } = useBroncoStore();

  const currentTier = user?.subscription ?? 'free';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Text style={{ color: theme.colors.primary, fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.colors.text }]}>الاشتراكات</Text>
        <Text style={{ fontSize: 16 }}>💎</Text>
      </View>

      <Text style={[styles.intro, { color: theme.colors.textMuted }]}>
        اختر الخطة التي تناسب مغامراتك. الدفع عبر مواسر (mada، Apple Pay، STC Pay).
      </Text>

      {DEMO_SUBSCRIPTION_PLANS.map((p) => {
        const isCurrent = p.tier === currentTier;
        const isUpgrade = p.price > pricing[currentTier as SubscriptionTier];
        return (
          <View
            key={p.tier}
            style={[
              styles.planCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: isCurrent ? theme.colors.success : p.popular ? theme.colors.primary : theme.colors.border,
                borderWidth: isCurrent || p.popular ? 2 : 1,
              },
            ]}
          >
            {p.popular && !isCurrent && (
              <View style={[styles.popularTag, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.popularText}>الأكثر شيوعًا</Text>
              </View>
            )}
            {isCurrent && (
              <View style={[styles.currentTag, { backgroundColor: theme.colors.success }]}>
                <Text style={styles.popularText}>✓ خطتك الحالية</Text>
              </View>
            )}
            <Text style={[styles.planName, { color: theme.colors.text }]}>{p.name_ar}</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: theme.colors.primary }]}>
                {pricing[p.tier] === 0 ? 'مجاني' : `${pricing[p.tier]} ر.س`}
              </Text>
              <Text style={[styles.priceUnit, { color: theme.colors.textMuted }]}>/شهر</Text>
            </View>
            <View style={styles.features}>
              {p.features_ar.map((f) => (
                <Text key={f} style={[styles.feature, { color: theme.colors.textMuted }]}>✓ {f}</Text>
              ))}
            </View>
            <TouchableOpacity
              disabled={isCurrent}
              style={[
                styles.planBtn,
                { backgroundColor: isCurrent ? theme.colors.disabled : isUpgrade ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border },
              ]}
              onPress={() => {
                setSubscriptionTier(p.tier);
                logAction('UPDATE_SUBSCRIPTION', `tier:${p.tier}`, `تغيير خطتي إلى ${p.name_ar}`);
              }}
            >
              <Text style={[styles.planBtnText, { color: isCurrent ? theme.colors.textMuted : theme.colors.onPrimary }]}>
                {isCurrent ? 'مفعلة' : isUpgrade ? 'ترقية' : 'تحويل'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Sponsors */}
      <Text style={[styles.sponsorTitle, { color: theme.colors.text }]}>🤝 رعايات القروب</Text>
      <View style={styles.sponsorRow}>
        {DEMO_SPONSORS.filter((s) => s.featured).map((s) => (
          <View key={s.id} style={[styles.sponsorCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={{ fontSize: 28 }}>{s.logo}</Text>
            <Text style={[styles.sponsorName, { color: theme.colors.text }]}>{s.name}</Text>
            <Text style={[styles.sponsorCta, { color: theme.colors.primary }]}>{s.cta_ar}</Text>
            <TouchableOpacity style={[styles.sponsorBtn, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.sponsorBtnText, { color: theme.colors.onPrimary }]}>استفد</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.allSponsors}>
        {DEMO_SPONSORS.filter((s) => !s.featured).map((s) => (
          <View key={s.id} style={[styles.sponsorMini, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={{ fontSize: 20 }}>{s.logo}</Text>
            <Text style={[styles.sponsorMiniName, { color: theme.colors.text }]}>{s.name}</Text>
            <Text style={[styles.sponsorMiniCta, { color: theme.colors.textMuted }]}>{s.cta_ar}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.disclaimer, { color: theme.colors.textMuted }]}>
        🎬 وضع تجريبي — لن يتم خصم أي مبالغ. الترقية الفعلية تتم عبر بوابة مواسر.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1 },
  topTitle: { fontSize: 16, fontWeight: '700' },
  intro: { fontSize: 13, paddingHorizontal: 16, marginTop: 12, lineHeight: 19 },
  planCard: { margin: 16, borderRadius: 16, padding: 16, position: 'relative' },
  popularTag: { position: 'absolute', top: -10, right: 16, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  currentTag: { position: 'absolute', top: -10, right: 16, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  popularText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  planName: { fontSize: 18, fontWeight: '800' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 6 },
  price: { fontSize: 26, fontWeight: '900' },
  priceUnit: { fontSize: 12, marginLeft: 4 },
  features: { marginBottom: 12 },
  feature: { fontSize: 13, lineHeight: 24 },
  planBtn: { borderRadius: 12, paddingVertical: 13, alignItems: 'center', borderWidth: 1 },
  planBtnText: { fontSize: 15, fontWeight: '700' },
  sponsorTitle: { fontSize: 15, fontWeight: '700', marginHorizontal: 16, marginTop: 8 },
  sponsorRow: { flexDirection: 'row', gap: 12, margin: 16, flexWrap: 'wrap' },
  sponsorCard: { flexBasis: '46%', borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center' },
  sponsorName: { fontSize: 14, fontWeight: '700', marginTop: 6 },
  sponsorCta: { fontSize: 12, marginTop: 4, fontWeight: '600' },
  sponsorBtn: { borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8, marginTop: 10 },
  sponsorBtnText: { fontSize: 13, fontWeight: '700' },
  allSponsors: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 16 },
  sponsorMini: { flexBasis: '31%', borderRadius: 12, borderWidth: 1, padding: 10, alignItems: 'center' },
  sponsorMiniName: { fontSize: 11, fontWeight: '600', marginTop: 4 },
  sponsorMiniCta: { fontSize: 10, marginTop: 2 },
  disclaimer: { fontSize: 12, textAlign: 'center', margin: 16, lineHeight: 18 },
});