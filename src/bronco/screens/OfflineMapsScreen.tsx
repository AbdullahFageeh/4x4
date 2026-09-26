import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { broncoLight, broncoDark } from '../theme';
import { useAppStore } from '../../store/useAppStore';
import { useBroncoStore } from '../broncoStore';

interface Props {
  navigation: any;
}

export function OfflineMapsScreen({ navigation }: Props) {
  const { isDark, isOffline } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
  const { offlineRegions, downloadRegion, liveSharing, toggleLiveSharing } = useBroncoStore();
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const startDownload = (id: string) => {
    if (downloading[id]) return;
    setDownloading((d) => ({ ...d, [id]: true }));
    downloadRegion(id);
    let progress = 50;
    const timer = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearInterval(timer);
        setDownloading((d) => ({ ...d, [id]: false }));
        // mark as downloaded via a second store update
        useBroncoStore.setState({
          offlineRegions: useBroncoStore.getState().offlineRegions.map((x) =>
            x.id === id ? { ...x, status: 'downloaded' as const, progress: 100 } : x
          ),
        });
      } else {
        useBroncoStore.setState({
          offlineRegions: useBroncoStore.getState().offlineRegions.map((x) =>
            x.id === id ? { ...x, progress } : x
          ),
        });
      }
    }, 700);
  };

  const totalMb = offlineRegions.reduce((s, r) => s + (r.status === 'downloaded' ? r.sizeMb : 0), 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Text style={{ color: theme.colors.primary, fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.colors.text }]}>الخرائط الأوفلاين</Text>
        <Text style={{ fontSize: 16 }}>🗺️</Text>
      </View>

      {isOffline && (
        <View style={[styles.offlineBanner, { backgroundColor: theme.colors.warning }]}>
          <Text style={styles.offlineText}>📡 أنت بلا اتصال — الخرائط تظهر من النسخ المحملة فقط.</Text>
        </View>
      )}

      <View style={[styles.summary, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>{totalMb} م.ب</Text>
        <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>محمل على جهازك — يعمل بدون إنترنت في البر</Text>
      </View>

      <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
        ⚠️ في مناطق البر لا يوجد تغطية غالبًا. حمّل خرائط مسار رحلتك قبل الانطلاق.
      </Text>

      {offlineRegions.map((r) => (
        <View key={r.id} style={[styles.regionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.regionTop}>
            <Text style={{ fontSize: 24 }}>{r.status === 'downloaded' ? '✅' : r.status === 'downloading' ? '⬇️' : '📥'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.regionName, { color: theme.colors.text }]}>{r.name_ar}</Text>
              <Text style={[styles.regionSize, { color: theme.colors.textMuted }]}>{r.sizeMb} م.ب</Text>
            </View>
            {r.status !== 'downloaded' ? (
              <TouchableOpacity
                style={[styles.dlBtn, { backgroundColor: theme.colors.primary }]}
                onPress={() => startDownload(r.id)}
              >
                <Text style={[styles.dlBtnText, { color: theme.colors.onPrimary }]}>
                  {downloading[r.id] || r.status === 'downloading' ? 'جارٍ التحميل…' : 'تحميل'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.doneTag}>
                <Text style={styles.doneText}>محمل ✓</Text>
              </View>
            )}
          </View>
          {(downloading[r.id] || r.status === 'downloading') && (
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.progressFill, { backgroundColor: theme.colors.primary, width: `${r.progress}%` }]} />
            </View>
          )}
        </View>
      ))}

      {/* Live location section */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📍 الموقع المباشر</Text>
      <View style={[styles.liveCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.liveTitle, { color: theme.colors.text }]}>مشاركة موقعي مع القروب</Text>
            <Text style={[styles.liveSub, { color: theme.colors.textMuted }]}>
              {liveSharing ? 'مباشر الآن — يظهر موقعك لمنظمي الرحلة' : 'متوقف — سيبدأ مع انطلاق الرحلة'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.switch, { backgroundColor: liveSharing ? theme.colors.success : theme.colors.disabled }]}
            onPress={toggleLiveSharing}
          >
            <View style={[styles.knob, { left: liveSharing ? 26 : 2 }]} />
          </TouchableOpacity>
        </View>
        {liveSharing && (
          <View style={[styles.liveRow, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Text style={[styles.liveRowText, { color: theme.colors.success }]}>🟢 24.7136° N, 46.6753° E — طريق الرياض-حائل</Text>
          </View>
        )}
      </View>

      <Text style={[styles.disclaimer, { color: theme.colors.textMuted }]}>
        💡 الموقع المباشر يستهلك بطارية أقل عند استخدام وضع توفير الطاقة.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1 },
  topTitle: { fontSize: 16, fontWeight: '700' },
  offlineBanner: { margin: 16, borderRadius: 12, padding: 12 },
  offlineText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  summary: { margin: 16, borderRadius: 14, borderWidth: 1, padding: 18, alignItems: 'center' },
  summaryValue: { fontSize: 30, fontWeight: '900' },
  summaryLabel: { fontSize: 12, marginTop: 4 },
  hint: { fontSize: 12, paddingHorizontal: 16, lineHeight: 18 },
  regionCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 14, borderWidth: 1, padding: 14 },
  regionTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  regionName: { fontSize: 14, fontWeight: '700' },
  regionSize: { fontSize: 11, marginTop: 2 },
  dlBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  dlBtnText: { fontSize: 12, fontWeight: '700' },
  doneTag: { backgroundColor: 'rgba(76,175,80,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  doneText: { color: '#388E3C', fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 6, borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginHorizontal: 16, marginTop: 14, marginBottom: 8 },
  liveCard: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, padding: 14 },
  liveTitle: { fontSize: 14, fontWeight: '700' },
  liveSub: { fontSize: 12, marginTop: 3 },
  switch: { width: 50, height: 28, borderRadius: 14, position: 'relative' },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', position: 'absolute', top: 2 },
  liveRow: { flexDirection: 'row', borderRadius: 10, borderWidth: 1, padding: 10, marginTop: 12 },
  liveRowText: { fontSize: 12, fontWeight: '600' },
  disclaimer: { fontSize: 12, textAlign: 'center', margin: 16, lineHeight: 18 },
});