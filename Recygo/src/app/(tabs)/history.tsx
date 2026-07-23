/**
 * Historique (Citoyen) — RecyGo CI
 *
 * Écran d'historique des collectes avec :
 * - Titre "Historique" en noir, gras, ~22px
 * - 3 filtres en pills : Tout, En cours, Terminé
 * - 2 cartes stats : Total gagné (3 092 FCFA) + Collectes (5 / 20 kg)
 * - Liste verticale de transactions avec icône, titre, date, poids, recycleur, montant
 * - Barre de navigation inférieure avec onglet Historique actif
 */

import { useRef, useEffect, useState } from 'react';
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
const GREEN_LIGHT = '#22C55E';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_GRAY = '#6B7280';
const BG_LIGHT = '#F8FAFC';
const BORDER = '#E5E7EB';

type FilterType = 'all' | 'pending' | 'completed';

// ─── Données mock ───────────────────────────────────────────────────
const TRANSACTIONS = [
  { id: '1', title: 'Plastique PET', date: '18 juil. 2026', weight: '3.5 kg', recycler: 'Ibrahim C.', amount: '+612 F', status: 'completed', icon: '♻️' },
  { id: '2', title: 'Carton', date: '16 juil. 2026', weight: '5 kg', recycler: 'Faso Tri', amount: '+600 F', status: 'completed', icon: '♻️' },
  { id: '3', title: 'Métal (alu)', date: '14 juil. 2026', weight: '1.2 kg', recycler: 'EcoCôte', amount: '+480 F', status: 'completed', icon: '♻️' },
  { id: '4', title: 'Bouteilles verre', date: '12 juil. 2026', weight: '2 kg', recycler: 'Ibrahim C.', amount: '+250 F', status: 'completed', icon: '♻️' },
  { id: '5', title: 'E-déchets', date: '10 juil. 2026', weight: '4 kg', recycler: 'Green Tech', amount: '+1 150 F', status: 'pending', icon: '♻️' },
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

// ─── Écran Historique ───────────────────────────────────────────────
export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredTransactions = activeFilter === 'all'
    ? TRANSACTIONS
    : TRANSACTIONS.filter(t => t.status === activeFilter);

  const totalEarned = TRANSACTIONS
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => {
      const num = parseInt(t.amount.replace(/[^0-9]/g, ''));
      return sum + num;
    }, 0);

  const totalKg = TRANSACTIONS
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => {
      const num = parseFloat(t.weight.replace(',', '.'));
      return sum + num;
    }, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Titre ──────────────────────────────────────────────── */}
        <AnimatedView delay={0} style={styles.headerRow}>
          <Text style={styles.headerTitle}>Historique</Text>
        </AnimatedView>

        {/* ─── Filtres ────────────────────────────────────────────── */}
        <AnimatedView delay={50}>
          <View style={styles.filtersRow}>
            {(['all', 'pending', 'completed'] as FilterType[]).map((filter) => {
              const isActive = activeFilter === filter;
              const labels: Record<FilterType, string> = { all: 'Tout', pending: 'En cours', completed: 'Terminé' };
              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={[
                    styles.filterPill,
                    isActive ? styles.filterPillActive : styles.filterPillInactive,
                  ]}
                >
                  <Text style={[styles.filterText, isActive ? styles.filterTextActive : styles.filterTextInactive]}>
                    {labels[filter]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </AnimatedView>

        {/* ─── Cartes stats ───────────────────────────────────────── */}
        <AnimatedView delay={100}>
          <View style={styles.statsRow}>
            {/* Carte Total gagné */}
            <View style={styles.statsCardGreen}>
              <Text style={styles.statsCardSmallLabel}>Total gagné</Text>
              <Text style={styles.statsCardLargeValue}>3 092 FCFA</Text>
            </View>

            {/* Carte Collectes */}
            <View style={styles.statsCardWhite}>
              <Text style={styles.statsCardSmallLabel}>Collectes</Text>
              <Text style={styles.statsCardLargeValueDark}>5</Text>
              <Text style={styles.statsCardSmallGray}>{totalKg.toFixed(0)} kg recyclés</Text>
            </View>
          </View>
        </AnimatedView>

        {/* ─── Liste des transactions ─────────────────────────────── */}
        <AnimatedView delay={150}>
          <View style={styles.transactionsList}>
            {filteredTransactions.map((tx, idx) => (
              <View key={tx.id}>
                <View style={styles.transactionRow}>
                  {/* Icône */}
                  <View style={styles.txIconBox}>
                    <Text style={styles.txIcon}>{tx.icon}</Text>
                  </View>

                  {/* Infos */}
                  <View style={styles.txInfo}>
                    <Text style={styles.txTitle}>{tx.title}</Text>
                    <Text style={styles.txMeta}>
                      {tx.date} · {tx.weight} · {tx.recycler}
                    </Text>
                  </View>

                  {/* Montant + statut */}
                  <View style={styles.txRight}>
                    <Text style={[styles.txAmount, { color: tx.status === 'completed' ? GREEN_CTA : TEXT_GRAY }]}>
                      {tx.amount}
                    </Text>
                    <Text style={styles.txStatus}>
                      {tx.status === 'completed' ? 'Terminé' : 'En cours'}
                    </Text>
                  </View>
                </View>
                {idx < filteredTransactions.length - 1 && <View style={styles.txDivider} />}
              </View>
            ))}
          </View>
        </AnimatedView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // ── Titre ──
  headerRow: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_DARK,
  },

  // ── Filtres ──
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
  },
  filterPillActive: {
    backgroundColor: GREEN_CTA,
  },
  filterPillInactive: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: WHITE,
  },
  filterTextInactive: {
    color: TEXT_GRAY,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statsCardGreen: {
    flex: 1,
    backgroundColor: GREEN_CTA,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    shadowColor: GREEN_CTA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  statsCardWhite: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statsCardSmallLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  statsCardLargeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: WHITE,
  },
  statsCardLargeValueDark: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  statsCardSmallGray: {
    fontSize: 11,
    fontWeight: '400',
    color: TEXT_GRAY,
    marginTop: 2,
  },

  // ── Transactions ──
  transactionsList: {
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  txIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9F8EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txIcon: {
    fontSize: 18,
    color: GREEN_CTA,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  txMeta: {
    fontSize: 11,
    fontWeight: '400',
    color: TEXT_GRAY,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  txStatus: {
    fontSize: 10,
    fontWeight: '500',
    color: TEXT_GRAY,
  },
  txDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 68,
  },
});

