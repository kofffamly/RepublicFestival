import { useRef, ReactNode } from 'react';
import { Animated, Pressable, ViewStyle, StyleProp } from 'react-native';

interface AnimatedPressableProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleIn?: number;
  scaleOut?: number;
  disabled?: boolean;
}

/**
 * Composant Pressable animé réutilisable — scale down au press, scale up au release
 *
 * Utilisation :
 * <AnimatedPressable onPress={handlePress}>
 *   <View><Text>Appuyez ici</Text></View>
 * </AnimatedPressable>
 */
export function AnimatedPressable({
  onPress,
  children,
  style,
  scaleIn = 0.96,
  scaleOut = 1,
  disabled = false,
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: scaleIn,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: scaleOut,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

