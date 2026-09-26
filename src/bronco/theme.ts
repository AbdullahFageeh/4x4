// Ford Bronco edition theme — Bronco orange / desert palette
import { lightTheme } from '../theme';

export const broncoLight = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#C8440B', // Bronco orange
    primaryLight: '#E86A2C',
    accent: '#1D3557', // deep blue accent
    background: '#F7F4F0', // warm sand
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#6B6560',
    border: '#E3DDD5',
    divider: '#EEE8E0',
    card: '#FFFFFF',
    onPrimary: '#FFFFFF',
  },
};

export const broncoDark = {
  ...broncoLight,
  colors: {
    ...broncoLight.colors,
    primary: '#E86A2C',
    primaryLight: '#FF8A4D',
    accent: '#7FA8D9',
    background: '#141210',
    surface: '#1E1B18',
    text: '#EDE6DD',
    textMuted: '#9A9088',
    border: '#332E29',
    divider: '#2A2622',
    card: '#1E1B18',
    onPrimary: '#000000',
    onSuccess: '#000000',
  },
};

export type BroncoTheme = typeof broncoLight;