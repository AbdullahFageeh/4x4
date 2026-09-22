import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';
import { placesService, Place, PlaceType, PLACE_CATEGORIES } from '../../services/placesService';

interface Props {
  navigation: any;
  route: any;
}

export function PlaceSearchScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<PlaceType[]>([]);
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const places = await placesService.searchPlaces(query, selectedTypes.length > 0 ? selectedTypes : undefined);
      // Convert suggestions to full Place objects for display
      const fullPlaces: Place[] = [];
      for (const p of places) {
        const details = await placesService.getPlaceDetails(p.place_id);
        if (details) fullPlaces.push(details);
      }
      setResults(fullPlaces);
    } catch (error) {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleType = (type: PlaceType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={{ fontSize: 18 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          value={query}
          onChangeText={setQuery}
          placeholder={t('common.search')}
          placeholderTextColor={theme.colors.placeholder}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Text style={[styles.searchButton, { color: theme.colors.primary }]}>بحث</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterList}>
        {Object.entries(PLACE_CATEGORIES).map(([key, value]) => {
          const type = key as PlaceType;
          const isSelected = selectedTypes.includes(type);
          return (
            <TouchableOpacity
              key={key}
              onPress={() => toggleType(type)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.filterText,
                  { color: isSelected ? theme.colors.onPrimary : theme.colors.text },
                ]}>
                {value.emoji} {value.label_ar}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderPlace = ({ item }: { item: Place }) => (
    <View style={[styles.placeCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.placeInfo}>
        <View style={styles.placeHeader}>
          <Text style={[styles.placeName, { color: theme.colors.text }]}>{item.name}</Text>
          {item.is_verified && (
            <View style={[styles.verifiedBadge, { backgroundColor: theme.colors.success }]}>
              <Text style={[styles.verifiedText, { color: theme.colors.onSuccess }]}>✓ موثق</Text>
            </View>
          )}
        </View>
        <Text style={[styles.placeDesc, { color: theme.colors.textMuted }]}>{item.description}</Text>
        <View style={styles.placeMeta}>
          <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>📍 {item.saudi_region}</Text>
          {item.rating && (
            <Text style={[styles.metaText, { color: theme.colors.accent }]}>
              ⭐ {item.rating} ({item.review_count})
            </Text>
          )}
        </View>
        <View style={styles.placeTypes}>
          {item.types.map((type) => (
            <View key={type} style={[styles.typeTag, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.typeText, { color: theme.colors.textMuted }]}>{PLACE_CATEGORIES[type]?.emoji} {PLACE_CATEGORIES[type]?.label_ar}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.addText, { color: theme.colors.onPrimary }]}>+</Text>
      </TouchableOpacity>
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

    if (!hasSearched) {
      return (
        <View style={styles.centerContainer}>
          <Text style={{ fontSize: 64 }}>🔍</Text>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>ابحث عن مكان</Text>
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
            ابحث عن محطات وقود، مطاعم، استراحات، مواقع تخييم في السعودية
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={{ fontSize: 64 }}>😔</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>{t('common.noResults')}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.titleBar, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>البحث عن الأماكن</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        renderItem={renderPlace}
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
  backButton: { fontSize: 24 },
  title: { fontSize: 20, fontWeight: '600' },
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
  searchButton: { fontSize: 16, fontWeight: '600' },
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
  placeCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  placeInfo: { flex: 1 },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  placeName: { fontSize: 16, fontWeight: '600', flex: 1 },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedText: { fontSize: 10, fontWeight: '600' },
  placeDesc: { fontSize: 14, marginBottom: 8 },
  placeMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaText: { fontSize: 12 },
  placeTypes: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeText: { fontSize: 10 },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  addText: { fontSize: 24, fontWeight: '300' },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptyText: { fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
});
