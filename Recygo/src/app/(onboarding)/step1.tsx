/**
 * Onboarding — Écran 1/3 : "Scannez vos déchets"
 *
 * Fond uni vert très clair menthe (#EAF7F0).
 * Icône carrée arrondie (110x110, radius 24px) fond vert pâle (#D8F0E4)
 * contenant une icône caméra en outline vert foncé (48px).
 * Titre "Scannez vos déchets" noir/gris très foncé, gras, 22px, centré.
 * Sous-titre gris (#6B7280) 14px centré sur 2 lignes.
 * Pagination : 3 points, 1er actif.
 * Bouton plein largeur "Continuer" vert (#2ECC71), pill, blanc gras.
 * Lien "Passer" orange/marron clair en dessous.
 */

import { useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const COLORS = {
  bg: '#EAF7F0',
  iconBg: '#D8F0E4',
  iconOutline: '#1E7A46',
  title: '#1A1A1A',
  subtitle: '#6B7280',
  dotActive: '#1E7A46',
  dotInactive: '#CBD5E1',
  button: '#2ECC71',
  buttonText: '#FFFFFF',
  skipColor: '#D97706',
};

function AnimatedContent({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 8, tension: 60, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export default function OnboardingStep1() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    router.push('/(onboarding)/step2');
  };

  const handleSkip = () => {
    router.replace('/(auth)/role-selection');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Icône */}
        <AnimatedContent delay={200}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconBox}>
              <Text style={styles.iconCamera}>📷</Text>
            </View>
          </View>
        </AnimatedContent>

        {/* Titre */}
        <AnimatedContent delay={400}>
          <Text style={styles.title}>Scannez vos déchets</Text>
        </AnimatedContent>

        {/* Sous-titre */}
        <AnimatedContent delay={500}>
          <Text style={styles.subtitle}>
            Photographiez n'importe quel déchet recyclable.{'\n'}Notre IA l'identifie en secondes et estime sa valeur.
          </Text>
        </AnimatedContent>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Pagination */}
        <AnimatedContent delay={600}>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </AnimatedContent>

        {/* Bouton Continuer */}
        <AnimatedContent delay={700}>
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <Text style={styles.buttonText}>Continuer</Text>
          </Pressable>
        </AnimatedContent>

        {/* Lien Passer */}
        <AnimatedContent delay={800}>
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Passer</Text>
          </Pressable>
        </AnimatedContent>
      </View>

      {/* Bottom safe area padding */}
      <View style={{ height: insets.bottom + 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrapper: {
    marginBottom: 32,
  },
  iconBox: {
    width: 110,
    height: 110,
    borderRadius: 24,
    backgroundColor: COLORS.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCamera: {
    fontSize: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.title,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.subtitle,
    textAlign: 'center',
    lineHeight: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.dotInactive,
  },
  dotActive: {
    backgroundColor: COLORS.dotActive,
    width: 24,
    borderRadius: 4,
  },
  button: {
    width: '100%',
    height: 52,
    borderRadius: 999,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.button,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.buttonText,
  },
  skipButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.skipColor,
  },
});

