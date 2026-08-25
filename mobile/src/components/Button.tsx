import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  style,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return { bg: colors.secondary, text: '#FFFFFF' };
      case 'accent':
        return { bg: colors.accent, text: '#FFFFFF' };
      case 'danger':
        return { bg: colors.danger, text: '#FFFFFF' };
      case 'outline':
        return { bg: 'transparent', text: colors.textPrimary, border: colors.surfaceBorder };
      default:
        return { bg: colors.primary, text: '#FFFFFF' };
    }
  };

  const v = getVariantStyle();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? colors.surfaceBorder : v.bg },
        v.border ? { borderWidth: 1, borderColor: v.border } : null,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      {icon}
      <Text style={[styles.text, { color: disabled ? colors.textSecondary : v.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
