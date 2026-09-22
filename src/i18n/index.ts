import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import { getLocales } from 'react-native-localize';

import ar from './locales/ar.json';
import en from './locales/en.json';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
};

const getDeviceLanguage = () => {
  try {
    const locales = getLocales();
    return locales[0]?.languageCode || 'ar';
  } catch {
    return 'ar';
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Force RTL for Arabic
i18n.on('languageChanged', (lng) => {
  const isRTL = lng === 'ar';
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
});

export const changeLanguage = async (lng: 'ar' | 'en') => {
  await i18n.changeLanguage(lng);
};

export default i18n;
