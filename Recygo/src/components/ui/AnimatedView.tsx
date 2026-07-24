import { useRef, useEffect, ReactNode } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

interface AnimatedViewProps {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  translateDistance?: number;
}

/**
 * Composant animé réutilisable — apparaît avec fade-in + slide-up
 *
 * Utilisation :
 * <AnimatedView delay={100}>
 *   <Text>Contenu animé</Text>
 * </AnimatedView>
 */
export function AnimatedView({
  children,
  delay = 0,
  style,
  duration = 400,
  translateDistance = 20,
}: AnimatedViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(translateDistance)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 60,
        delay,
        useNativeDriver: true,
      }),
    ]);
    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

