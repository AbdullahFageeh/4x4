import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useCommunityStore } from '../../store/communityStore';
import { lightTheme, darkTheme } from '../../theme';
import { CommunityCard } from '../../components/ui/CommunityCard';

interface Props {
  navigation: any;
}

export function CommunitiesScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { communities, isLoading, error, fetchCommunities, joinCommunity } = useCommunityStore();
  const [search, setSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    fetchCommunities({ search, car_model: selectedModel || undefined });
  }, [search, selectedModel]);

  const handleJoin = async (communityId: string) => {
    await joinCommunity(communityId);
  };

  const carModels = [
    'Toyota Land Cruiser',
    'Nissan Patrol',
    'Jeep Wrangler',
    'Toyota Hilux',
    'Jeep Grand Cherokee',
    'Various Sedans',
  ];

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
      <FlatList
        horizontal
        data={carModels}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedModel(selectedModel === item ? null : item)}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedModel === item ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text
              style={[
                styles.filterText,
                { color: selectedModel === item ? theme.colors.onPrimary : theme.colors.textMuted },
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
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
        <Text style={{ fontSize: 64 }}>🏜️</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>{t('common.empty')}</Text>
        <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
          {search ? 'لا توجد نتائج' : 'لا توجد مجتمعات حالياً'}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.titleBar, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('community.title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateCommunity')}>
          <Text style={[styles.addButton, { color: theme.colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchCommunities({ search, car_model: selectedModel || undefined })}
          />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CommunityCard
            community={item}
            onPress={() => navigation.navigate('CommunityDetail', { communityId: item.id })}
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
  filterList: {
    flexGrow: 0,
  },
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
