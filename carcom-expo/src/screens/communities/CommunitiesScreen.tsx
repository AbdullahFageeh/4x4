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
import { useCommunityStore } from '../../store/communityStore';
import { lightTheme, darkTheme } from '../../theme';

interface Props {
  navigation: any;
}

export function CommunitiesScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { communities, isLoading, error, fetchCommunities, joinCommunity, userCommunities } =
    useCommunityStore();
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
    fetchCommunities({ search, car_model: selectedModel || undefined });
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
        {carModels.map((model) => (
          <TouchableOpacity
            key={model}
            onPress={() => setSelectedModel(selectedModel === model ? null : model)}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedModel === model ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text
              style={[
                styles.filterText,
                { color: selectedModel === model ? theme.colors.onPrimary : theme.colors.text },
              ]}>
              {model}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCommunityCard = ({ item }: { item: any }) => {
    const isJoined = userCommunities.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('CommunityDetail', { communityId: item.id })}
        activeOpacity={0.8}
        style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.cardCover}>
          <Text style={{ fontSize: 40 }}>🚗</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: item.visibility === 'public' ? theme.colors.primary : theme.colors.accent },
            ]}>
            <Text style={[styles.badgeText, { color: theme.colors.onPrimary }]}>
              {item.visibility === 'public' ? '🌍' : '🔒'}
            </Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardName, { color: theme.colors.text }]}>{item.name}</Text>
          <Text style={[styles.cardModel, { color: theme.colors.primaryLight }]}>🚗 {item.car_model}</Text>
          <Text style={[styles.cardDesc, { color: theme.colors.textMuted }]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={[styles.memberCount, { color: theme.colors.textMuted }]}>
              👥 {item.member_count} {t('community.members')}
            </Text>
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
                {isJoined ? t('community.joined') : t('community.join')}
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
        renderItem={renderCommunityCard}
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 12 },
  cardContent: { padding: 12 },
  cardName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  cardModel: { fontSize: 12, fontWeight: '500', marginBottom: 4 },
  cardDesc: { fontSize: 12, marginBottom: 8 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberCount: { fontSize: 12 },
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
