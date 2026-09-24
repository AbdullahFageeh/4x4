import en from '../src/i18n/locales/en.json';
import ar from '../src/i18n/locales/ar.json';

function flattenKeys(obj: Record<string, any>, prefix = ''): string[] {
  return Object.entries(obj).reduce<string[]>((acc, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return [...acc, fullKey, ...flattenKeys(value, fullKey)];
    }
    return [...acc, fullKey];
  }, []);
}

describe('i18n key parity', () => {
  it('English and Arabic have identical key structures', () => {
    const enKeys = flattenKeys(en).sort();
    const arKeys = flattenKeys(ar).sort();

    const missingInAr = enKeys.filter((k) => !arKeys.includes(k));
    const missingInEn = arKeys.filter((k) => !enKeys.includes(k));

    if (missingInAr.length > 0) {
      console.error('Missing in Arabic:', missingInAr);
    }
    if (missingInEn.length > 0) {
      console.error('Missing in English:', missingInEn);
    }

    expect(missingInAr).toEqual([]);
    expect(missingInEn).toEqual([]);
  });

  it('onboarding.subtitle is translated in Arabic', () => {
    expect(ar.onboarding.subtitle).not.toBe(en.onboarding.subtitle);
    expect(ar.onboarding.subtitle).not.toContain('Find your car crew');
  });

  it('onboarding.demo and comingSoon exist in both locales', () => {
    expect(en.onboarding.demo).toBeDefined();
    expect(ar.onboarding.demo).toBeDefined();
    expect(en.onboarding.comingSoon).toBeDefined();
    expect(ar.onboarding.comingSoon).toBeDefined();
  });

  it('trip.leave exists in both locales', () => {
    expect(en.trip.leave).toBeDefined();
    expect(ar.trip.leave).toBeDefined();
  });
});
