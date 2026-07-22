import { useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

function AnimatedPressable({ onPress, children, style }: { onPress?: () => void; children: React.ReactNode; style?: any }) {
  const scale = useRef(new RNAnimated.Value(1)).current;

  const handlePressIn = () => {
    RNAnimated.spring(scale, { toValue: 0.95, friction: 8, tension: 100, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    RNAnimated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();
  };

  return (
    <RNAnimated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {children}
      </Pressable>
    </RNAnimated.View>
  );
}

function SonarRing({ delay = 0 }: { delay?: number }) {
  const anim = useRef(new RNAnimated.Value(0.95)).current;
  const opacity = useRef(new RNAnimated.Value(0.55)).current;

  useEffect(() => {
    const start = () => {
      anim.setValue(0.95);
      opacity.setValue(0.55);
      RNAnimated.parallel([
        RNAnimated.timing(anim, { toValue: 1.45, duration: 2400, delay, useNativeDriver: true }),
        RNAnimated.timing(opacity, { toValue: 0, duration: 2400, delay, useNativeDriver: true }),
      ]).start(() => start());
    };
    start();
  }, []);

  return (
    <RNAnimated.View
      style={{
        position: 'absolute',
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: ORANGE,
        opacity,
        transform: [{ scale: anim }],
      }}
    />
  );
}

const IMPACT_STATS = [
  { label: 'Recyclé', value: '3 fois', color: '#3498db', bg: '#EBF5FB' },
  { label: 'Poids total', value: '12 kg', color: GREEN, bg: '#E8F8F5' },
  { label: 'Gains', value: '900 FCFA', color: ORANGE, bg: '#FEF5E7' },
];

const NAV_ITEMS = [
  { emoji: '📄', label: 'Mes Ventes', route: '/analyse', color: GREEN },
  { emoji: '📍', label: 'Collectes', route: '/camera', color: ORANGE },
  { emoji: '💳', label: 'Mon Argent', route: '/argent', color: '#9B59B6' },
];

export default function CitizenHome() {
  const { user, balance } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with green gradient simulation */}
        <View style={styles.header}>
          {/* Background decorative circles */}
          <View style={[styles.decoCircle, styles.decoCircle1]} />
          <View style={[styles.decoCircle, styles.decoCircle2]} />

          {/* Navigation bar */}
          <View style={styles.navBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <Text style={styles.brandEmoji}>♻️</Text>
              </View>
              <Text style={styles.brandName}>RecyGo</Text>
            </View>
            <View style={styles.navActions}>
              <AnimatedPressable>
                <View style={styles.navButton}>
                  <Text style={styles.navIcon}>🔔</Text>
                </View>
              </AnimatedPressable>
              <AnimatedPressable>
                <View style={styles.navButton}>
                  <Text style={styles.navIcon}>⚙️</Text>
                </View>
              </AnimatedPressable>
            </View>
          </View>

          {/* Welcome & Balance */}
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>

            {/* Balance card */}
            <View style={styles.balanceCard}>
              <View>
                <Text style={styles.balanceLabel}>Mon Solde mobile money</Text>
                <Text style={styles.balanceValue}>
                  {balance.toLocaleString()}{' '}
                  <Text style={styles.balanceUnit}>FCFA</Text>
                </Text>
              </View>
              <View style={styles.balanceArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Prêt à recycler ?</Text>
            <Text style={styles.ctaSubtitle}>Prends en photo tes bouteilles, cartons ou métaux</Text>
          </View>

          {/* Scanner Button with Sonar */}
          <View style={styles.scannerSection}>
            <SonarRing delay={0} />
            <SonarRing delay={800} />
            <SonarRing delay={1600} />
            <AnimatedPressable onPress={() => router.push('/camera' as any)}>
              <View style={styles.scannerButton}>
                <Text style={styles.scannerIcon}>📸</Text>
                <Text style={styles.scannerLabel}>Scanner</Text>
              </View>
            </AnimatedPressable>
          </View>

          {/* Info categories chip */}
          <View style={styles.infoChip}>
            <Text style={styles.infoChipText}>🔍 plastique · carton · métal · verre</Text>
          </View>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsHeaderIcon}>🏆</Text>
              <Text style={styles.statsHeaderLabel}>Mon Impact (Cette semaine)</Text>
            </View>
            <View style={styles.statsGrid}>
              {IMPACT_STATS.map((stat, i) => (
                <View key={i} style={[styles.statItem, { backgroundColor: stat.bg }]}>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Grid Navigation */}
          <View style={styles.bottomNav}>
            {NAV_ITEMS.map((item, i) => (
              <AnimatedPressable key={i} onPress={() => router.push(item.route as any)} style={styles.bottomNavItem}>
                <View style={[styles.navItemIcon, { backgroundColor: `${item.color}12` }]}>
                  <Text style={styles.navItemEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.navItemLabel}>{item.label}</Text>
              </AnimatedPressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F9',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: GREEN,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  decoCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    pointerEvents: 'none',
  },
  decoCircle1: {
    top: -30,
    right: -30,
    width: 112,
    height: 112,
  },
  decoCircle2: {
    bottom: -40,
    left: -20,
    width: 144,
    height: 144,
    backgroundColor: 'rgba(16,185,129,0.15)',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  brandEmoji: {
    fontSize: 18,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  navActions: {
    flexDirection: 'row',
    gap: 10,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navIcon: {
    fontSize: 16,
  },
  welcomeSection: {
    zIndex: 10,
  },
  greeting: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  balanceCard: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  balanceUnit: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(209,250,229,0.8)',
  },
  balanceArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arrowText: {
    fontSize: 20,
    color: GREEN,
    fontWeight: '900',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    flex: 1,
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  ctaTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  scannerSection: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    width: 170,
    height: 170,
  },
  scannerButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 36,
    elevation: 10,
    zIndex: 10,
  },
  scannerIcon: {
    fontSize: 48,
  },
  scannerLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.5)',
    marginBottom: 24,
  },
  infoChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  statsHeaderIcon: {
    fontSize: 14,
  },
  statsHeaderLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  navItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  navItemEmoji: {
    fontSize: 20,
  },
  navItemLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 14,
  },
});

