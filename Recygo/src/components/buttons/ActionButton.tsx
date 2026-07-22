import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';

interface ActionButtonProps {
  emoji: string;
  label: string;
  onPress?: () => void;
  color?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function ActionButton({
  emoji,
  label,
  onPress,
  color = '#EBF5FB',
  size = 'md',
  style,
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[size],
        { backgroundColor: color },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.emoji, size === 'sm' && styles.emojiSm]}>{emoji}</Text>
      <Text style={[styles.label, size === 'sm' && styles.labelSm]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: {
    width: '47%',
    padding: 20,
    flexGrow: 1,
  },
  sm: {
    padding: 14,
    minWidth: 80,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emojiSm: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C3E50',
  },
  labelSm: {
    fontSize: 11,
  },
});

