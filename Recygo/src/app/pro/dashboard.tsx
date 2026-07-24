import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { MobileFrame } from '@/components/MobileFrame';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

const STOCK = [
  { label: 'Plastique', current: 200, max: 300, color: '#3498db', bg: '#ebf5fb', emoji: '🧴' },
  { label: 'Carton', current: 80, max: 200, color: ORANGE, bg: '#fef5e7', emoji: '📦' },
  { label: 'Métal', current: 45, max: 100, color: '#95a5a6', bg: '#f2f4f4', emoji: '🥫' },
  { label: 'Verre', current: 30, max: 150, color: '#1abc9c', bg: '#e8f8f5', emoji: '🍶' },
];

const QUICK_ACTIONS = [
  { icon: '📋', label: 'Demandes', route: '/pro/demandes', color: ORANGE, badge: 8 },
  { icon: '🗺️', label: 'Carte Live', route: '/pro/demandes', color: '#3498db', badge: null },
  { icon: '🏭', label: 'Usines Rachat', route: '/pro/demandes', color: GREEN, badge: null },
];

const RECENT_COLLECTIONS = [
  { location: 'Cocody Riviera 2', type: 'Plastique PET', weight: '30 kg', price: '8 000 FCFA', time: 'Il y a 5 min', emoji: '🧴', status: 'completed' },
  { location: 'Yopougon Selmer', type: 'Carton', weight: '45 kg', price: '6 750 FCFA', time: 'Il y a 20 min', emoji: '📦', status: 'completed' },
  { location: 'Plateau Centre', type: 'Métal', weight: '12 kg', price: '4 800 FCFA', time: 'Il y a 1h', emoji: '🥫', status: 'in_progress' },
  { location: 'Adjamé Marché', type: 'Verre mixte', weight: '18 kg', price: '2 700 FCFA', time: 'Il y a 2h', emoji: '🍶', status: 'pending' },
];

function AnimatedPressable({ onPress, children, style }: { onPress?: () => void; children: React.ReactNode; style?: any }) {
  const scale = useRef(new RNAnimated.Value(1)).current;
  const hp = () => RNAnimated.spring(scale, { toValue: 0.95, friction: 8, tension: 100, useNativeDriver: true }).start();
  const hpr = () => RNAnimated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();
  return (
    <RNAnimated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={hp} onPressOut={hpr}>{children}</Pressable>
    </RNAnimated.View>
  );
}

function AnimatedMetricCard({ icon, label, value, suffix, color }: { icon: string; label: string; value: number; suffix: string; color: string }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const startTime = Date.now();
    const duration = 1000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <Text style={{ fontSize: 14 }}>{icon}</Text>
        <Text style={{ fontSize: 9, fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Text>
      </View>
      <Text style={{ fontSize: 22, fontWeight: '900', color, marginTop: 2 }}>{displayed}{suffix} <Text style={{ fontSize: 9, fontWeight: '700', color: '#94A3B8' }}>FCFA</Text></Text>
    </View>
  );
}

export default function ProDashboard() {
  const router = useRouter();
  const { user } = useApp();
  const insets = useSafeAreaInsets();

  const statusColors: Record<string, string> = {
    completed: GREEN,
    in_progress: ORANGE,
    pending: '#94a3b8',
  };

  const statusLabels: Record<string, string> = {
    completed: 'Terminée',
    in_progress: 'En cours',
    pending: 'En attente',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Pro Header */}
        <View style={styles.proHeader}>
          <View style={styles.proHeaderGrid} />
          <View style={styles.proNavBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.proBrandIcon}>
                <Text style={{ fontSize: 18, color: '#fff' }}>♻️</Text>
              </View>
              <Text style={styles.proBrandName}>RecyGo <Text style={{ color: ORANGE, fontSize: 12 }}>PRO</Text></Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <AnimatedPressable onPress={() => router.push('/pro/demandes')} style={styles.proIconBtn}>
                <Text style={{ fontSize: 16 }}>🔔</Text>
                <View style={styles.proBadgeDot} />
              </AnimatedPressable>
              <AnimatedPressable onPress={() => router.push('/shared/switch-role')} style={styles.proIconBtn}>
                <Text style={{ fontSize: 16 }}>⚙️</Text>
              </AnimatedPressable>
            </View>
          </View>

          <View style={styles.proUserSection}>
            <Text style={{ fontSize: 9, fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Espace Recyclage Pro</Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginTop: 2 }}>{user?.name || 'Recycleur Pro'}</Text>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <AnimatedMetricCard icon="🚛" label="Collectes dispo" value={8} suffix="" color={ORANGE} />
              <AnimatedMetricCard icon="📈" label="Revenu / mois" value={45} suffix="K" color={GREEN} />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.contentSection}>
          <View style={styles.actionsRow}>
            {QUICK_ACTIONS.map((item, idx) => (
              <AnimatedPressable key={idx} onPress={() => router.push(item.route as any)} style={styles.actionCard}>
                {item.badge && (
                  <View style={styles.actionBadge}>
                    <Text style={styles.actionBadgeText}>{item.badge}</Text>
                  </View>
                )}
                <View style={[styles.actionIconBox, { backgroundColor: `${item.color}15` }]}>
                  <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                </View>
                <Text style={styles.actionLabel}>{item.label}</Text>
              </AnimatedPressable>
            ))}
          </View>

          {/* Stock Inventory */}
          <View style={styles.whiteCard}>
            <View style={styles.cardHeader}>
              <Text style={{ fontSize: 16 }}>🎯</Text>
              <Text style={styles.cardHeaderText}>Suivi de mon Stock</Text>
              <View style={styles.cardBadge}>
                <Text style={{ fontSize: 10, fontWeight: '900', color: GREEN }}>📦 355 kg accumulés</Text>
              </View>
            </View>
            {STOCK.map((stock, i) => (
              <View key={i} style={{ marginBottom: i < STOCK.length - 1 ? 14 : 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 14 }}>{stock.emoji}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: CHARCOAL }}>{stock.label}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: stock.color }}>{stock.current} / {stock.max} kg</Text>
                    <Text style={{ fontSize: 8, fontWeight: '700', color: '#94A3B8' }}>({Math.round(stock.current / stock.max * 100)}%)</Text>
                  </View>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${(stock.current / stock.max) * 100}%`, backgroundColor: stock.color }]} />
                </View>
              </View>
            ))}
          </View>

          {/* Recent collections timeline */}
          <View style={styles.whiteCard}>
            <View style={styles.cardHeader}>
              <Text style={{ fontSize: 16 }}>🛒</Text>
              <Text style={styles.cardHeaderText}>Collectes récentes</Text>
              <AnimatedPressable onPress={() => router.push('/pro/demandes')}>
                <Text style={{ fontSize: 11, fontWeight: '900', color: ORANGE }}>Voir tout →</Text>
              </AnimatedPressable>
            </View>
            {RECENT_COLLECTIONS.map((item, idx) => (
              <View key={idx} style={[styles.timelineItem, idx < RECENT_COLLECTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#F8F9FA' }]}>
                <View style={{ alignItems: 'center', width: 20 }}>
                  <View style={[styles.timelineDot, { borderColor: statusColors[item.status], backgroundColor: item.status === 'completed' ? statusColors[item.status] : 'transparent' }]} />
                  {idx < RECENT_COLLECTIONS.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={styles.timelineEmojiBox}>
                    <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: CHARCOAL }}>{item.location}</Text>
                      <Text style={[styles.statusBadge, { backgroundColor: `${statusColors[item.status]}20`, color: statusColors[item.status] }]}>{statusLabels[item.status]}</Text>
                    </View>
                    <Text style={{ fontSize: 9, color: '#94A3B8', marginTop: 2 }}>⏰ {item.time} · {item.type} · ⚖️ {item.weight}</Text>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '900', color: '#10b981' }}>{item.price}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9F9' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  proHeader: {
    backgroundColor: '#1e2b37',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  proHeaderGrid: {
    ...StyleSheet.absoluteFill,
    opacity: 0.05,
    backgroundColor: 'transparent',
  },
  proNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  proBrandIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBrandName: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  proIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
  },
  proBadgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  proUserSection: {},
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  metricValue: { fontSize: 22, fontWeight: '900', marginTop: 2 },
  contentSection: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: ORANGE,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadgeText: { fontSize: 9, fontWeight: '900', color: '#FFFFFF' },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: { fontSize: 11, fontWeight: '800', color: '#334155', textAlign: 'center' },
  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardHeaderText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBadge: {
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
  },
  timelineEmojiBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${ORANGE}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    fontSize: 7,
    fontWeight: '800',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
});

