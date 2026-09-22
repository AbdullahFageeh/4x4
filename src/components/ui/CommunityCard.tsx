import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';
import { Community } from '../../types/community';

interface CommunityCardProps {
  community: Community;
  onPress: () => void;
  onJoin: () => void;
  isJoined: boolean;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community, onPress, onJoin, isJoined }) => {
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: community.cover_image_url || undefined }}
          style={styles.cover}
          defaultSource={undefined}
        />
        <View style={[styles.badge, { backgroundColor: community.visibility === 'public' ? theme.colors.primary : theme.colors.accent }]}>
          <Text style={[styles.badgeText, { color: theme.colors.onPrimary }]}>
            {community.visibility === 'public' ? '🌍' : '🔒'}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{community.name}</Text>
        <Text style={[styles.model, { color: theme.colors.primaryLight }]}>🚗 {community.car_model}</Text>
        <Text style={[styles.description, { color: theme.colors.textMuted }]} numberOfLines={2}>
          {community.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.members}>
            <Text style={[styles.memberCount, { color: theme.colors.textMuted }]}>
              👥 {community.member_count} {t('community.members')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onJoin}
            disabled={isJoined}
            style={[
              styles.joinButton,
              {
                backgroundColor: isJoined ? theme.colors.disabled : theme.colors.primary,
              },
            ]}>
            <Text style={[styles.joinText, { color: isJoined ? theme.colors.textMuted : theme.colors.onPrimary }]}>
              {isJoined ? t('community.joined') : t('community.join')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  coverContainer: {
    height: 120,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 14 },
  content: {
    padding: 16,
  },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  model: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  members: { flexDirection: 'row', alignItems: 'center' },
  memberCount: { fontSize: 14 },
  joinButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinText: { fontSize: 14, fontWeight: '600' },
});
