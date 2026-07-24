/**
 * Explorer — RecyGo CI
 *
 * Écran d'exploration des fonctionnalités et ressources RecyGo :
 * - En-tête vert foncé : titre "Explorer" + avatar
 * - Carte bannière "Objectif IA"
 * - Grille de 4 cartes d'accès rapide : Scanner, Collecte, Portefeuille, Notifications
 * - Section "Ressources" avec 3 articles
 * - Barre de navigation inférieure
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

// ─── Constantes de design ───────────────────────────────────────────
const GREEN_DARK = '#0F5C34';
const GREEN_MID = '#1E7A46';
const GREEN_CTA = '#2ECC71';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_GRAY = '#6B7280';
const BG_LIGHT = '#F8FAFC';

// ─── Données ────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: '📷', label: 'Scanner', route: '/camera', color: GREEN_CTA, bg: '#E9F8EF' },
  { icon: '🚛', label: 'Demander\nune collecte', route: '/(citizen)/new-request', color: '#3B82F6', bg: '#EFF6FF' },
  { icon: '👛', label: 'Portefeuille', route: '/(tabs)/wallet', color: '#EAB308', bg: '#FEFCE8' },
  { icon: '🔔', label: 'Notifications', route: '/(citizen)/notifications', color: '#EF4444', bg: '#FEF2F2' },
];

const RESOURCES = [
  { icon: '📖', title: 'Guide du recyclage', subtitle: 'Apprenez à trier vos déchets', color: '#3B82F6' },
  { icon: '🏆', title: 'Programme de récompenses', subtitle: 'Gagnez des points en recyclant', color: GREEN_CTA },
  { icon: '📍', title: 'Recycleurs à proximité', subtitle: 'Trouvez le centre le plus proche', color: '#8B5CF6' },
];

// ─── Composant d'animation ──────────────────────────────────────────
function AnimatedView({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(20)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      RNAnimated.spring(translateY, { toValue: 0, friction: 8, tension: 60, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return <RNAnimated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</RNAnimated.View>;
}

// ─── Écran Explorer ─────────────────────────────────────────────────
export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useApp();
  const insets = useSafeAreaInsets();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AK'
    : 'AK';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ─── En-tête vert foncé ──────────────────────────────────── */}
        <View style={styles.header}>
          <AnimatedView delay={0} style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>Explorer</Text>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </AnimatedView>

          {/* Carte bannière Objectif IA */}
          <AnimatedView delay={100}>
            <View style={styles.bannerCard}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Objectif IA</Text>
                <Text style={styles.bannerSubtitle}>Scanne un déchet pour obtenir son estimation</Text>
                <Pressable
                  onPress={() => router.push('/camera')}
                  style={styles.bannerBtn}
                >
                  <Text style={styles.bannerBtnText}>Scanner maintenant</Text>
                </Pressable>
              </View>
              <Text style={styles.bannerEmoji}>🤖</Text>
            </View>
          </AnimatedView>
        </View>

        {/* ─── Corps blanc ─────────────────────────────────────────── */}
        <View style={styles.body}>
          {/* Grille d'accès rapide */}
          <AnimatedView delay={150}>
            <Text style={styles.sectionTitle}>Accès rapide</Text>
            <View style={styles.quickGrid}>
              {QUICK_ACTIONS.map((action, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => router.push(action.route as any)}
                  style={[styles.quickGridItem, { backgroundColor: action.bg }]}
                >
                  <Text style={styles.quickGridIcon}>{action.icon}</Text>
                  <Text style={styles.quickGridLabel}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          </AnimatedView>

          {/* Ressources */}
          <AnimatedView delay={200}>
            <Text style={styles.sectionTitle}>Ressources</Text>
            <View style={styles.resourcesList}>
              {RESOURCES.map((resource, idx) => (
                <View key={idx} style={styles.resourceCard}>
                  <View style={[styles.resourceIconBox, { backgroundColor: resource.color + '15' }]}>
                    <Text style={styles.resourceIcon}>{resource.icon}</Text>
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceSubtitle}>{resource.subtitle}</Text>
                  </View>
                  <Text style={styles.resourceArrow}>›</Text>
                </View>
              ))}
            </View>
          </AnimatedView>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREEN_MID,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── En-tête ──
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: WHITE,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: WHITE,
  },

  // ── Bannière ──
  bannerCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: TEXT_GRAY,
    marginBottom: 12,
    lineHeight: 16,
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    backgroundColor: GREEN_CTA,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  bannerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: WHITE,
  },
  bannerEmoji: {
    fontSize: 40,
  },

  // ── Corps ──
  body: {
    flex: 1,
    backgroundColor: BG_LIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // ── Section ──
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 14,
  },

  // ── Grille d'accès rapide ──
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  quickGridItem: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  quickGridIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickGridLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_DARK,
    textAlign: 'center',
    lineHeight: 14,
  },

  // ── Ressources ──
  resourcesList: {
    gap: 12,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  resourceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  resourceIcon: {
    fontSize: 18,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  resourceSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: TEXT_GRAY,
  },
  resourceArrow: {
    fontSize: 20,
    fontWeight: '300',
    color: '#CBD5E1',
  },
});
