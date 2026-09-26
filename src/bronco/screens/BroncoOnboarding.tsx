import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { broncoLight, broncoDark } from '../theme';
import { useAppStore } from '../../store/useAppStore';
import { useBroncoStore } from '../broncoStore';
import { UserRole } from '../types';

const ROLES: { key: UserRole; label: string; desc: string; icon: string }[] = [
  { key: 'member', label: 'عضو', desc: 'انضم لرحلات البرونكو وشارك المجتمع', icon: '🚙' },
  { key: 'organizer', label: 'منظّم رحلات', desc: 'أنشئ رحلات وأدعِ الأعضاء', icon: '🗺️' },
  { key: 'community_admin', label: 'مسؤول مجتمع', desc: 'راجع الرحلات والأعضاء', icon: '🛠️' },
  { key: 'platform_admin', label: 'مسؤول منصة', desc: 'لوحة تحكم كاملة (تجربة)', icon: '👑' },
];

interface Props {
  onFinished: () => void;
}

export function BroncoOnboarding({ onFinished }: Props) {
  const { isDark, language, setLanguage } = useAppStore();
  const { setRole, setUserId } = useBroncoStore();
  const theme = isDark ? broncoDark : broncoLight;
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('member');

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerIcon}>🛻</Text>
        <Text style={styles.headerTitle}>Bronco Edition</Text>
        <Text style={styles.headerSub}>Ford Bronco — كروب البرونكو السعودي</Text>
      </View>

      {step === 0 && (
        <View style={styles.body}>
          <Text style={[styles.title, { color: theme.colors.text }]}>مرحبًا بك 🙌</Text>
          <Text style={[styles.desc, { color: theme.colors.textMuted }]}>
            مجتمع خاص بملاك الفورد برونكو في السعودية. خطط رحلات البر، شارك التكاليف، وشارك موقعك المباشر مع القروب.
          </Text>
          <TouchableOpacity
            style={[styles.langRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          >
            <Text style={[styles.langLabel, { color: theme.colors.textMuted }]}>اللغة / Language</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['ar', 'en'] as const).map((l) => (
                <View
                  key={l}
                  style={[
                    styles.langChip,
                    {
                      backgroundColor: language === l ? theme.colors.primary : 'transparent',
                      borderColor: language === l ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: language === l ? theme.colors.onPrimary : theme.colors.text, fontWeight: '600' }}>
                    {l === 'ar' ? 'العربية' : 'English'}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: theme.colors.primary }]}
            onPress={() => setStep(1)}
          >
            <Text style={[styles.ctaText, { color: theme.colors.onPrimary }]}>التالي</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 1 && (
        <View style={styles.body}>
          <Text style={[styles.title, { color: theme.colors.text }]}>اختر دورك في المجتمع</Text>
          <Text style={[styles.desc, { color: theme.colors.textMuted }]}>
            الدور يحدد ما تراه في التطبيق — يمكن تغييره لاحقًا من ملفك الشخصي.
          </Text>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.key}
              style={[
                styles.roleCard,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: selectedRole === r.key ? theme.colors.primary : theme.colors.border,
                  borderWidth: selectedRole === r.key ? 2 : 1,
                },
              ]}
              onPress={() => setSelectedRole(r.key)}
            >
              <Text style={{ fontSize: 28 }}>{r.icon}</Text>
              <View style={styles.roleText}>
                <Text style={[styles.roleLabel, { color: theme.colors.text }]}>{r.label}</Text>
                <Text style={[styles.roleDesc, { color: theme.colors.textMuted }]}>{r.desc}</Text>
              </View>
              {selectedRole === r.key && <Text style={{ color: theme.colors.primary }}>✓</Text>}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              setRole(selectedRole);
              setStep(2);
            }}
          >
            <Text style={[styles.ctaText, { color: theme.colors.onPrimary }]}>التالي</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.body}>
          <Text style={{ fontSize: 56 }}>🏜️</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>جاهز للمغامرة؟</Text>
          <Text style={[styles.desc, { color: theme.colors.textMuted }]}>
            ستحصل على: رحلات البر 🗺️، محادثة القروب 💬، دفع مواسر 💳، موقع مباشر 📍، زر SOS 🆘، وخرائط أوفلاين.
          </Text>
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              // demo: start as Abdullah (admin) so the admin panel is reachable
              setUserId('user-001');
              onFinished();
            }}
          >
            <Text style={[styles.ctaText, { color: theme.colors.onPrimary }]}>ابدأ الآن 🚀</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 24, alignItems: 'center' },
  headerIcon: { fontSize: 56 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 8 },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  body: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 22, marginBottom: 16 },
  langRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 16 },
  langLabel: { fontSize: 13 },
  langChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  roleCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 10 },
  roleText: { flex: 1, marginHorizontal: 12 },
  roleLabel: { fontSize: 15, fontWeight: '700' },
  roleDesc: { fontSize: 12, marginTop: 2 },
  cta: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  ctaText: { fontSize: 16, fontWeight: '700' },
});