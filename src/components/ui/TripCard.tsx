import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';
import { Trip, TRIP_CATEGORIES } from '../../types/trip';

interface TripCardProps {
  trip: Trip;
  onPress: () => void;
  onJoin: () => void;
  isJoined: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onPress, onJoin, isJoined }) => {
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { t } = useTranslation();

  const category = TRIP_CATEGORIES.find((c) => c.key === trip.category);
  const isFull = trip.current_participants >= trip.participant_limit;
  const spotsLeft = trip.participant_limit - trip.current_participants;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.coverContainer}>
        <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.disabled }]}>
          <Text style={styles.categoryEmoji}>{category?.emoji || '🚗'}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.badgeText, { color: theme.colors.onPrimary }]}>
            {category?.label_ar || trip.category}
          </Text>
        </View>
        {isFull && (
          <View style={[styles.fullBadge, { backgroundColor: theme.colors.error }]}>
            <Text style={[styles.fullText, { color: '#fff' }]}>{t('trip.full')}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{trip.title}</Text>
        <Text style={[styles.community, { color: theme.colors.primaryLight }]}>
          👥 {trip.community?.name || trip.community_id}
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
            📍 {trip.destination.name}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
            📅 {trip.date} • ⏰ {trip.departure_time}
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.stats}>
            <Text style={[styles.statText, { color: theme.colors.textMuted }]}>
              👥 {trip.current_participants}/{trip.participant_limit}
            </Text>
            <Text style={[styles.statText, { color: theme.colors.accent }]}>
              💰 {trip.estimated_cost} {trip.cost_currency}
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
              {isJoined ? t('community.joined') : t('trip.join')}
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
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: { fontSize: 48 },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  fullBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fullText: { fontSize: 12, fontWeight: '600' },
  content: {
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  community: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  infoRow: { flexDirection: 'row', marginBottom: 4 },
  infoText: { fontSize: 14 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  stats: { flexDirection: 'row', gap: 16 },
  statText: { fontSize: 14 },
  joinButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinText: { fontSize: 14, fontWeight: '600' },
});
