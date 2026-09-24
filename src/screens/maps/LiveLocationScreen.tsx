import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';
import { googleMapsService } from '../../services/googleMaps';

interface Props {
  navigation: any;
  route: any;
}

interface Participant {
  id: string;
  name: string;
  avatarUrl: string | null;
  isSharing: boolean;
  lat: number;
  lng: number;
  lastUpdated: string;
  isStale: boolean;
}

const DEMO_PARTICIPANTS: Participant[] = [
  {
    id: 'user-001', name: 'عبدالله', avatarUrl: null, isSharing: true,
    lat: 28.4, lng: 36.5, lastUpdated: new Date().toISOString(), isStale: false,
  },
  {
    id: 'user-002', name: 'سارة', avatarUrl: null, isSharing: true,
    lat: 28.3, lng: 36.4, lastUpdated: new Date(Date.now() - 10 * 60000).toISOString(), isStale: false,
  },
  {
    id: 'user-004', name: 'محمد', avatarUrl: null, isSharing: false,
    lat: 0, lng: 0, lastUpdated: '', isStale: false,
  },
];

export function LiveLocationScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  const [isSharing, setIsSharing] = useState(false);
  const [shareDuration, setShareDuration] = useState(4); // hours
  const [autoExpire, setAutoExpire] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>(DEMO_PARTICIPANTS);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => {
          if (!p.isSharing) return p;
          const timeSinceUpdate = Date.now() - new Date(p.lastUpdated).getTime();
          const isStale = timeSinceUpdate > 15 * 60000; // 15 min threshold
          return {
            ...p,
            lat: p.lat + (Math.random() - 0.5) * 0.001,
            lng: p.lng + (Math.random() - 0.5) * 0.001,
            isStale,
          };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStopSharing = () => {
    setIsSharing(false);
  };

  const handleStartSharing = () => {
    setIsSharing(true);
  };

  const formatLastUpdate = (dateString: string) => {
    if (!dateString) return 'غير متصل';
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (diff < 1) return 'الآن';
    if (diff < 60) return `منذ ${diff} دقيقة`;
    return `منذ ${Math.floor(diff / 60)} ساعة`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('trip.liveLocation')}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Map */}
      <View style={[styles.mapContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {googleMapsService.isConfigured ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 28.4,
              longitude: 36.5,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
          >
            {participants
              .filter((p) => p.isSharing)
              .map((p) => (
                <Marker
                  key={p.id}
                  coordinate={{ latitude: p.lat, longitude: p.lng }}
                  title={p.name}
                  pinColor={p.isStale ? '#FFA000' : '#4CAF50'}
                />
              ))}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={{ fontSize: 48 }}>📍</Text>
            <Text style={[styles.mapPlaceholderTitle, { color: theme.colors.text }]}>خريطة الموقع المباشر</Text>
            <Text style={[styles.mapPlaceholderText, { color: theme.colors.textMuted }]}>
              Google Maps — يتطلب مفتاح API
            </Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={[styles.controlsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>مشاركة موقعك</Text>
        <View style={styles.controlRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: theme.colors.text }]}>مشاركة الموقع المباشر</Text>
            <Text style={[styles.helper, { color: theme.colors.textMuted }]}>
              {isSharing ? 'مشارك حالياً' : 'متوقف'}
            </Text>
          </View>
          <Switch
            value={isSharing}
            onValueChange={(val) => (val ? handleStartSharing() : handleStopSharing())}
            trackColor={{ false: theme.colors.disabled, true: theme.colors.success }}
          />
        </View>

        {isSharing && (
          <>
            <View style={styles.controlRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: theme.colors.text }]}>المدة: {shareDuration} ساعات</Text>
                <Text style={[styles.helper, { color: theme.colors.textMuted }]}>ينتهي تلقائياً</Text>
              </View>
              <View style={styles.durationButtons}>
                {[2, 4, 8].map((h) => (
                  <TouchableOpacity
                    key={h}
                    onPress={() => setShareDuration(h)}
                    style={[
                      styles.durationButton,
                      {
                        backgroundColor: shareDuration === h ? theme.colors.primary : theme.colors.surface,
                        borderColor: theme.colors.border,
                      },
                    ]}>
                    <Text style={[styles.durationText, { color: shareDuration === h ? theme.colors.onPrimary : theme.colors.text }]}>
                      {h}h
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.controlRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: theme.colors.text }]}>ينتهي تلقائياً</Text>
                <Text style={[styles.helper, { color: theme.colors.textMuted }]}>إيقاف بعد انتهاء المدة</Text>
              </View>
              <Switch
                value={autoExpire}
                onValueChange={setAutoExpire}
                trackColor={{ false: theme.colors.disabled, true: theme.colors.success }}
              />
            </View>

            <TouchableOpacity
              onPress={handleStopSharing}
              style={[styles.stopButton, { backgroundColor: theme.colors.error }]}>
              <Text style={[styles.stopButtonText, { color: '#fff' }]}>⏹ إيقاف المشاركة</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Participants list */}
      <View style={[styles.participantsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          المشاركون ({participants.filter((p) => p.isSharing).length}/{participants.length})
        </Text>
        {participants.map((p) => (
          <View key={p.id} style={styles.participantRow}>
            <View style={[styles.avatar, { backgroundColor: p.isSharing ? theme.colors.success : theme.colors.disabled }]}>
              <Text style={{ color: '#fff', fontSize: 12 }}>👤</Text>
            </View>
            <View style={styles.participantInfo}>
              <Text style={[styles.participantName, { color: theme.colors.text }]}>{p.name}</Text>
              <Text style={[styles.participantStatus, { color: p.isStale ? theme.colors.warning : p.isSharing ? theme.colors.success : theme.colors.textMuted }]}>
                {p.isStale ? '⚠️ موقع قديم' : p.isSharing ? `🟢 ${formatLastUpdate(p.lastUpdated)}` : '🔴 لا يشارك'}
              </Text>
            </View>
            {p.isStale && (
              <View style={[styles.staleBadge, { backgroundColor: theme.colors.warning }]}>
                <Text style={{ color: '#fff', fontSize: 10 }}>قديم</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Disclaimer */}
      <View style={[styles.disclaimer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.disclaimerText, { color: theme.colors.textMuted }]}>
          ⚠️ يعتمد الموقع المباشر على جودة الاتصال ولا يغني عن خدمات الطوارئ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: { fontSize: 24 },
  title: { fontSize: 20, fontWeight: '600' },
  mapContainer: { height: 200, borderBottomWidth: 1, position: 'relative' },
  map: { width: '100%', height: '100%'},
  mapPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mapPlaceholderTitle: { fontSize: 18, fontWeight: '600', marginTop: 8 },
  mapPlaceholderText: { fontSize: 14, marginTop: 4 },
  markersOverlay: { position: 'absolute', top: 12, left: 12, gap: 8 },
  participantMarker: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  markerLabel: { fontSize: 11, fontWeight: '500' },
  controlsCard: { margin: 16, borderRadius: 16, borderWidth: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500' },
  helper: { fontSize: 12, marginTop: 2 },
  durationButtons: { flexDirection: 'row', gap: 8 },
  durationButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  durationText: { fontSize: 12, fontWeight: '500' },
  stopButton: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  stopButtonText: { fontSize: 16, fontWeight: '600' },
  participantsCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, padding: 16 },
  participantRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  participantInfo: { flex: 1 },
  participantName: { fontSize: 14, fontWeight: '500' },
  participantStatus: { fontSize: 12, marginTop: 2 },
  staleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  disclaimer: { margin: 16, borderRadius: 12, borderWidth: 1, padding: 12 },
  disclaimerText: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
