/**
 * Accueil Citoyen — Dashboard
 *
 * Écran d'accueil pour le profil "Citoyen" avec :
 * - En-tête vert foncé (~30% hauteur) :
 *   - "Bonjour Aya" + cloche notifications + avatar "AK"
 *   - 3 mini-cartes stats : CO2 évité (42kg), Recyclé (20kg), Revenus (3 092 F)
 * - Corps blanc qui remonte sur l'en-tête (radius haut 24px) :
 *   - Grande carte "Scanner un déchet" (icône caméra, titre, flèche)
 *   - 3 boutons accès rapide (Mes collectes, Recycleurs proches, Portefeuille)
 *   - "Recycleurs à proximité" horizontal scroll
 *   - "Collectes récentes"
 * - Barre navigation inférieure (5 items, bouton central flottant scanner)
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
const GREEN_CTA = '#2ECC71';
const GREEN_LIGHT = '#22C55E';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_GRAY = '#6B7280';
const BG_LIGHT = '#F8FAFC';
const CARD_BG = '#FFFFFF';

const { width } = Dimensions.get('window');
const STAT_CARD_WIDTH = (width - 48 - 16) / 3;

// ─── Données mock ───────────────────────────────────────────────────
const STATS = [
  { icon: '🌿', label: 'CO2 évité', value: '42 kg', bg: 'rgba(255,255,255,0.15)' },
  { icon: '♻️', label: 'Recyclé', value: '20 kg', bg: 'rgba(255,255,255,0.15)' },
  { icon: '💰', label: 'Revenus', value: '3 092 F', bg: 'rgba(255,255,255,0.15)' },
];

const QUICK_ACTIONS = [
  { icon: '📦', label: 'Mes collectes', color: '#3B82F6', bg: '#EFF6FF' },
  { icon: '📍', label: 'Recycleurs\nproches', color: '#8B5CF6', bg: '#F5F3FF' },
  { icon: '👛', label: 'Portefeuille', color: '#EAB308', bg: '#FEFCE8' },
];

const RECYCLERS = [
  { initials: 'IC', name: 'Ivoire Cycle', category: 'Plastiques & Métal', rating: '4.9', distance: '0.8 km', color: '#3B82F6' },
  { initials: 'FT', name: 'Faso Tri', category: 'Carton & Papier', rating: '4.7', distance: '1.2 km', color: '#8B5CF6' },
  { initials: 'Ec', name: 'EcoCôte', category: 'Déchets ménagers', rating: '4.8', distance: '2.1 km', color: '#F5A524' },
  { initials: 'GR', name: 'Green Rafraîchir', category: 'Verre & Métal', rating: '4.6', distance: '3.0 km', color: '#2ECC71' },
];

const RECENT_COLLECTIONS = [
  { id: '1', type: '🧴', label: 'Bouteilles plastique', weight: '2 kg', amount: '600 F', date: 'Aujourd\'hui', status: 'Terminée' },
  { id: '2', type: '📦', label: 'Cartons usagés', weight: '5 kg', amount: '250 F', date: 'Hier', status: 'Terminée' },
  { id: '3', type: '🥫', label: 'Canettes aluminium', weight: '1.5 kg', amount: '1 200 F', date: 'Cette semaine', status: 'En cours' },
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

// ─── Composant d'animation Pressable ────────────────────────────────
function AnimatedPressable({ onPress, children, style }: { onPress?: () => void; children: React.ReactNode; style?: any }) {
  const scale = useRef(new RNAnimated.Value(1)).current;
  const handlePressIn = () => RNAnimated.spring(scale, { toValue: 0.96, friction: 8, tension: 100, useNativeDriver: true }).start();
  const handlePressOut = () => RNAnimated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();

  return (
    <RNAnimated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {children}
      </Pressable>
    </RNAnimated.View>
  );
}

// ─── Composant Carte Recycleur ──────────────────────────────────────
function RecyclerCard({ item }: { item: typeof RECYCLERS[0] }) {
  return (
    <View style={styles.recyclerCard}>
      <View style={[styles.recyclerAvatar, { backgroundColor: item.color + '20' }]}>
        <Text style={[styles.recyclerInitials, { color: item.color }]}>{item.initials}</Text>
      </View>
      <Text style={styles.recyclerName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.recyclerCategory} numberOfLines={1}>{item.category}</Text>
      <View style={styles.recyclerFooter}>
        <Text style={styles.recyclerRating}>⭐ {item.rating}</Text>
        <Text style={styles.recyclerDistance}>{item.distance}</Text>
      </View>
    </View>
  );
}

// ─── Composant Carte Collecte ──────────────────────────────────────
function CollectionCard({ item }: { item: typeof RECENT_COLLECTIONS[0] }) {
  const isCompleted = item.status === 'Terminée';
  return (
    <View style={styles.collectionCard}>
      <View style={styles.collectionLeft}>
        <Text style={styles.collectionIcon}>{item.type}</Text>
        <View style={styles.collectionInfo}>
          <Text style={styles.collectionLabel}>{item.label}</Text>
          <Text style={styles.collectionDate}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.collectionRight}>
        <Text style={styles.collectionAmount}>{item.amount}</Text>
        <View style={[styles.statusBadge, { backgroundColor: isCompleted ? '#DCFCE7' : '#FEF9C3' }]}>
          <Text style={[styles.statusText, { color: isCompleted ? '#16A34A' : '#CA8A04' }]}>{item.status}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Écran principal ────────────────────────────────────────────────
export default function CitizenHome() {
  const router = useRouter();
  const { user } = useApp();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  // Initiales de l'utilisateur
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AK'
    : 'AK';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ─── En-tête vert foncé ──────────────────────────────────── */}
        <View style={styles.header}>
          {/* Ligne du haut : Bonjour + cloche + avatar */}
          <AnimatedView delay={0} style={styles.headerTopRow}>
            <View style={styles.headerGreeting}>
              <Text style={styles.greetingSmall}>Bonjour</Text>
              <Text style={styles.userName}>{user?.name || 'Aya Kouassi'}</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable onPress={() => router.push('/(citizen)/notifications')} style={styles.notifBell}>
                <Text style={styles.notifIcon}>🔔</Text>
                <View style={styles.notifDot} />
              </Pressable>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>
          </AnimatedView>

          {/* 3 mini-cartes stats */}
          <AnimatedView delay={100} style={styles.statsRow}>
            {STATS.map((stat, idx) => (
              <View key={idx} style={[styles.statCard, { backgroundColor: stat.bg }]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </AnimatedView>
        </View>

        {/* ─── Corps blanc ─────────────────────────────────────────── */}
        <View style={styles.body}>
          {/* Carte Scanner */}
          <AnimatedView delay={150}>
            <AnimatedPressable onPress={() => router.push('/camera')}>
              <View style={styles.scannerCard}>
                <View style={styles.scannerCardLeft}>
                  <View style={styles.scannerIconBox}>
                    <Text style={styles.scannerIcon}>📷</Text>
                  </View>
                  <View style={styles.scannerTextSection}>
                    <Text style={styles.scannerTitle}>Scanner un déchet</Text>
                    <Text style={styles.scannerSubtitle}>
                      Identifiez et estimez la valeur de vos déchets
                    </Text>
                  </View>
                </View>
                <Text style={styles.scannerArrow}>→</Text>
              </View>
            </AnimatedPressable>
          </AnimatedView>

          {/* 3 boutons accès rapide */}
          <AnimatedView delay={200}>
            <View style={styles.quickActionsRow}>
              {QUICK_ACTIONS.map((action, idx) => (
                <AnimatedPressable key={idx}>
                  <View style={[styles.quickActionCard, { backgroundColor: action.bg }]}>
                    <View style={[styles.quickActionIconBox, { backgroundColor: action.color + '20' }]}>
                      <Text style={styles.quickActionIcon}>{action.icon}</Text>
                    </View>
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                  </View>
                </AnimatedPressable>
              ))}
            </View>
          </AnimatedView>

          {/* Recycleurs à proximité */}
          <AnimatedView delay={250}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recycleurs à proximité</Text>
              <Pressable>
                <Text style={styles.seeAllLink}>Voir tout</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recyclersScroll}
              style={styles.recyclersContainer}
            >
              {RECYCLERS.map((item, idx) => (
                <RecyclerCard key={idx} item={item} />
              ))}
            </ScrollView>
          </AnimatedView>

          {/* Collectes récentes */}
          <AnimatedView delay={300}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Collectes récentes</Text>
              <Pressable>
                <Text style={styles.seeAllLink}>Historique</Text>
              </Pressable>
            </View>
            <View style={styles.collectionsList}>
              {RECENT_COLLECTIONS.map((item) => (
                <CollectionCard key={item.id} item={item} />
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
  headerGreeting: {},
  greetingSmall: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: WHITE,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notifBell: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: 16,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: GREEN_MID,
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

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: WHITE,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 2,
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

  // ── Carte Scanner ──
  scannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  scannerCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scannerIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: GREEN_CTA,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  scannerIcon: {
    fontSize: 24,
    color: WHITE,
  },
  scannerTextSection: {
    flex: 1,
  },
  scannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  scannerSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: TEXT_GRAY,
    lineHeight: 16,
  },
  scannerArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: GREEN_CTA,
    marginLeft: 8,
  },

  // ── Actions rapides ──
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  quickActionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionIcon: {
    fontSize: 18,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_DARK,
    textAlign: 'center',
    lineHeight: 14,
  },

  // ── Section Header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: '600',
    color: GREEN_CTA,
  },

  // ── Recycleurs ──
  recyclersContainer: {
    marginBottom: 24,
  },
  recyclersScroll: {
    gap: 12,
    paddingRight: 20,
  },
  recyclerCard: {
    width: 140,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  recyclerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recyclerInitials: {
    fontSize: 14,
    fontWeight: '700',
  },
  recyclerName: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  recyclerCategory: {
    fontSize: 10,
    fontWeight: '400',
    color: TEXT_GRAY,
    marginBottom: 8,
  },
  recyclerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recyclerRating: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  recyclerDistance: {
    fontSize: 10,
    fontWeight: '500',
    color: TEXT_GRAY,
  },

  // ── Collections ──
  collectionsList: {
    gap: 10,
    marginBottom: 24,
  },
  collectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  collectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  collectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  collectionDate: {
    fontSize: 11,
    fontWeight: '400',
    color: TEXT_GRAY,
    marginTop: 2,
  },
  collectionRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  collectionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: GREEN_CTA,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

