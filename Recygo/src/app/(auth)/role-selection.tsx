/**
 * Choix du profil — "Qui êtes-vous ?"
 *
 * Bandeau supérieur (~30% hauteur) dégradé vert foncé, bord inférieur arrondi.
 * Titre "Qui êtes-vous ? 🌍" blanc + sous-titre blanc/vert clair.
 * Sous le bandeau, deux grandes cartes empilées verticalement :
 *   - Carte "Citoyen" : fond vert pâle (#E9F8EF), icône carrée verte pleine (#2ECC71) maison blanche,
 *     titre noir, description grise, lien "Choisir →" vert gras.
 *   - Carte "Recycleur Pro" : fond jaune/crème pâle (#FDF3DD), icône carrée orange pleine camion blanc,
 *     titre noir, description grise, lien "Choisir →" orange gras.
 * Navigation: Citoyen → /register?role=citizen, Pro → /register?role=pro
 */

import { useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated as RNAnimated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

// ─── Constantes de design ───────────────────────────────────────────
const GREEN_DARK = '#0F5C34';
const GREEN_MID = '#1E7A46';
const GREEN_BRIGHT = '#2ECC71';
const GREEN_CTA = '#2ECC71';
const ORANGE = '#EA8A2E';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#6B7280';
const CARD_CITIZEN_BG = '#E9F8EF';
const CARD_PRO_BG = '#FDF3DD';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 20;
const CARD_WIDTH = width - CARD_MARGIN * 2;

// ─── Composant d'animation réutilisable ─────────────────────────────
function AnimatedView({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(30)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      RNAnimated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 60,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <RNAnimated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </RNAnimated.View>
  );
}

// ─── Carte de rôle ──────────────────────────────────────────────────
interface RoleCardProps {
  type: 'citizen' | 'pro';
  icon: string;
  title: string;
  description: string;
  onChoose: () => void;
  delay: number;
}

function RoleCard({ type, icon, title, description, onChoose, delay }: RoleCardProps) {
  const isCitizen = type === 'citizen';
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;

  const handlePressIn = () => {
    RNAnimated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    RNAnimated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  return (
    <RNAnimated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onChoose}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <AnimatedView delay={delay}>
          <View
            style={[
              styles.card,
              { backgroundColor: isCitizen ? CARD_CITIZEN_BG : CARD_PRO_BG },
            ]}
          >
            {/* Haut de carte : icône + titre */}
            <View style={styles.cardTop}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: isCitizen ? GREEN_CTA : ORANGE },
                ]}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </View>
              <View style={styles.cardTitleArea}>
                <Text style={styles.cardTitle}>{title}</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.cardDescription}>{description}</Text>

            {/* Lien Choisir */}
            <View style={styles.cardFooter}>
              <Text
                style={[
                  styles.chooseLink,
                  { color: isCitizen ? GREEN_MID : ORANGE },
                ]}
              >
                Choisir →
              </Text>
            </View>
          </View>
        </AnimatedView>
      </Pressable>
    </RNAnimated.View>
  );
}

// ─── Écran principal ────────────────────────────────────────────────
export default function RoleSelection() {
  const router = useRouter();
  const { setRole } = useApp();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const handleChooseCitizen = () => {
    setRole('citizen');
    router.push('/(auth)/register?role=citizen');
  };

  const handleChoosePro = () => {
    setRole('pro');
    router.push('/(auth)/register?role=pro');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ─── Bandeau supérieur dégradé ───────────────────────────── */}
        <View style={[styles.headerBanner, { paddingTop: insets.top + 16 }]}>
          {/* Dégradé visuel (simulé avec overlay) */}
          <View style={styles.gradientOverlay} />

          {/* Bouton retour */}
          <AnimatedView delay={0} style={styles.backRow}>
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
          </AnimatedView>

          {/* Contenu du bandeau */}
          <AnimatedView delay={100} style={styles.headerContent}>
            <View style={styles.headerLogo}>
              <Text style={styles.headerLogoText}>♻️</Text>
            </View>
            <Text style={styles.headerTitle}>Qui êtes-vous ? 🌍</Text>
            <Text style={styles.headerSubtitle}>
              Choisissez votre profil pour commencer
            </Text>
          </AnimatedView>
        </View>

        {/* ─── Zone des cartes (remonte sur le bandeau) ──────────── */}
        <View style={styles.cardsSection}>
          {/* Carte Citoyen */}
          <RoleCard
            type="citizen"
            icon="🏠"
            title="Citoyen"
            description="J'ai des déchets à recycler et je veux gagner de l'argent"
            onChoose={handleChooseCitizen}
            delay={250}
          />

          {/* Carte Recycleur Pro */}
          <RoleCard
            type="pro"
            icon="🚛"
            title="Recycleur Pro"
            description="Je collecte et revends les déchets recyclables"
            onChoose={handleChoosePro}
            delay={400}
          />

          {/* Espace en bas */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── Bandeau supérieur ──
  headerBanner: {
    height: 280,
    backgroundColor: GREEN_MID,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GREEN_DARK,
    opacity: 0.3,
  },

  // ── Bouton retour ──
  backRow: {
    alignSelf: 'flex-start',
    zIndex: 10,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  backArrow: {
    fontSize: 20,
    color: WHITE,
    fontWeight: '700',
  },

  // ── Contenu du bandeau ──
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 20,
  },
  headerLogo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerLogoText: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: WHITE,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  // ── Zone des cartes ──
  cardsSection: {
    flex: 1,
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 24,
    gap: 20,
  },

  // ── Carte ──
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconText: {
    fontSize: 24,
    color: WHITE,
  },
  cardTitleArea: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  cardDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: TEXT_GRAY,
    lineHeight: 18,
    marginBottom: 16,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  chooseLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

