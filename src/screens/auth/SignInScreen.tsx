import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';

interface SignInScreenProps {
  navigation: any;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDark, setAuthenticated } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSignIn = async () => {
    if (!phone) {
      setError(t('auth.phoneRequired'));
      return;
    }
    if (!phone.startsWith('+966')) {
      setError(t('auth.phoneInvalid'));
      return;
    }
    if (!password) {
      setError(t('auth.passwordRequired'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.passwordMinLength'));
      return;
    }

    setLoading(true);
    setError('');

    // Simulated auth - in production this calls Supabase
    setTimeout(() => {
      setLoading(false);
      setAuthenticated({
        id: 'user-001',
        name: 'عبدالله',
        avatarUrl: null,
        phone: phone,
        preferredLanguage: 'ar',
        carModel: 'Toyota Land Cruiser 2022',
        carDetails: { year: 2022, color: 'White', modifications: [] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('auth.welcomeBack')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {t('tabs.communities')} • {t('tabs.trips')}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('auth.phone')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setError('');
              }}
              keyboardType="phone-pad"
              placeholder="+966XXXXXXXXX"
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('auth.password')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>

          {error ? (
            <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
          ) : null}

          <TouchableOpacity onPress={() => {}}>
            <Text style={[styles.forgot, { color: theme.colors.primary }]}>
              {t('auth.forgotPassword')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.7}
            style={[
              styles.signInButton,
              { backgroundColor: theme.colors.primary, marginTop: 24 },
            ]}>
            {loading ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              <Text style={[styles.signInText, { color: theme.colors.onPrimary }]}>
                {t('auth.signIn')}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View
              style={[styles.dividerLine, { backgroundColor: theme.colors.divider }]}
            />
            <Text style={[styles.dividerText, { color: theme.colors.textMuted }]}>
              {t('auth.signInWith')}
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: theme.colors.divider }]}
            />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[
                styles.socialButton,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}>
              <Text style={[styles.socialText, { color: theme.colors.text }]}>
                 Apple
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.socialButton,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}>
              <Text style={[styles.socialText, { color: theme.colors.text }]}>
                G Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={[styles.switchAuth, { color: theme.colors.primary }]}>
            {t('auth.noAccount')} {t('auth.signUp')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16 },
  form: { flex: 1 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  error: { fontSize: 14, marginTop: 4 },
  forgot: { fontSize: 14, textAlign: 'right', marginTop: 4 },
  signInButton: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: { fontSize: 16, fontWeight: '600' },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 16, fontSize: 14 },
  socialButtons: { flexDirection: 'row', gap: 12 },
  socialButton: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: { fontSize: 16, fontWeight: '500' },
  switchAuth: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
    fontWeight: '500',
  },
});
