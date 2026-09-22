import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { lightTheme, darkTheme } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  size = 'md',
}) => {
  const { isDark } = useAppStore();
  const theme = isDark ? darkTheme : lightTheme;

  const backgroundColor = {
    primary: theme.colors.primary,
    secondary: theme.colors.surface,
    ghost: 'transparent',
  }[variant];

  const textColor = {
    primary: theme.colors.onPrimary,
    secondary: theme.colors.primary,
    ghost: theme.colors.primary,
  }[variant];

  const borderColor = variant === 'secondary' ? theme.colors.primary : 'transparent';

  const paddingVertical = { sm: 8, md: 12, lg: 16 }[size];
  const paddingHorizontal = { sm: 16, md: 24, lg: 32 }[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? theme.colors.disabled : backgroundColor,
          borderColor,
          borderWidth: variant === 'secondary' ? 1 : 0,
          paddingVertical,
          paddingHorizontal,
        },
      ]}>
      <Text style={[styles.text, { color: textColor, fontSize: size === 'lg' ? 18 : 16 }]}>
        {loading ? '⏳' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
