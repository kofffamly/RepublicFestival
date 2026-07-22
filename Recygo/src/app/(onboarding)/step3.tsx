/**
 * Onboarding — Écran 3/3 : "Gagnez des revenus"
 *
 * Fond blanc / bleu très pâle (#F5F8FF).
 * Icône carrée arrondie (110x110, radius 24px) fond bleu pâle (#DCE7FF)
 * contenant une icône "$" (dollar) en outline bleu (#3B82F6) (48px).
 * Titre "Gagnez des revenus" noir/gris très foncé, gras, 22px, centré.
 * Sous-titre gris (#6B7280) 14px centré sur 2 lignes.
 * Pagination : 3 points, 3ème actif (bleu/noir).
 * Bouton plein largeur vert, texte "Commencer" (au lieu de "Continuer").
 * Pas de lien "Passer" sur ce dernier écran.
 */

import { useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  bg: '#F5F8FF',
  iconBg: '#DCE7FF',
  iconOutline: '#3B82F6',
  title: '#1A1A1A',
  subtitle: '#6B7280',
  dotActive: '#3B82F6',
  dotInactive: '#CBD5E1',
  button: '#2ECC71',
  buttonText: '#FFFFFF',
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

export default function OnboardingStep3() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleStart = () => {
    router.replace('/(auth)/role-selection');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Icône */}
        <AnimatedContent delay={200}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconBox}>
              <Text style={styles.iconDollar}>💰</Text>
            </View>
          </View>
        </AnimatedContent>

        {/* Titre */}
        <AnimatedContent delay={400}>
          <Text style={styles.title}>Gagnez des revenus</Text>
        </AnimatedContent>

        {/* Sous-titre */}
        <AnimatedContent delay={500}>
          <Text style={styles.subtitle}>
            Recevez directement l'argent sur votre portefeuille{'\n'}RecyGo et contribuez à un avenir vert.
          </Text>
        </AnimatedContent>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Pagination */}
        <AnimatedContent delay={600}>
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
          </View>
        </AnimatedContent>

        {/* Bouton Commencer */}
        <AnimatedContent delay={700}>
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <Text style={styles.buttonText}>Commencer</Text>
          </Pressable>
        </AnimatedContent>

        {/* Pas de lien "Passer" sur ce dernier écran */}
        <View style={{ height: 40 }} />
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
  iconDollar: {
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
});

