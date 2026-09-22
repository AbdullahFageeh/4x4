import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useTripStore } from '../../store/tripStore';
import { lightTheme, darkTheme } from '../../theme';
import { TripCard } from '../../components/ui/TripCard';
import { TRIP_CATEGORIES } from '../../types/trip';

interface Props {
  navigation: any;
}

export function TripsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { trips, isLoading, error, fetchTrips, joinTrip } = useTripStore();
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
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
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
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}
            onJoin={() => handleJoin(item.id)}
            isJoined={false}
          />
        )}
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptyText: { fontSize: 14, marginTop: 8 },
});
