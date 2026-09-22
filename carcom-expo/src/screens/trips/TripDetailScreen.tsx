import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useTripStore } from '../../store/tripStore';
import { lightTheme, darkTheme } from '../../theme';
import { TRIP_CATEGORIES } from '../../types/trip';

interface Props {
  navigation: any;
  route: any;
}

export function TripDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { tripId } = route.params;
  const {
    currentTrip,
    participants,
    isLoading,
    error,
    fetchTrip,
    fetchParticipants,
    joinTrip,
    declineTrip,
    userTrips,
  } = useTripStore();

  const isJoined = userTrips.includes(tripId);

  useEffect(() => {
    fetchTrip(tripId);
    fetchParticipants(tripId);
  }, [tripId]);

  const handleJoin = async () => {
    await joinTrip(tripId);
    fetchTrip(tripId);
    fetchParticipants(tripId);
  };

  if (isLoading && !currentTrip) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (!currentTrip) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{t('common.error')}</Text>
        <TouchableOpacity onPress={() => fetchTrip(tripId)} style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.retryText, { color: theme.colors.onPrimary }]}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const category = TRIP_CATEGORIES.find((c) => c.key === currentTrip.category);
  const goingCount = participants.filter((p) => p.status === 'going').length;
  const waitlistCount = participants.filter((p) => p.status === 'waitlisted').length;
  const spotsLeft = currentTrip.participant_limit - currentTrip.current_participants;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.coverContainer}>
        <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.disabled }]}>
          <Text style={{ fontSize: 60 }}>{category?.emoji || '🚗'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.badgeText, { color: theme.colors.onPrimary }]}>{category?.label_ar || currentTrip.category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{currentTrip.title}</Text>
        {currentTrip.community && (
          <Text style={[styles.community, { color: theme.colors.primaryLight }]}>
            👥 {currentTrip.community.name} • {currentTrip.community.car_model}
          </Text>
        )}

        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoIcon, { color: theme.colors.textMuted }]}>📍</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>{t('trip.destination')}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{currentTrip.destination.name}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoIcon, { color: theme.colors.textMuted }]}>🚩</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>{t('trip.meetingPoint')}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{currentTrip.meeting_point.name}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoIcon, { color: theme.colors.textMuted }]}>📅</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>{t('trip.date')} • {t('trip.departureTime')}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{currentTrip.date} • {currentTrip.departure_time}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoIcon, { color: theme.colors.textMuted }]}>👥</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>{t('trip.participants')}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {currentTrip.current_participants}/{currentTrip.participant_limit}
                {spotsLeft > 0 && spotsLeft <= 3 && (
                  <Text style={{ color: theme.colors.warning }}> ({spotsLeft} متبقية)</Text>
                )}
              </Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoIcon, { color: theme.colors.textMuted }]}>💰</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>{t('trip.cost')}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.accent }]}>{currentTrip.estimated_cost} {currentTrip.cost_currency}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>عن الرحلة</Text>
          <Text style={[styles.description, { color: theme.colors.textMuted }]}>{currentTrip.description}</Text>
        </View>

        {currentTrip.itinerary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>الجدول الزمني</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.cardText, { color: theme.colors.textMuted }]}>{currentTrip.itinerary}</Text>
            </View>
          </View>
        )}

        {currentTrip.preparation_checklist && currentTrip.preparation_checklist.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('trip.preparationChecklist')}</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              {currentTrip.preparation_checklist.map((item, index) => (
                <View key={index} style={styles.checklistItem}>
                  <Text style={{ color: theme.colors.primary }}>☑</Text>
                  <Text style={[styles.checklistText, { color: theme.colors.text }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {currentTrip.route_stops && currentTrip.route_stops.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>محطات الطريق</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              {currentTrip.route_stops.map((stop, index) => (
                <View key={index} style={styles.stopItem}>
                  <View style={[styles.stopDot, { backgroundColor: theme.colors.primary }]}>
                    <Text style={[styles.stopNumber, { color: theme.colors.onPrimary }]}>{index + 1}</Text>
                  </View>
                  <View style={styles.stopInfo}>
                    <Text style={[styles.stopName, { color: theme.colors.text }]}>{stop.name}</Text>
                    <Text style={[styles.stopType, { color: theme.colors.textMuted }]}>{stop.type}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>المشاركون ({participants.length})</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            {participants.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>لا يوجد مشاركون بعد</Text>
            ) : (
              <>
                <Text style={[styles.participantStats, { color: theme.colors.textMuted }]}>
                  ✅ مشارك: {goingCount}  •  ⏳ انتظار: {waitlistCount}
                </Text>
                <View style={styles.avatarRow}>
                  {participants.slice(0, 8).map((p) => (
                    <View key={p.user_id} style={styles.participantAvatar}>
                      <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.disabled }]}>
                        <Text style={{ color: theme.colors.textMuted }}>👤</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TripMap', { tripId: currentTrip.id })}
          style={[styles.mapButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.mapText, { color: theme.colors.primary }]}>🗺️ عرض الخريطة</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleJoin}
          style={[styles.joinButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.joinText, { color: theme.colors.onPrimary }]}>{t('trip.join')}</Text>
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
  retryButton: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryText: { fontSize: 16, fontWeight: '600' },
  coverContainer: { height: 200, position: 'relative' },
  coverPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', top: 60, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 24 },
  badge: { position: 'absolute', top: 60, right: 20, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  community: { fontSize: 14, fontWeight: '500', marginBottom: 20 },
  infoCard: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, marginBottom: 2 },
  infoValue: { fontSize: 16, fontWeight: '500' },
  divider: { height: 1, marginVertical: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 22 },
  card: { borderRadius: 12, borderWidth: 1, padding: 16 },
  cardText: { fontSize: 14, lineHeight: 22 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  checklistText: { fontSize: 14 },
  stopItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  stopDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stopNumber: { fontSize: 12, fontWeight: '700' },
  stopInfo: { flex: 1 },
  stopName: { fontSize: 14, fontWeight: '500' },
  stopType: { fontSize: 12 },
  participantStats: { fontSize: 12, marginBottom: 12 },
  avatarRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  participantAvatar: { alignItems: 'center' },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  mapButton: { flex: 1, height: 52, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  mapText: { fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', gap: 12, padding: 20, paddingBottom: 32, borderTopWidth: 1 },
  joinButton: { flex: 1, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  joinText: { fontSize: 16, fontWeight: '600' },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
