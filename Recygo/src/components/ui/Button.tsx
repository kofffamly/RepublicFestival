import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, PressableStateCallbackType, StyleProp } from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

const COLORS = {
  green: '#2ECC71',
  charcoal: '#2C3E50',
  orange: '#E67E22',
  white: '#FFFFFF',
};

const VARIANT_STYLES = {
  primary: {
    bg: COLORS.orange,
    text: COLORS.white,
    shadow: COLORS.orange,
    pressedBg: '#D35400',
  },
  secondary: {
    bg: COLORS.green,
    text: COLORS.white,
    shadow: COLORS.green,
    pressedBg: '#27AE60',
  },
  outline: {
    bg: 'transparent',
    text: COLORS.charcoal,
    shadow: 'transparent',
    pressedBg: '#F8F9FA',
  },
  ghost: {
    bg: 'transparent',
    text: COLORS.charcoal,
    shadow: 'transparent',
    pressedBg: '#F1F5F9',
  },
  danger: {
    bg: '#FEF2F2',
    text: '#EF4444',
    shadow: 'transparent',
    pressedBg: '#FEE2E2',
  },
};

const SIZE_STYLES = {
  sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 12 },
  md: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 14 },
  lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 16 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const config = VARIANT_STYLES[variant];
  const sizeConfig = SIZE_STYLES[size];
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const getStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      gap: 8,
      backgroundColor: pressed ? config.pressedBg : config.bg,
      paddingVertical: sizeConfig.paddingVertical,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      opacity: disabled || loading ? 0.5 : 1,
    },
    isOutline && {
      borderWidth: 2,
      borderColor: '#E2E8F0',
    } as ViewStyle,
    !isOutline && !isGhost && {
      shadowColor: config.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 18,
      elevation: 6,
    } as ViewStyle,
    style,
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={getStyle}
    >
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? COLORS.charcoal : COLORS.white} />
      ) : (
        <>
          {icon && <Text style={{ fontSize: 18 }}>{icon}</Text>}
          <Text
            style={{
              fontSize: sizeConfig.fontSize,
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: config.text,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

