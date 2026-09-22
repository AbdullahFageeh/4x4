import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

const slides = [
  {
    key: '1',
    titleKey: 'onboarding.title',
    subtitleKey: 'onboarding.subtitle',
    emoji: '🚗',
  },
  {
    key: '2',
    titleKey: 'onboarding.title',
    subtitleKey: 'onboarding.description',
    emoji: '🏜️',
  },
  {
    key: '3',
    titleKey: 'onboarding.title',
    subtitleKey: 'onboarding.subtitle',
    emoji: '👥',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { isDark, language, setLanguage, setOnboardingComplete } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleLanguageSwitch = (lng: 'ar' | 'en') => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      setOnboardingComplete();
      navigation.replace('Auth');
    }
  };

  const handleSkip = () => {
    setOnboardingComplete();
    navigation.replace('Auth');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.languageSwitch}>
        <TouchableOpacity
          onPress={() => handleLanguageSwitch('ar')}
          style={[
            styles.langButton,
            language === 'ar' && { backgroundColor: theme.colors.primary },
          ]}>
          <Text
            style={[
              styles.langText,
              { color: language === 'ar' ? theme.colors.onPrimary : theme.colors.textMuted },
            ]}>
            عربي
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLanguageSwitch('en')}
          style={[
            styles.langButton,
            language === 'en' && { backgroundColor: theme.colors.primary },
          ]}>
          <Text
            style={[
              styles.langText,
              { color: language === 'en' ? theme.colors.onPrimary : theme.colors.textMuted },
            ]}>
            EN
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {t(item.titleKey)}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              {t(item.subtitleKey)}
            </Text>
          </View>
        )}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? theme.colors.primary : theme.colors.disabled,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.nextText, { color: theme.colors.onPrimary }]}>
            {currentIndex === slides.length - 1
              ? t('onboarding.getStarted')
              : t('common.next')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skip, { color: theme.colors.textMuted }]}>
            {t('onboarding.skip')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  languageSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 60,
    paddingBottom: 24,
  },
  langButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langText: { fontSize: 14, fontWeight: '500' },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: { fontSize: 80, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  nextButton: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  nextText: { fontSize: 16, fontWeight: '600' },
  skip: { fontSize: 14 },
});
