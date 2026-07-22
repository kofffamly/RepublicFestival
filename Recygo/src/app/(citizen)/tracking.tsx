/**
 * Suivi de collecte (Tracking temps réel) — RecyGo CI
 *
 * Écran de suivi de collecte en temps réel avec :
 * - En-tête vert foncé : flèche retour + "Suivi de collecte"
 * - Carte info recycleur (avatar initiales "IC", nom, note, bouton appel)
 * - Mini-carte avec trajet marqueur bleu → vert
 * - "En route · 12 min" en vert
 * - Timeline progression (5 étapes) avec icônes, titres, heures
 * - Barre navigation inférieure avec Scanner actif
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

// ─── Constantes de design ───────────────────────────────────────────
const GREEN_DARK = '#0F5C34';
const GREEN_MID = '#1E7A46';
const GREEN_CTA = '#2ECC71';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_GRAY = '#6B7280';
const BG_LIGHT = '#F8FAFC';

// ─── Données de la timeline ─────────────────────────────────────────
const TIMELINE_STEPS = [
  {
    id: 1,
    status: 'completed',
    icon: '✓',
    title: 'Demande envoyée',
    subtitle: 'Votre demande a été soumise',
    time: '09:41',
  },
  {
    id: 2,
    status: 'completed',
    icon: '✓',
    title: 'Recycleur trouvé',
    subtitle: 'Ibrahim Coulibaly accepte',
    time: '09:45',
  },
  {
    id: 3,
    status: 'active',
    icon: '●',
    title: 'En route vers vous',
    subtitle: 'Arrivée estimée dans 12 min',
    time: '10:02',
    isActive: true,
  },
  {
    id: 4,
    status: 'pending',
    icon: '○',
    title: 'Collecte effectuée',
    subtitle: 'Déchets récupérés et pesés',
    time: '--',
  },
  {
    id: 5,
    status: 'pending',
    icon: '○',
    title: 'Paiement reçu',
    subtitle: 'Montant versé sur votre portefeuille',
    time: '--',
  },
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

// ─── Élément de la timeline ─────────────────────────────────────────
function TimelineStep({ step, index }: { step: typeof TIMELINE_STEPS[0]; index: number }) {
  const isCompleted = step.status === 'completed';
  const isActive = step.status === 'active';
  const isPending = step.status === 'pending';

  return (
    <View style={styles.timelineItem}>
      {/* Colonne gauche : icône + ligne */}
      <View style={styles.timelineLeft}>
        <View
          style={[
            styles.timelineDot,
            isCompleted && styles.timelineDotCompleted,
            isActive && styles.timelineDotActive,
            isPending && styles.timelineDotPending,
          ]}
        >
          {isCompleted && <Text style={styles.timelineCheckIcon}>✓</Text>}
          {isActive && <View style={styles.timelinePulse} />}
        </View>
        {index < TIMELINE_STEPS.length - 1 && (
          <View
            style={[
              styles.timelineLine,
              isCompleted && styles.timelineLineCompleted,
            ]}
          />
        )}
      </View>

      {/* Colonne droite : titre + sous-titre */}
      <View style={styles.timelineRight}>
        <Text
          style={[
            styles.timelineTitle,
            isCompleted && styles.timelineTitleCompleted,
            isActive && styles.timelineTitleActive,
            isPending && styles.timelineTitlePending,
          ]}
        >
          {step.title}
        </Text>
        <Text style={styles.timelineSubtitle}>{step.subtitle}</Text>
      </View>

      {/* Heure */}
      <Text style={styles.timelineTime}>{step.time}</Text>
    </View>
  );
}

// ─── Écran Suivi de collecte ────────────────────────────────────────
export default function TrackingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ─── En-tête ──────────────────────────────────────────────── */}
        <View style={styles.header}>
          <AnimatedView delay={0} style={styles.headerTopRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Suivi de collecte</Text>
          </AnimatedView>
        </View>

        {/* ─── Corps ───────────────────────────────────────────────── */}
        <View style={styles.body}>
          {/* Carte recycleur */}
          <AnimatedView delay={100}>
            <View style={styles.recyclerCard}>
              <View style={styles.recyclerLeft}>
                <View style={styles.recyclerAvatar}>
                  <Text style={styles.recyclerInitials}>IC</Text>
                </View>
                <View style={styles.recyclerInfo}>
                  <Text style={styles.recyclerName}>Ibrahim Coulibaly</Text>
                  <View style={styles.recyclerBadgeRow}>
                    <Text style={styles.recyclerBadge}>Recycleur certifié</Text>
                    <Text style={styles.recyclerRating}>⭐ 4.8</Text>
                  </View>
                </View>
              </View>
              <Pressable style={styles.callBtn}>
                <Text style={styles.callIcon}>📞</Text>
              </Pressable>
            </View>
          </AnimatedView>

          {/* Mini-carte */}
          <AnimatedView delay={150}>
            <View style={styles.mapCard}>
              <View style={styles.mapVisual}>
                {/* Marqueur départ (bleu/camion) */}
                <View style={styles.mapMarkerStart}>
                  <Text style={styles.mapMarkerIcon}>🚛</Text>
                </View>
                {/* Ligne pointillée */}
                <View style={styles.mapDottedLine} />
                {/* Marqueur arrivée (vert/maison) */}
                <View style={styles.mapMarkerEnd}>
                  <Text style={styles.mapMarkerIcon}>🏠</Text>
                </View>
              </View>
              <View style={styles.mapStatusRow}>
                <Text style={styles.mapStatusIcon}>🚛</Text>
                <Text style={styles.mapStatusText}>En route · 12 min</Text>
              </View>
            </View>
          </AnimatedView>

          {/* Progression */}
          <AnimatedView delay={200}>
            <Text style={styles.sectionTitle}>Progression</Text>
            <View style={styles.timelineContainer}>
              {TIMELINE_STEPS.map((step, idx) => (
                <TimelineStep key={step.id} step={step} index={idx} />
              ))}
            </View>
          </AnimatedView>

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
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: WHITE,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: WHITE,
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

  // ── Carte recycleur ──
  recyclerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  recyclerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recyclerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  recyclerInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
  recyclerInfo: {
    flex: 1,
  },
  recyclerName: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  recyclerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recyclerBadge: {
    fontSize: 11,
    fontWeight: '500',
    color: TEXT_GRAY,
  },
  recyclerRating: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F5A524',
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GREEN_CTA,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  callIcon: {
    fontSize: 20,
  },

  // ── Mini-carte ──
  mapCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  mapVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  mapMarkerStart: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapMarkerEnd: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapMarkerIcon: {
    fontSize: 18,
  },
  mapDottedLine: {
    flex: 1,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: GREEN_CTA,
    marginHorizontal: 12,
    opacity: 0.5,
  },
  mapStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mapStatusIcon: {
    fontSize: 14,
  },
  mapStatusText: {
    fontSize: 13,
    fontWeight: '600',
    color: GREEN_CTA,
  },

  // ── Section ──
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 16,
  },

  // ── Timeline ──
  timelineContainer: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 64,
  },
  timelineLeft: {
    width: 28,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: GREEN_CTA,
  },
  timelineDotActive: {
    backgroundColor: GREEN_CTA,
    shadowColor: GREEN_CTA,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineDotPending: {
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  timelineCheckIcon: {
    fontSize: 12,
    color: WHITE,
    fontWeight: '700',
  },
  timelinePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WHITE,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    minHeight: 32,
    marginVertical: 2,
  },
  timelineLineCompleted: {
    backgroundColor: GREEN_CTA,
  },
  timelineRight: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timelineTitleCompleted: {
    color: TEXT_DARK,
    fontWeight: '700',
  },
  timelineTitleActive: {
    color: GREEN_CTA,
    fontWeight: '700',
  },
  timelineTitlePending: {
    color: '#9CA3AF',
  },
  timelineSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: TEXT_GRAY,
  },
  timelineTime: {
    fontSize: 11,
    fontWeight: '500',
    color: TEXT_GRAY,
    paddingTop: 2,
    minWidth: 36,
    textAlign: 'right',
  },
});

