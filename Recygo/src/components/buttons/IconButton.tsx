import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  size = 38,
  color = '#2C3E50',
  backgroundColor = '#F1F5F9',
  style,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.icon, { fontSize: size * 0.45 }]}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  icon: {
    lineHeight: undefined,
  },
});

