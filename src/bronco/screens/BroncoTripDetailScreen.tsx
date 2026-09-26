import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { broncoLight, broncoDark } from '../theme';
import { useAppStore } from '../../store/useAppStore';
import { useBroncoStore, useCurrentBroncoUser } from '../broncoStore';
import { DEMO_TRIPS } from '../../services/demoData';
import { TRIP_CATEGORIES } from '../../types/trip';

interface Props {
  navigation: any;
  route: any;
}

export function BroncoTripDetailScreen({ navigation, route }: Props) {
  const { isDark } = useAppStore();
  const theme = isDark ? broncoDark : broncoLight;
  const { reviews, addReview, liveSharing, toggleLiveSharing, role, logAction } = useBroncoStore();
  const user = useCurrentBroncoUser();
  const [reviewModal, setReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const trip = DEMO_TRIPS.find((t) => t.id === route?.params?.id) ?? DEMO_TRIPS[0];
  const cat = TRIP_CATEGORIES.find((c) => c.key === trip.category);
  const tripReviews = reviews.filter((r) => r.trip_id === trip.id);
  const avg = tripReviews.length ? tripReviews.reduce((s, r) => s + r.rating, 0) / tripReviews.length : 0;
  const isOrganizer = role === 'organizer' || role === 'community_admin' || role === 'platform_admin';

  const submitReview = () => {
    if (!user || !comment) return;
    addReview({
      id: `rev-${Date.now()}`,
      trip_id: trip.id,
      user_id: user.id,
      rating,
      comment,
      created_at: new Date().toISOString(),
    });
    logAction('SUBMIT_REVIEW', trip.id, `تقييم رحلة ${trip.title} بـ ${rating} نجوم`);
    setReviewModal(false);
    setComment('');
    setRating(5);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{trip.title}</Text>
          <Text style={styles.subtitle}>
            {cat?.emoji} {cat?.label_ar} • {trip.date}
          </Text>
        </View>
        <Text style={{ fontSize: 20 }}>🛻</Text>
      </View>

      {/* Live controls */}
      <View style={[styles.liveBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={[styles.liveDot, { backgroundColor: liveSharing ? theme.colors.success : theme.colors.disabled }]} />
          <View>
            <Text style={[styles.liveTitle, { color: theme.colors.text }]}>الموقع المباشر</Text>
            <Text style={[styles.liveSub, { color: theme.colors.textMuted }]}>
              {liveSharing ? 'مباشر الآن' : 'متوقف'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.liveToggle, { backgroundColor: liveSharing ? theme.colors.success : theme.colors.disabled }]} onPress={toggleLiveSharing}>
          <View style={styles.liveKnob} />
        </TouchableOpacity>
      </View>

      {/* Voice channel */}
      <TouchableOpacity
        style={[styles.voiceBtn, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        onPress={() => navigation.navigate('BroncoVoice')}
      >
        <Text style={{ fontSize: 22 }}>🎙️</Text>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.voiceTitle, { color: theme.colors.text }]}>قناة صوتية مباشرة</Text>
          <Text style={[styles.voiceSub, { color: theme.colors.textMuted }]}>تنسيق مع القروب أثناء الرحلة بدون رسائل</Text>
        </View>
        <Text style={{ fontSize: 18 }}>→</Text>
      </TouchableOpacity>

      {/* Info */}
      <InfoBlock theme={theme} title="📍 الوجهة" value={`${trip.destination.name} — ${trip.date} ${trip.departure_time}`} />
      <InfoBlock theme={theme} title="🚩 نقطة التجمع" value={trip.meeting_point.name} />
      <InfoBlock theme={theme} title="👥 المشاركون" value={`${trip.current_participants} من ${trip.participant_limit}`} />
      <InfoBlock theme={theme} title="💰 التكلفة التقديرية" value={`${trip.estimated_cost} ر.س (تُقسّم على المشاركين)`} />

      {/* Itinerary */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🕐 الجدول</Text>
        {trip.itinerary.split('\n').map((line, i) => (
          <Text key={i} style={[styles.itineraryLine, { color: theme.colors.textMuted }]}>{line}</Text>
        ))}
      </View>

      {/* Checklist */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>✅ قائمة التحضير</Text>
        <View style={styles.checklist}>
          {trip.preparation_checklist.map((c) => (
            <View key={c} style={[styles.checkItem, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Text style={{ color: theme.colors.success }}>✓</Text>
              <Text style={[styles.checkText, { color: theme.colors.text }]}>{c}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Reviews */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.reviewsHead}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>⭐ التقييمات</Text>
          <TouchableOpacity onPress={() => setReviewModal(true)}>
            <Text style={[styles.reviewCta, { color: theme.colors.primary }]}>+ قيّم الرحلة</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.avgRow}>
          <Text style={[styles.avgValue, { color: theme.colors.accent }]}>{avg > 0 ? avg.toFixed(1) : '—'}</Text>
          <View style={styles.avgStars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Text key={i} style={{ fontSize: 16, color: i <= Math.round(avg) ? theme.colors.accent : theme.colors.border }}>★</Text>
            ))}
          </View>
          <Text style={[styles.avgCount, { color: theme.colors.textMuted }]}>
            {tripReviews.length} تقييم
          </Text>
        </View>
        {tripReviews.length === 0 && (
          <Text style={[styles.noReviews, { color: theme.colors.textMuted }]}>لا توجد تقييمات بعد — كن أول من يقيّم!</Text>
        )}
        {tripReviews.map((r) => (
          <View key={r.id} style={[styles.reviewCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <View style={styles.reviewTop}>
              <Text style={[styles.reviewerName, { color: theme.colors.text }]}>{r.user?.name}</Text>
              <View style={styles.reviewerStars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Text key={i} style={{ fontSize: 13, color: i <= r.rating ? theme.colors.accent : theme.colors.border }}>★</Text>
                ))}
              </View>
            </View>
            <Text style={[styles.reviewComment, { color: theme.colors.textMuted }]}>{r.comment}</Text>
            <Text style={[styles.reviewDate, { color: theme.colors.textMuted }]}>{r.created_at.slice(0, 10)}</Text>
          </View>
        ))}
      </View>

      {/* Organizer actions */}
      {isOrganizer && (
        <View style={styles.orgActions}>
          <TouchableOpacity style={[styles.orgBtn, { backgroundColor: theme.colors.error, opacity: 0.9 }]} onPress={() => navigation.goBack()}>
            <Text style={styles.orgBtnText}>إلغاء الرحلة</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={[styles.joinBtn, { backgroundColor: theme.colors.primary }]} onPress={() => {}}>
        <Text style={[styles.joinText, { color: theme.colors.onPrimary }]}>🛻 انضم للرحلة</Text>
      </TouchableOpacity>

      {/* Review modal */}
      <Modal visible={reviewModal} transparent animationType="slide">
        <View style={[styles.modalBackdrop, { backgroundColor: theme.colors.backdrop }]}>
          <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>قيّم رحلة {trip.title}</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <Text style={{ fontSize: 36, color: i <= rating ? theme.colors.accent : theme.colors.border }}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.reviewInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={comment}
              onChangeText={setComment}
              placeholder="ماذا كانت أجمل لحظة في الرحلة؟"
              placeholderTextColor={theme.colors.placeholder}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalCancel, { borderColor: theme.colors.border }]} onPress={() => setReviewModal(false)}>
                <Text style={[styles.modalCancelText, { color: theme.colors.textMuted }]}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmit, { backgroundColor: theme.colors.primary }]}
                disabled={!comment}
                onPress={submitReview}
              >
                <Text style={[styles.modalSubmitText, { color: theme.colors.onPrimary }]}>إرسال التقييم</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function InfoBlock({ theme, title, value }: { theme: any; title: string; value: string }) {
  return (
    <View style={[styles.infoBlock, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.infoTitle, { color: theme.colors.textMuted }]}>{title}</Text>
      <Text style={[styles.infoValue, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 10 },
  backBtn: { padding: 4 },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 3 },
  liveBar: { flexDirection: 'row', alignItems: 'center', margin: 16, borderRadius: 14, borderWidth: 1, padding: 14 },
  liveDot: { width: 10, height: 10, borderRadius: 5 },
  liveTitle: { fontSize: 13, fontWeight: '700' },
  liveSub: { fontSize: 11, marginTop: 2 },
  liveToggle: { width: 46, height: 26, borderRadius: 13, position: 'relative', paddingLeft: 1 },
  liveKnob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', position: 'absolute', top: 2, right: 2 },
  voiceBtn: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  voiceTitle: { fontSize: 14, fontWeight: '700' },
  voiceSub: { fontSize: 11, marginTop: 2 },
  infoBlock: { marginHorizontal: 16, marginBottom: 8, borderRadius: 12, borderWidth: 1, padding: 12 },
  infoTitle: { fontSize: 11, marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  section: { marginHorizontal: 16, marginBottom: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  itineraryLine: { fontSize: 13, lineHeight: 24 },
  checklist: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  checkText: { fontSize: 12 },
  reviewsHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewCta: { fontSize: 13, fontWeight: '700' },
  avgRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  avgValue: { fontSize: 26, fontWeight: '900' },
  avgStars: { flexDirection: 'row' },
  avgCount: { fontSize: 12 },
  noReviews: { fontSize: 13, marginBottom: 8 },
  reviewCard: { borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  reviewerName: { fontSize: 14, fontWeight: '700' },
  reviewerStars: { flexDirection: 'row' },
  reviewComment: { fontSize: 13, lineHeight: 19 },
  reviewDate: { fontSize: 11, marginTop: 6 },
  orgActions: { marginHorizontal: 16, marginBottom: 8 },
  orgBtn: { borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  orgBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  joinBtn: { margin: 16, marginBottom: 24, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  joinText: { fontSize: 16, fontWeight: '800' },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 24 },
  modal: { borderRadius: 18, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
  starRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 14 },
  reviewInput: { borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 14, minHeight: 90, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  modalCancel: { flex: 1, borderRadius: 12, borderWidth: 1, paddingVertical: 13, alignItems: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '600' },
  modalSubmit: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  modalSubmitText: { fontSize: 14, fontWeight: '700' },
});