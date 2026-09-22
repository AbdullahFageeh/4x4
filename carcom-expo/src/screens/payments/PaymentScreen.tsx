import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';
import { createMoyasarPaymentConfig, PAYMENT_METHODS, formatAmountForMoyasar, moyasarPublicKey, isMoyasarTestMode } from '../../services/moyasar';
import { CreditCardConfig, ApplePayConfig, SamsungPayConfig } from 'react-native-moyasar-sdk';

interface Props {
  navigation: any;
  route: any;
}

export function PaymentScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;
  const { amount, tripId, title } = route.params;

  const [selectedMethod, setSelectedMethod] = useState<string>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const handlePayment = () => {
    if (!moyasarPublicKey) {
      Alert.alert('تنبيه', 'لم يتم تكوين Moyasar بعد. يرجى إضافة مفتاح API في .env');
      return;
    }
    setIsProcessing(true);
    try {
      const amountInHalalas = formatAmountForMoyasar(amount);
      const paymentConfig = createMoyasarPaymentConfig({
        amountInHalalas,
        description: title || 'CarCom Trip Payment',
        givenId: `trip-${tripId}-${Date.now()}`,
        creditCardConfig: new CreditCardConfig({ saveCard, manual: true }),
        applePayConfig: new ApplePayConfig({
          merchantId: process.env.EXPO_PUBLIC_MOYASAR_APPLE_MERCHANT_ID || '',
          label: 'CarCom',
        }),
        samsungPayConfig: new SamsungPayConfig({
          serviceId: process.env.EXPO_PUBLIC_MOYASAR_SAMSUNG_SERVICE_ID || '',
          merchantName: 'CarCom',
        }),
      });
      // In production, render the SDK components (CreditCard, ApplePay, etc.)
      // For now, we show the config object
      setTimeout(() => {
        setIsProcessing(false);
        Alert.alert('تنبيه', 'هذه نسخة تجريبية. استخدم مكونات SDK الحقيقية في الإنتاج.');
      }, 1000);
    } catch (error: any) {
      setIsProcessing(false);
      Alert.alert('خطأ', error.message || 'حدث خطأ أثناء معالجة الدفع');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>الدفع</Text>
        <View style={{ width: 32 }} />
      </View>

      {isMoyasarTestMode && (
        <View style={[styles.testModeBanner, { backgroundColor: theme.colors.warning }]}>
          <Text style={styles.testModeText}>🎬 وضع التجربة — لن يتم خصم أي مبلغ حقيقي</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>المبلغ المطلوب</Text>
          <Text style={[styles.summaryAmount, { color: theme.colors.accent }]}>SAR {amount}</Text>
          <Text style={[styles.summaryDesc, { color: theme.colors.textMuted }]}>{title}</Text>
        </View>

        <View style={[styles.methodsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>طريقة الدفع</Text>
          {Object.values(PAYMENT_METHODS).map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              style={[styles.methodRow, { borderColor: theme.colors.border }]}>
              <View style={[styles.radio, { borderColor: theme.colors.primary }]}>
                {selectedMethod === method.id && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
              </View>
              <Text style={[styles.methodLabel, { color: theme.colors.text }]}>{method.labelAr}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMethod === 'credit_card' && (
          <View style={[styles.formCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="رقم البطاقة"
              placeholderTextColor={theme.colors.placeholder}
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="number-pad"
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="MM/YY"
                placeholderTextColor={theme.colors.placeholder}
                value={expiry}
                onChangeText={setExpiry}
              />
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 12, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="CVV"
                placeholderTextColor={theme.colors.placeholder}
                value={cvv}
                onChangeText={setCvv}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: theme.colors.text }]}>حفظ البطاقة</Text>
              <Switch value={saveCard} onValueChange={setSaveCard} />
            </View>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={handlePayment}
        disabled={isProcessing}
        style={[styles.payButton, { backgroundColor: theme.colors.primary }]}>
        {isProcessing ? (
          <ActivityIndicator size="small" color={theme.colors.onPrimary} />
        ) : (
          <Text style={[styles.payButtonText, { color: theme.colors.onPrimary }]}>ادفع SAR {amount}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backButton: { fontSize: 24 },
  title: { fontSize: 20, fontWeight: '600' },
  testModeBanner: { marginHorizontal: 16, marginBottom: 16, borderRadius: 8, padding: 10, alignItems: 'center' },
  testModeText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  summaryCard: { borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 16, alignItems: 'center' },
  summaryLabel: { fontSize: 14, marginBottom: 8 },
  summaryAmount: { fontSize: 32, fontWeight: '700' },
  summaryDesc: { fontSize: 14, marginTop: 4 },
  methodsCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  methodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  methodLabel: { fontSize: 16 },
  formCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  input: { height: 44, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, marginBottom: 10, fontSize: 16 },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  switchLabel: { fontSize: 16 },
  payButton: { margin: 16, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  payButtonText: { fontSize: 18, fontWeight: '600' },
});
