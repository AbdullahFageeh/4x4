import {
  PaymentConfig,
  PaymentResult,
  PaymentResponse,
  PaymentStatus,
  CreditCardConfig,
  ApplePayConfig,
  SamsungPayConfig,
  NetworkError,
  NetworkEndpointError,
  GeneralError,
  UnexpectedError,
} from 'react-native-moyasar-sdk';

const TEST_KEY = process.env.EXPO_PUBLIC_MOYASAR_TEST_KEY || '';
const PROD_KEY = process.env.EXPO_PUBLIC_MOYASAR_LIVE_KEY || '';

export const isMoyasarTestMode = process.env.NODE_ENV !== 'production' && !PROD_KEY;
export const moyasarPublicKey = isMoyasarTestMode ? TEST_KEY : PROD_KEY;

export function createMoyasarPaymentConfig({
  amountInHalalas,
  currency = 'SAR',
  merchantCountryCode = 'SA',
  description = 'CarCom Payment',
  metadata = {},
  givenId,
  supportedNetworks = ['mada', 'visa', 'mastercard', 'amex'],
  creditCardConfig,
  applePayConfig,
  samsungPayConfig,
}: {
  amountInHalalas: number;
  currency?: string;
  merchantCountryCode?: string;
  description?: string;
  metadata?: Record<string, string>;
  givenId?: string;
  supportedNetworks?: string[];
  creditCardConfig?: CreditCardConfig;
  applePayConfig?: ApplePayConfig;
  samsungPayConfig?: SamsungPayConfig;
}) {
  return new PaymentConfig({
    publishableApiKey: moyasarPublicKey,
    amount: amountInHalalas,
    currency,
    merchantCountryCode,
    description,
    metadata,
    givenId,
    supportedNetworks,
    creditCard: creditCardConfig,
    applePay: applePayConfig,
    samsungPay: samsungPayConfig,
  });
}

export function parseMoyasarResult(paymentResult: PaymentResult) {
  if (paymentResult instanceof PaymentResponse) {
    switch (paymentResult.status) {
      case PaymentStatus.paid:
        return { success: true, data: paymentResult };
      case PaymentStatus.failed:
        return { success: false, data: paymentResult };
      default:
        return { success: false, data: paymentResult };
    }
  } else if (paymentResult instanceof NetworkError) {
    return { success: false, error: { type: 'network', message: paymentResult.message } };
  } else if (paymentResult instanceof NetworkEndpointError) {
    return { success: false, error: { type: 'endpoint', message: paymentResult.message } };
  } else if (paymentResult instanceof GeneralError) {
    return { success: false, error: { type: 'general', message: paymentResult.message } };
  } else if (paymentResult instanceof UnexpectedError) {
    return { success: false, error: { type: 'unexpected', message: paymentResult.message } };
  }
  return { success: false, error: { type: 'unknown' } };
}

export function isMoyasarKeyValid(): boolean {
  return Boolean(moyasarPublicKey && (moyasarPublicKey.startsWith('pk_test_') || moyasarPublicKey.startsWith('pk_live_')));
}

export const formatAmountForMoyasar = (amountInRiyals: number): number => {
  return Math.round(amountInRiyals * 100);
};

export const formatAmountFromMoyasar = (amountInHalalas: number): number => {
  return Math.round(amountInHalalas / 100);
};

export const PAYMENT_METHODS = {
  APPLE_PAY: {
    id: 'apple_pay',
    labelAr: 'Apple Pay',
    labelEn: 'Apple Pay',
    enabled: true,
  },
  CREDIT_CARD: {
    id: 'credit_card',
    labelAr: 'بطاقة ائتمان / مدى',
    labelEn: 'Credit Card / mada',
    enabled: true,
  },
  STC_PAY: {
    id: 'stc_pay',
    labelAr: 'STC Pay',
    labelEn: 'STC Pay',
    enabled: true,
  },
  SAMSUNG_PAY: {
    id: 'samsung_pay',
    labelAr: 'Samsung Pay',
    labelEn: 'Samsung Pay',
    enabled: false,
  },
};
