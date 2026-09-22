import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useTripStore } from '../../store/tripStore';
import { lightTheme, darkTheme } from '../../theme';
import { placesService, PLACE_CATEGORIES } from '../../services/placesService';
import { PlaceType } from '../../services/placesService';

interface Props {
  navigation: any;
  route: any;
}

export function TripMapScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { tripId } = route.params;
  const { currentTrip, isLoading, fetchTrip } = useTripStore();
  const [showDirections, setShowDirections] = useState(false);

  useEffect(() => {
    fetchTrip(tripId);
  }, [tripId]);

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
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Map placeholder — real map requires Google Maps API key */}
      <View style={[styles.mapContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.mapPlaceholder}>
          <Text style={{ fontSize: 48 }}>🗺️</Text>
          <Text style={[styles.mapPlaceholderTitle, { color: theme.colors.text }]}>خريطة الرحلة</Text>
          <Text style={[styles.mapPlaceholderText, { color: theme.colors.textMuted }]}>
            Google Maps — يتطلب مفتاح API
          </Text>
          <Text style={[styles.mapPlaceholderSubtext, { color: theme.colors.textMuted }]}>
            {currentTrip.destination.name}
          </Text>
        </View>

        {/* Map overlay markers */}
        <View style={styles.markersOverlay}>
          <View style={[styles.marker, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.markerText, { color: theme.colors.onPrimary }]}>📍</Text>
            <Text style={[styles.markerLabel, { color: theme.colors.onPrimary }]}>{t('trip.meetingPoint')}</Text>
          </View>
          <View style={[styles.marker, { backgroundColor: theme.colors.accent }]}>
            <Text style={[styles.markerText, { color: '#fff' }]}>🏁</Text>
            <Text style={[styles.markerLabel, { color: '#fff' }]}>{t('trip.destination')}</Text>
          </View>
        </View>
      </View>

      {/* Trip info card */}
      <ScrollView style={styles.infoContainer}>
        <View style={[styles.tripCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.tripTitle, { color: theme.colors.text }]}>{currentTrip.title}</Text>
          
          <View style={styles.routeInfo}>
            <View style={styles.routeRow}>
              <Text style={[styles.routeIcon, { color: theme.colors.primary }]}>🚩</Text>
              <View style={styles.routeContent}>
                <Text style={[styles.routeLabel, { color: theme.colors.textMuted }]}>{t('trip.meetingPoint')}</Text>
                <Text style={[styles.routeValue, { color: theme.colors.text }]}>{currentTrip.meeting_point.name}</Text>
              </View>
            </View>

            {currentTrip.route_stops && currentTrip.route_stops.length > 0 && (
              <>
                <View style={styles.routeLine} />
                {currentTrip.route_stops.map((stop, index) => (
                  <View key={index}>
                    <View style={styles.routeRow}>
                      <Text style={[styles.routeIcon, { color: theme.colors.warning }]}>
                        {stop.type === 'fuel' ? '⛽' : stop.type === 'restaurant' ? '🍽️' : '📍'}
                      </Text>
                      <View style={styles.routeContent}>
                        <Text style={[styles.routeLabel, { color: theme.colors.textMuted }]}>{stop.type}</Text>
                        <Text style={[styles.routeValue, { color: theme.colors.text }]}>{stop.name}</Text>
                      </View>
                    </View>
                    {index < currentTrip.route_stops.length - 1 && <View style={styles.routeLine} />}
                  </View>
                ))}
              </>
            )}

            <View style={styles.routeLine} />
            <View style={styles.routeRow}>
              <Text style={[styles.routeIcon, { color: theme.colors.accent }]}>🏁</Text>
              <View style={styles.routeContent}>
                <Text style={[styles.routeLabel, { color: theme.colors.textMuted }]}>{t('trip.destination')}</Text>
                <Text style={[styles.routeValue, { color: theme.colors.text }]}>{currentTrip.destination.name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => setShowDirections(!showDirections)}
              style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.actionText, { color: theme.colors.primary }]}>🧭 الاتجاهات</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('PlaceSearch', { tripId })}
              style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.actionText, { color: theme.colors.primary }]}>➕ إضافة محطة</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Directions panel */}
        {showDirections && (
          <View style={[styles.directionsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.directionsTitle, { color: theme.colors.text }]}>الاتجاهات المقترحة</Text>
            <View style={styles.directionsMock}>
              <Text style={[styles.directionsText, { color: theme.colors.textMuted }]}>
                • انطلق من نقطة الاجتماع {currentTrip.meeting_point.name}
              </Text>
              <Text style={[styles.directionsText, { color: theme.colors.textMuted }]}>
                • استمر على الطريق الرئيسي نحو الوجهة
              </Text>
              <Text style={[styles.directionsText, { color: theme.colors.textMuted }]}>
                • المسافة التقريبية: تعتمد على الموقع الفعلي
              </Text>
              <Text style={[styles.directionsNote, { color: theme.colors.accent }]}>
                ⚠️ يتطلب تكامل Google Maps لعرض الاتجاهات الحقيقية
              </Text>
            </View>
          </View>
        )}

        {/* Live location */}
        <View style={[styles.locationCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.locationTitle, { color: theme.colors.text }]}>{t('trip.liveLocation')}</Text>
          <Text style={[styles.locationText, { color: theme.colors.textMuted }]}>
            مشاركة الموقع المباشر — قريباً في Sprint 6
          </Text>
          <TouchableOpacity
            style={[styles.locationButton, { backgroundColor: theme.colors.disabled }]}>
            <Text style={[styles.locationButtonText, { color: theme.colors.textMuted }]}>{t('trip.shareLocation')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 16 },
  errorText: { fontSize: 16, marginTop: 16 },
  mapContainer: {
    height: 250,
    borderBottomWidth: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderTitle: { fontSize: 18, fontWeight: '600', marginTop: 8 },
  mapPlaceholderText: { fontSize: 14, marginTop: 4 },
  mapPlaceholderSubtext: { fontSize: 12, marginTop: 2 },
  markersOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    gap: 8,
  },
  marker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  markerText: { fontSize: 14 },
  markerLabel: { fontSize: 12, fontWeight: '500' },
  infoContainer: {
    flex: 1,
    padding: 16,
  },
  tripCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  tripTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  routeInfo: { gap: 8 },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeIcon: { fontSize: 20, marginTop: 2 },
  routeContent: { flex: 1 },
  routeLabel: { fontSize: 12, marginBottom: 2 },
  routeValue: { fontSize: 14, fontWeight: '500' },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#ddd',
    marginLeft: 9,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { fontSize: 14, fontWeight: '600' },
  directionsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  directionsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  directionsMock: { gap: 8 },
  directionsText: { fontSize: 14, lineHeight: 20 },
  directionsNote: { fontSize: 12, marginTop: 8 },
  locationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  locationTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  locationText: { fontSize: 14, marginBottom: 12 },
  locationButton: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButtonText: { fontSize: 14, fontWeight: '500' },
});
