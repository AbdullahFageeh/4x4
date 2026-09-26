import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { broncoLight, broncoDark } from '../theme';
import { useAppStore } from '../../store/useAppStore';
import { useBroncoStore } from '../broncoStore';

interface Props {
  navigation: any;
}

export function VoiceCallScreen({ navigation }: Props) {
  const { isDark } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
  const { voiceActive, voiceParticipants, endVoice } = useBroncoStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!voiceActive) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [voiceActive]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  const members = [
    { name: 'سالم الحربي (منظّم)', speaking: voiceActive && elapsed % 20 < 12, car: 'Bronco Black Diamond' },
    { name: 'نوف العتيبي', speaking: voiceActive && elapsed % 20 >= 12, car: 'Bronco Area 51' },
    { name: 'فهد القحطاني', speaking: false, car: '—' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Text style={{ color: theme.colors.primary, fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.colors.text }]}>المحادثة الصوتية</Text>
        <Text style={{ fontSize: 16 }}>📡</Text>
      </View>

      <View style={styles.center}>
        <View style={[styles.pulse, { borderColor: voiceActive ? theme.colors.success : theme.colors.border }]}>
          <View style={[styles.pulse2, { borderColor: voiceActive ? theme.colors.success : theme.colors.border }]}>
            <View style={[styles.callCircle, { backgroundColor: voiceActive ? theme.colors.success : theme.colors.disabled }]}>
              <Text style={{ fontSize: 40 }}>{voiceActive ? '📞' : '🔇'}</Text>
            </View>
          </View>
        </View>
        {voiceActive ? (
          <>
            <Text style={[styles.timer, { color: theme.colors.text }]}>{mm}:{ss}</Text>
            <Text style={[styles.status, { color: theme.colors.success }]}>قناة الرحلة مباشرة — {voiceParticipants} متصلون</Text>
          </>
        ) : (
          <Text style={[styles.status, { color: theme.colors.textMuted }]}>غير نشط</Text>
        )}
      </View>

      <View style={[styles.memberList, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {members.map((m) => (
          <View key={m.name} style={styles.memberRow}>
            <View style={[styles.avatar, { backgroundColor: m.speaking ? theme.colors.success : theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.memberName, { color: theme.colors.text }]}>
                {m.name} {m.speaking ? '🔊' : ''}
              </Text>
              <Text style={[styles.memberCar, { color: theme.colors.textMuted }]}>{m.car}</Text>
            </View>
            <TouchableOpacity>
              <Text style={{ fontSize: 18 }}>{m.speaking ? '🔈' : '🔇'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={[styles.ctrlBtn, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={{ fontSize: 22 }}>🎤</Text>
          <Text style={[styles.ctrlLabel, { color: theme.colors.textMuted }]}>كتم</Text>
        </TouchableOpacity>
        {voiceActive ? (
          <TouchableOpacity style={[styles.endBtn, { backgroundColor: theme.colors.error }]} onPress={endVoice}>
            <Text style={{ fontSize: 26 }}>📵</Text>
            <Text style={styles.ctrlLabelWhite}>إنهاء</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.endBtn, { backgroundColor: theme.colors.success }]}
            onPress={() => {
              const { startVoice } = useBroncoStore.getState();
              startVoice(3);
              setElapsed(0);
            }}
          >
            <Text style={{ fontSize: 26 }}>📞</Text>
            <Text style={styles.ctrlLabelWhite}>ابدأ القناة</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.ctrlBtn, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={{ fontSize: 22 }}>🔊</Text>
          <Text style={[styles.ctrlLabel, { color: theme.colors.textMuted }]}>السماعة</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.note, { color: theme.colors.textMuted }]}>
        💡 القناة الصوتية تعمل داخل الرحلة المباشرة — مثالية للتنسيق أثناء التطعيس بدون رسائل.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1 },
  topTitle: { fontSize: 16, fontWeight: '700' },
  center: { alignItems: 'center', paddingVertical: 36 },
  pulse: { borderRadius: 999, borderWidth: 2, width: 150, height: 150, alignItems: 'center', justifyContent: 'center' },
  pulse2: { borderRadius: 999, borderWidth: 2, width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  callCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  timer: { fontSize: 22, fontWeight: '700', marginTop: 16 },
  status: { fontSize: 13, marginTop: 6 },
  memberList: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  memberRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(128,128,128,0.1)' },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  memberName: { fontSize: 14, fontWeight: '600' },
  memberCar: { fontSize: 12, marginTop: 2 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20 },
  ctrlBtn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  ctrlLabel: { fontSize: 11, marginTop: 2 },
  endBtn: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center' },
  ctrlLabelWhite: { color: '#fff', fontSize: 11, marginTop: 2 },
  note: { textAlign: 'center', fontSize: 12, paddingHorizontal: 24, paddingBottom: 16, lineHeight: 18 },
});