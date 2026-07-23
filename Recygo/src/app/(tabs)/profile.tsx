/**
 * Profil Citoyen — RecyGo CI
 *
 * Écran de profil utilisateur avec :
 * - En-tête vert foncé (~35% hauteur) :
 *   - Titre "Profil" blanc centré
 *   - Avatar rond (72px) avec initiales "AK" en vert gras
 *   - Nom "Aya Kouassi" blanc (18px)
 *   - Email "aya.kouassi@example.com" vert clair (13px)
 *   - Badge pill "Membre depuis mai 2025"
 *   - 3 stats : Collectes (5), Recyclé (20 kg), Revenus (3 092 F)
 * - Corps blanc (radius haut arrondi) :
 *   - 6 lignes de menu avec icône carrée colorée + chevron
 *   - Déconnexion en rouge
 * - Barre de navigation inférieure avec onglet Profil actif
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
const RED = '#EF4444';

// ─── Données des menus ──────────────────────────────────────────────
const MENU_ITEMS = [
  { icon: '👤', label: 'Mes informations', bg: '#EFF6FF' },
  { icon: '🔔', label: 'Notifications', bg: '#FFF7ED' },
  { icon: '🛡️', label: 'Sécurité & confidentialité', bg: '#F0FDF4' },
  { icon: '❓', label: "Centre d'aide", bg: '#F5F3FF' },
  { icon: '⚙️', label: 'Paramètres', bg: '#F3F4F6' },
  { icon: '🚪', label: 'Déconnexion', bg: '#FEF2F2', isRed: true },
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
  const handlePressIn = () => RNAnimated.spring(scale, { toValue: 0.97, friction: 8, tension: 100, useNativeDriver: true }).start();
  const handlePressOut = () => RNAnimated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();

  return (
    <RNAnimated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {children}
      </Pressable>
    </RNAnimated.View>
  );
}

// ─── Écran de profil ────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useApp();
  const insets = useSafeAreaInsets();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AK'
    : 'AK';

  const displayName = user?.name || 'Aya Kouassi';
  const displayEmail = user?.phone
    ? `${user.name?.toLowerCase().replace(/\s/g, '.')}@example.com`
    : 'aya.kouassi@example.com';

  const handleMenuPress = (label: string) => {
    if (label === 'Déconnexion') {
      logout();
      router.replace('/splash' as any);
    }
    // Autres menus à implémenter
  };

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
          {/* Titre */}
          <AnimatedView delay={0} style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>Profil</Text>
          </AnimatedView>

          {/* Avatar */}
          <AnimatedView delay={100} style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{displayEmail}</Text>

            {/* Badge membre */}
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>Membre depuis mai 2025</Text>
            </View>
          </AnimatedView>

          {/* 3 stats */}
          <AnimatedView delay={150}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Collectes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>20 kg</Text>
                <Text style={styles.statLabel}>Recyclé</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3 092 F</Text>
                <Text style={styles.statLabel}>Revenus</Text>
              </View>
            </View>
          </AnimatedView>
        </View>

        {/* ─── Corps blanc ─────────────────────────────────────────── */}
        <View style={styles.body}>
          {/* Liste de menus */}
          <AnimatedView delay={200}>
            <View style={styles.menuCard}>
              {MENU_ITEMS.map((item, idx) => (
                <AnimatedPressable
                  key={idx}
                  onPress={() => handleMenuPress(item.label)}
                >
                  <View style={styles.menuItem}>
                    <View style={[styles.menuIconBox, { backgroundColor: item.bg }]}>
                      <Text style={styles.menuIcon}>{item.icon}</Text>
                    </View>
                    <Text
                      style={[
                        styles.menuLabel,
                        item.isRed && { color: RED },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text style={styles.menuChevron}>›</Text>
                  </View>
                  {idx < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
                </AnimatedPressable>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTopRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: WHITE,
  },

  // ── Avatar ──
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: GREEN_CTA,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: WHITE,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 10,
  },

  // ── Badge ──
  badgePill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: WHITE,
    opacity: 0.9,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
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

  // ── Menu ──
  menuCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuIcon: {
    fontSize: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  menuChevron: {
    fontSize: 20,
    fontWeight: '300',
    color: '#CBD5E1',
    marginLeft: 8,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 66,
  },
});

