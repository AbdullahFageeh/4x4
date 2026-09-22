import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useCommunityStore } from '../../store/communityStore';
import { lightTheme, darkTheme } from '../../theme';

interface Props {
  navigation: any;
}

export function CreateCommunityScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { createCommunity } = useCommunityStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [carModel, setCarModel] = useState('');
  const [rules, setRules] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('اسم المجتمع مطلوب');
      return;
    }
    if (!carModel.trim()) {
      setError('موديل السيارة مطلوب');
      return;
    }
    if (!description.trim()) {
      setError('وصف المجتمع مطلوب');
      return;
    }

    setLoading(true);
    setError('');

    const community = await createCommunity({
      name: name.trim(),
      description: description.trim(),
      car_model: carModel.trim(),
      visibility: isPublic ? 'public' : 'private',
      rules: rules.trim(),
    });

    setLoading(false);
    if (community) {
      navigation.replace('CommunityDetail', { communityId: community.id });
    }
  };

  const carModels = [
    'Toyota Land Cruiser',
    'Nissan Patrol',
    'Jeep Wrangler',
    'Toyota Hilux',
    'Jeep Grand Cherokee',
    'Toyota Camry',
    'Honda Accord',
    'Other',
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('community.create')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('community.name')}</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text },
            ]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError('');
            }}
            placeholder="مثال: LC Club KSA"
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('community.carModel')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {carModels.map((model) => (
              <TouchableOpacity
                key={model}
                onPress={() => setCarModel(model)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: carModel === model ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    { color: carModel === model ? theme.colors.onPrimary : theme.colors.text },
                  ]}>
                  {model}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text, marginTop: 8 },
            ]}
            value={carModel}
            onChangeText={setCarModel}
            placeholder="أو اكتب الموديل يدوياً"
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('community.description')}</Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text },
            ]}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setError('');
            }}
            placeholder="اكتب وصفاً للمجتمع..."
            placeholderTextColor={theme.colors.placeholder}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('community.rules')}</Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text },
            ]}
            value={rules}
            onChangeText={setRules}
            placeholder="• القاعدة الأولى\n• القاعدة الثانية"
            placeholderTextColor={theme.colors.placeholder}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.visibilityRow}>
            <View>
              <Text style={[styles.label, { color: theme.colors.text }]}>{t('community.visibility')}</Text>
              <Text style={[styles.helper, { color: theme.colors.textMuted }]}>
                {isPublic ? 'أي شخص يمكن الانضمام' : 'يتطلب موافقة المنظم'}
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
            />
          </View>
          <Text style={[styles.visibilityValue, { color: theme.colors.textMuted }]}>
            {isPublic ? t('community.public') : t('community.private')}
          </Text>
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
  form: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  chipScroll: { flexGrow: 0, marginBottom: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: { fontSize: 14, fontWeight: '500' },
  visibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  visibilityValue: { fontSize: 14, marginTop: 4 },
  helper: { fontSize: 12, marginTop: 2 },
  error: { fontSize: 14, marginBottom: 12 },
  submitButton: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  submitText: { fontSize: 16, fontWeight: '600' },
});
