import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useTripStore } from '../../store/tripStore';
import { lightTheme, darkTheme } from '../../theme';
import { TRIP_CATEGORIES } from '../../types/trip';

interface Props {
  navigation: any;
}

export function TripsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { trips, isLoading, error, fetchTrips, joinTrip, userTrips } = useTripStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    fetchTrips({ search, category: selectedCategory as any });
  }, [search, selectedCategory]);

  const handleJoin = async (tripId: string) => {
    await joinTrip(tripId);
    fetchTrips({ search, category: selectedCategory as any });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}>
        <Text style={{ fontSize: 18 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          value={search}
          onChangeText={setSearch}
          placeholder={t('common.search')}
          placeholderTextColor={theme.colors.placeholder}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterList}>
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          style={[
            styles.filterChip,
            {
              backgroundColor: !selectedCategory ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text
            style={[
              styles.filterText,
              { color: !selectedCategory ? theme.colors.onPrimary : theme.colors.text },
            ]}>
            الكل
          </Text>
        </TouchableOpacity>
        {TRIP_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedCategory === cat.key ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text
              style={[
                styles.filterText,
                { color: selectedCategory === cat.key ? theme.colors.onPrimary : theme.colors.text },
              ]}>
              {cat.emoji} {cat.label_ar}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTripCard = ({ item }: { item: any }) => {
    const category = TRIP_CATEGORIES.find((c) => c.key === item.category);
    const isFull = item.current_participants >= item.participant_limit;
    const spotsLeft = item.participant_limit - item.current_participants;
    const isJoined = userTrips.includes(item.id);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}
        activeOpacity={0.8}
        style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.cardCover}>
          <Text style={{ fontSize: 40 }}>{category?.emoji || '🚗'}</Text>
          <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.badgeText, { color: theme.colors.onPrimary }]}>
              {category?.label_ar || item.category}
            </Text>
          </View>
          {isFull && (
            <View style={[styles.fullBadge, { backgroundColor: theme.colors.error }]}>
              <Text style={[styles.fullText, { color: '#fff' }]}>{t('trip.full')}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.title}</Text>
          {item.community && (
            <Text style={[styles.cardCommunity, { color: theme.colors.primaryLight }]}>
              👥 {item.community.name}
            </Text>
          )}
          <View style={styles.infoRow}>
            <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
              📍 {item.destination.name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
              📅 {item.date} • ⏰ {item.departure_time}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.stats}>
              <Text style={[styles.statText, { color: theme.colors.textMuted }]}>
                👥 {item.current_participants}/{item.participant_limit}
              </Text>
              <Text style={[styles.statText, { color: theme.colors.accent }]}>
                💰 {item.estimated_cost} {item.cost_currency}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleJoin(item.id)}
              disabled={isJoined}
              style={[
                styles.joinButton,
                { backgroundColor: isJoined ? theme.colors.disabled : theme.colors.primary },
              ]}>
              <Text
                style={[
                  styles.joinText,
                  { color: isJoined ? theme.colors.textMuted : theme.colors.onPrimary },
                ]}>
                {isJoined ? t('community.joined') : t('trip.join')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>{t('common.loading')}</Text>
        </View>
      );
    }
    return (
      <View style={styles.centerContainer}>
        <Text style={{ fontSize: 64 }}>🗺️</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>{t('common.empty')}</Text>
        <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
          {search ? 'لا توجد نتائج' : 'لا توجد رحلات حالياً'}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.titleBar, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('trip.title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateTrip')}>
          <Text style={[styles.addButton, { color: theme.colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchTrips({ search, category: selectedCategory as any })}
          />
        }
        contentContainerStyle={styles.list}
        renderItem={renderTripCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '700' },
  addButton: { fontSize: 32, fontWeight: '300' },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 16 },
  filterList: { flexGrow: 0 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: { fontSize: 14, fontWeight: '500' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardCover: {
    height: 100,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  fullBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fullText: { fontSize: 12, fontWeight: '600' },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  cardCommunity: { fontSize: 12, fontWeight: '500', marginBottom: 8 },
  infoRow: { flexDirection: 'row', marginBottom: 4 },
  infoText: { fontSize: 12 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  stats: { flexDirection: 'row', gap: 16 },
  statText: { fontSize: 12 },
  joinButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  joinText: { fontSize: 12, fontWeight: '600' },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  emptyText: { fontSize: 12, marginTop: 4 },
});
