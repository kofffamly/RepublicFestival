/**
 * Splash Screen — RecyGo CI
 *
 * Écran de démarrage avec :
 * - Fond en dégradé radial vert foncé (#0F5C34 → #1E7A46 → #2ECC71)
 * - Icône carrée blanche avec ♻️ vert
 * - Titre "RecyGo" blanc + "CI" jaune/orange côte à côte
 * - Sous-titre "LE RECYCLAGE, RÉINVENTÉ" en blanc, letter-spacing large
 * - 3 points de pagination animés (indicateurs de chargement)
 * - Texte "Chargement en cours..." en vert clair
 * - Navigation automatique vers l'onboarding après 4 secondes
 */

import { useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Animated as RNAnimated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Constantes de design ───────────────────────────────────────────
const GREEN_DARK = '#0F5C34';
const GREEN_MID = '#1E7A46';
const GREEN_BRIGHT = '#2ECC71';
const GOLD = '#F5A524';
const WHITE = '#FFFFFF';
const LIGHT_GREEN_TEXT = '#A7E8C4';

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animations des points de pagination
  const dot1 = useRef(new RNAnimated.Value(1)).current;
  const dot2 = useRef(new RNAnimated.Value(0.4)).current;
  const dot3 = useRef(new RNAnimated.Value(0.4)).current;

  // Animation de pulse du logo
  const logoScale = useRef(new RNAnimated.Value(1)).current;
  const logoOpacity = useRef(new RNAnimated.Value(0)).current;

  // Animation du titre (apparition)
  const titleOpacity = useRef(new RNAnimated.Value(0)).current;
  const titleTranslateY = useRef(new RNAnimated.Value(20)).current;

  // Animation du sous-titre
  const subtitleOpacity = useRef(new RNAnimated.Value(0)).current;

  // Animation de l'indicateur de chargement
  const loadingOpacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    // ── Séquence d'animation d'entrée ──
    const sequence = async () => {
      // 1. Logo apparaît avec scale
      RNAnimated.parallel([
        RNAnimated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        RNAnimated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // 2. Titre apparaît après un délai
      setTimeout(() => {
        RNAnimated.parallel([
          RNAnimated.timing(titleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          RNAnimated.timing(titleTranslateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, 400);

      // 3. Sous-titre apparaît
      setTimeout(() => {
        RNAnimated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 800);

      // 4. Indicateur de chargement apparaît
      setTimeout(() => {
        RNAnimated.timing(loadingOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1000);

      // 5. Démarre l'animation cyclique des points après 1.2s
      setTimeout(() => {
        animateDots();
      }, 1200);
    };

    // ── Animation cyclique des points de pagination ──
    const animateDots = () => {
      const cycle = () => {
        // Point 1 actif
        RNAnimated.parallel([
          RNAnimated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
          RNAnimated.timing(dot2, { toValue: 0.4, duration: 400, useNativeDriver: true }),
          RNAnimated.timing(dot3, { toValue: 0.4, duration: 400, useNativeDriver: true }),
        ]).start(() => {
          // Point 2 actif
          RNAnimated.parallel([
            RNAnimated.timing(dot1, { toValue: 0.4, duration: 400, useNativeDriver: true }),
            RNAnimated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
            RNAnimated.timing(dot3, { toValue: 0.4, duration: 400, useNativeDriver: true }),
          ]).start(() => {
            // Point 3 actif
            RNAnimated.parallel([
              RNAnimated.timing(dot1, { toValue: 0.4, duration: 400, useNativeDriver: true }),
              RNAnimated.timing(dot2, { toValue: 0.4, duration: 400, useNativeDriver: true }),
              RNAnimated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]).start(() => {
              cycle(); // Boucle infinie
            });
          });
        });
      };
      cycle();
    };

    sequence();

    // ── Navigation automatique après 4 secondes vers l'onboarding ──
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/step1' as any);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Fond dégradé radial (simulé avec LinearGradient du plus foncé au plus clair) */}
      <LinearGradient
        colors={[GREEN_DARK, GREEN_MID, GREEN_BRIGHT]}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Cercle décoratif lumineux au centre */}
        <View style={styles.glowCenter} />

        {/* ─── Logo ─────────────────────────────────────── */}
        <RNAnimated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoWhiteBox}>
            <Text style={styles.logoIcon}>♻️</Text>
          </View>
        </RNAnimated.View>

        {/* ─── Titre ─────────────────────────────────────── */}
        <RNAnimated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <View style={styles.titleRow}>
            <Text style={styles.titleRecygo}>RecyGo</Text>
            <Text style={styles.titleCi}>CI</Text>
          </View>
        </RNAnimated.View>

        {/* ─── Sous-titre ───────────────────────────────── */}
        <RNAnimated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
          <Text style={styles.subtitle}>LE RECYCLAGE, RÉINVENTÉ</Text>
        </RNAnimated.View>

        {/* ─── Indicateur de chargement (bas de l'écran) ── */}
        <RNAnimated.View
          style={[
            styles.loadingSection,
            { opacity: loadingOpacity, paddingBottom: insets.bottom + 20 },
          ]}
        >
          {/* Points de pagination */}
          <View style={styles.dotsRow}>
            <RNAnimated.View style={[styles.dot, { opacity: dot1 }]} />
            <RNAnimated.View style={[styles.dot, { opacity: dot2 }]} />
            <RNAnimated.View style={[styles.dot, { opacity: dot3 }]} />
          </View>

          {/* Texte de chargement */}
          <Text style={styles.loadingText}>Chargement en cours...</Text>
        </RNAnimated.View>
      </LinearGradient>

      {/* Status bar (simulée) - sans notch pour rester fullscreen */}
      <View style={[styles.statusBarOverlay, { top: insets.top }]}>
        <Text style={styles.statusBarTime} />
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREEN_DARK,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  glowCenter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    top: '35%',
    alignSelf: 'center',
  },

  // ── Logo ──
  logoContainer: {
    marginBottom: 24,
  },
  logoWhiteBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 32,
  },

  // ── Titre ──
  titleContainer: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleRecygo: {
    fontSize: 28,
    fontWeight: '900',
    color: WHITE,
    letterSpacing: -0.5,
  },
  titleCi: {
    fontSize: 28,
    fontWeight: '900',
    color: GOLD,
    letterSpacing: -0.5,
  },

  // ── Sous-titre ──
  subtitleContainer: {
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: WHITE,
    opacity: 0.9,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },

  // ── Indicateur de chargement ──
  loadingSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 40,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WHITE,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: LIGHT_GREEN_TEXT,
    textAlign: 'center',
  },

  // ── Status bar (optionnelle) ──
  statusBarOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  statusBarTime: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
});

