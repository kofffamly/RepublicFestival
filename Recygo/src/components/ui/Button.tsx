import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';

import { COLORS, RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const SIZE_CONFIG: Record<ButtonSize, { paddingVertical: number; fontSize: number; height: number }> = {
  sm: { paddingVertical: 8, fontSize: FONT_SIZE.sm, height: 36 },
  md: { paddingVertical: 12, fontSize: FONT_SIZE.md, height: 48 },
  lg: { paddingVertical: 16, fontSize: FONT_SIZE.lg, height: 52 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  fullWidth = true,
}: ButtonProps) {
  const config = SIZE_CONFIG[size];

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.full,
      height: config.height,
      paddingVertical: config.paddingVertical,
      paddingHorizontal: 20,
      opacity: disabled ? 0.5 : 1,
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: COLORS.greenCta,
          ...SHADOWS.md,
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.borderLight,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.greenCta,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontSize: config.fontSize,
      fontWeight: FONT_WEIGHT.bold,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
        return { ...base, color: COLORS.white };
      case 'secondary':
        return { ...base, color: COLORS.textDark };
      case 'outline':
      case 'ghost':
        return { ...base, color: COLORS.greenCta };
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={variant === 'primary' ? COLORS.white : COLORS.greenCta} />;
    }

    const iconElement = icon ? <>{icon}{' '}</> : null;

    return (
      <>
        {icon && iconPosition === 'left' && iconElement}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        {icon && iconPosition === 'right' && iconElement}
      </>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        getContainerStyle(),
        { width: fullWidth ? '100%' : 'auto' },
        pressed && !disabled && !loading ? { opacity: 0.85 } : {},
        style,
      ]}
      android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
    >
      {renderContent()}
    </Pressable>
  );
}
