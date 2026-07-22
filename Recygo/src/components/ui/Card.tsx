import { View, StyleSheet, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ variant = 'default', style, children, ...props }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});

