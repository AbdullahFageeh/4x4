import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useCommunityStore } from '../../store/communityStore';
import { lightTheme, darkTheme } from '../../theme';

interface Props {
  navigation: any;
  route: any;
}

export function CommunityDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { communityId } = route.params;
  const { currentCommunity, members, isLoading, error, fetchCommunity, fetchMembers, joinCommunity } = useCommunityStore();

  useEffect(() => {
    fetchCommunity(communityId);
    fetchMembers(communityId);
  }, [communityId]);

  const handleJoin = async () => {
    await joinCommunity(communityId);
    fetchCommunity(communityId);
    fetchMembers(communityId);
  };

  if (isLoading && !currentCommunity) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (!currentCommunity) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ fontSize: 64 }}>❌</Text>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{t('common.error')}</Text>
        <TouchableOpacity onPress={() => fetchCommunity(communityId)} style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.retryText, { color: theme.colors.onPrimary }]}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: currentCommunity.cover_image_url || undefined }} style={styles.cover} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={[styles.badge, { backgroundColor: currentCommunity.visibility === 'public' ? theme.colors.primary : theme.colors.accent }]}>
          <Text style={[styles.badgeText, { color: theme.colors.onPrimary }]}>
            {currentCommunity.visibility === 'public' ? '🌍' : '🔒'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{currentCommunity.name}</Text>
        <Text style={[styles.model, { color: theme.colors.primaryLight }]}>🚗 {currentCommunity.car_model}</Text>

        <View style={[styles.statsBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{currentCommunity.member_count}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{t('community.members')}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>رحلات</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{currentCommunity.visibility === 'public' ? t('community.public') : t('community.private')}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{t('community.visibility')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('community.about')}</Text>
          <Text style={[styles.description, { color: theme.colors.textMuted }]}>{currentCommunity.description}</Text>
        </View>

        {currentCommunity.rules ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('community.rules')}</Text>
            <View style={[styles.rulesCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.rulesText, { color: theme.colors.textMuted }]}>{currentCommunity.rules}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('community.upcomingTrips')}</Text>
          <View style={[styles.tripPlaceholder, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={{ fontSize: 40 }}>🏜️</Text>
            <Text style={[styles.tripPlaceholderText, { color: theme.colors.textMuted }]}>قريباً في Sprint 2</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('community.members')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {members.slice(0, 10).map((member) => (
              <View key={member.user_id} style={styles.memberAvatar}>
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.disabled }]}>
                  <Text style={{ color: theme.colors.textMuted }}>👤</Text>
                </View>
                <Text style={[styles.memberName, { color: theme.colors.textMuted }]} numberOfLines={1}>
                  {member.role === 'organizer' ? '👑' : ''} Member
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CommunityChat', { communityId })}
          style={[styles.chatButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.chatText, { color: theme.colors.primary }]}>{t('community.chat')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleJoin} style={[styles.joinButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.joinText, { color: theme.colors.onPrimary }]}>{t('community.join')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 16 },
  errorText: { fontSize: 16, marginTop: 16 },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { fontSize: 16, fontWeight: '600' },
  coverContainer: {
    height: 220,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#fff', fontSize: 24 },
  badge: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 16 },
  content: {
    padding: 20,
  },
  name: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  model: { fontSize: 16, fontWeight: '500', marginBottom: 20 },
  statsBar: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
  divider: { width: 1 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 24 },
  rulesCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  rulesText: { fontSize: 14, lineHeight: 22 },
  tripPlaceholder: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  tripPlaceholderText: { fontSize: 14, marginTop: 8 },
  memberAvatar: {
    alignItems: 'center',
    marginRight: 12,
    width: 64,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberName: { fontSize: 12, marginTop: 4, textAlign: 'center' },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  chatButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatText: { fontSize: 16, fontWeight: '600' },
  joinButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinText: { fontSize: 16, fontWeight: '600' },
});
