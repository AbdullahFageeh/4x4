import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { broncoLight, broncoDark } from '../theme';
import { useAppStore } from '../../store/useAppStore';
import { useBroncoStore } from '../broncoStore';
import { DEMO_TRIPS } from '../../services/demoData';
import { TRIP_CATEGORIES } from '../../types/trip';

interface Props {
  navigation: any;
}

export function BroncoTripsScreen({ navigation }: Props) {
  const { isDark } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
  const { role, reviews } = useBroncoStore();
  const [filter, setFilter] = useState<string | null>(null);

  const trips = DEMO_TRIPS.filter(
    (t) => (filter ? t.category === filter : true) && t.status === 'published'
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.title}>رحلات البرونكو 🛻</Text>
        <Text style={styles.subtitle}>
          {role === 'organizer' || role === 'community_admin' || role === 'platform_admin'
            ? 'يمكنك إنشاء رحلات وإدارة المشاركين'
            : 'انضم لقروب البرونكو في مغامرات البر'}
        </Text>
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
        {TRIP_CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[
              styles.chip,
              {
                backgroundColor: filter === c.key ? theme.colors.primary : theme.colors.card,
                borderColor: filter === c.key ? theme.colors.primary : theme.colors.border,
              },
            ]}
            onPress={() => setFilter(filter === c.key ? null : c.key)}
          >
            <Text style={{ fontSize: 14 }}>{c.emoji} </Text>
            <Text style={[styles.chipText, { color: filter === c.key ? theme.colors.onPrimary : theme.colors.text }]}>
              {c.label_ar}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {trips.map((t) => {
          const cat = TRIP_CATEGORIES.find((c) => c.key === t.category);
          const tripReviews = reviews.filter((r) => r.trip_id === t.id);
          const avg = tripReviews.length
            ? tripReviews.reduce((s, r) => s + r.rating, 0) / tripReviews.length
            : 0;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.tripCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              onPress={() => navigation.navigate('BroncoTripDetail', { id: t.id })}
            >
              <View style={styles.tripTop}>
                <View style={[styles.catTag, { backgroundColor: theme.colors.background }]}>
                  <Text style={[styles.catTagText, { color: theme.colors.primary }]}>
                    {cat?.emoji} {cat?.label_ar}
                  </Text>
                </View>
                <View style={[styles.dateTag, { backgroundColor: theme.colors.background }]}>
                  <Text style={[styles.dateTagText, { color: theme.colors.textMuted }]}>📅 {t.date}</Text>
                </View>
              </View>
              <Text style={[styles.tripTitle, { color: theme.colors.text }]}>{t.title}</Text>
              <Text style={[styles.tripDesc, { color: theme.colors.textMuted }]} numberOfLines={2}>{t.description}</Text>
              <View style={styles.tripMeta}>
                <Text style={[styles.metaItem, { color: theme.colors.textMuted }]}>👥 {t.current_participants}/{t.participant_limit}</Text>
                <Text style={[styles.metaItem, { color: theme.colors.textMuted }]}>💰 {t.estimated_cost} ر.س</Text>
                {avg > 0 && (
                  <Text style={[styles.metaItem, { color: theme.colors.accent }]}>
                    ★ {avg.toFixed(1)} ({tripReviews.length})
                  </Text>
                )}
              </View>
              <View style={styles.tripActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                  onPress={() => navigation.navigate('BroncoTripDetail', { id: t.id })}
                >
                  <Text style={[styles.actionText, { color: theme.colors.primary }]}>التفاصيل</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                  onPress={() => navigation.navigate('TripMap', { id: t.id })}
                >
                  <Text style={[styles.actionText, { color: theme.colors.primary }]}>🗺️ الخريطة</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Organizer CTA */}
      {(role === 'organizer' || role === 'community_admin' || role === 'platform_admin') && (
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('CreateTrip')}
        >
          <Text style={[styles.createText, { color: theme.colors.onPrimary }]}>+ إنشاء رحلة</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 },
  chipsRow: { paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '600' },
  list: { flex: 1, paddingHorizontal: 16 },
  tripCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  tripTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  catTag: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  catTagText: { fontSize: 11, fontWeight: '700' },
  dateTag: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  dateTagText: { fontSize: 11 },
  tripTitle: { fontSize: 16, fontWeight: '800' },
  tripDesc: { fontSize: 13, marginTop: 4, lineHeight: 19 },
  tripMeta: { flexDirection: 'row', gap: 14, marginTop: 10 },
  metaItem: { fontSize: 12 },
  tripActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 10, alignItems: 'center' },
  actionText: { fontSize: 13, fontWeight: '700' },
  createBtn: { margin: 16, marginBottom: 80, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  createText: { fontSize: 15, fontWeight: '800' },
});