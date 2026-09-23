import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useTripStore } from '../../store/tripStore';
import { lightTheme, darkTheme } from '../../theme';
import { TRIP_CATEGORIES } from '../../types/trip';

interface Props {
  navigation: any;
}

export function CreateTripScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { createTrip } = useTripStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); void setDescription;
  const [category, setCategory] = useState<'scenic' | 'camping' | 'offroad' | 'city_meetup'>('offroad');
  const [destination, setDestination] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [date, setDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [participantLimit, setParticipantLimit] = useState('10');
  const [estimatedCost, setEstimatedCost] = useState('100');
  const [itinerary, setItinerary] = useState('');
  const [checklist, setChecklist] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return setError('عنوان الرحلة مطلوب');
    if (!destination.trim()) return setError('الوجهة مطلوبة');
    if (!date) return setError('التاريخ مطلوب');
    if (!departureTime) return setError('وقت المغادرة مطلوب');

    setLoading(true);
    setError('');
    const trip = await createTrip({
      community_id: 'comm-001',
      title: title.trim(),
      description: description.trim(),
      category,
      destination: { name: destination.trim(), lat: 0, lng: 0 },
      meeting_point: { name: meetingPoint.trim() || destination.trim(), lat: 0, lng: 0 },
      route_stops: [],
      date,
      departure_time: departureTime,
      participant_limit: parseInt(participantLimit) || 10,
      estimated_cost: parseFloat(estimatedCost) || 100,
      itinerary: itinerary.trim(),
      preparation_checklist: checklist.split('\n').filter((c) => c.trim()),
    });
    setLoading(false);
    if (trip) navigation.replace('TripDetail', { tripId: trip.id });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('trip.create')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('trip.title')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={title}
            onChangeText={(t) => { setTitle(t); setError(''); }}
            placeholder="مثال: رحلة وادي ديسي"
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>التصنيف</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {TRIP_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setCategory(cat.key)}
                style={[styles.chip, { backgroundColor: category === cat.key ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.chipText, { color: category === cat.key ? theme.colors.onPrimary : theme.colors.text }]}>
                  {cat.emoji} {cat.label_ar}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('trip.destination')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={destination}
            onChangeText={(t) => { setDestination(t); setError(''); }}
            placeholder="اسم المكان أو المنطقة"
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('trip.meetingPoint')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={meetingPoint}
            onChangeText={setMeetingPoint}
            placeholder="نقطة الاجتماع (اختياري)"
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{t('trip.date')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={date}
              onChangeText={(t) => { setDate(t); setError(''); }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{t('trip.departureTime')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={departureTime}
              onChangeText={(t) => { setDepartureTime(t); setError(''); }}
              placeholder="HH:MM"
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{t('trip.participantLimit')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={participantLimit}
              onChangeText={setParticipantLimit}
              keyboardType="number-pad"
              placeholder="10"
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{t('trip.estimatedCost')} (SAR)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              value={estimatedCost}
              onChangeText={setEstimatedCost}
              keyboardType="number-pad"
              placeholder="100"
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>الجدول الزمني</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={itinerary}
            onChangeText={setItinerary}
            placeholder="6:00 AM — الاجتماع\n8:00 AM — الوصول..."
            placeholderTextColor={theme.colors.placeholder}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('trip.preparationChecklist')}</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
            value={checklist}
            onChangeText={setChecklist}
            placeholder="• إطارات احتياطية\n• ماء وطعام"
            placeholderTextColor={theme.colors.placeholder}
            multiline
            numberOfLines={4}
          />
        </View>

        {error ? <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.submitText, { color: theme.colors.onPrimary }]}>
            {loading ? '⏳' : t('common.save')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  form: { paddingHorizontal: 20, paddingBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: { height: 52, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  textArea: { height: 100, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  chipScroll: { flexGrow: 0, marginBottom: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  chipText: { fontSize: 14, fontWeight: '500' },
  error: { fontSize: 14, marginBottom: 12 },
  submitButton: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  submitText: { fontSize: 16, fontWeight: '600' },
});
