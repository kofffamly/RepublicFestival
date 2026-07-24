/**
 * Portefeuille (Wallet) — RecyGo CI
 *
 * Écran de portefeuille/wallet avec :
 * - En-tête vert foncé dégradé (~35% hauteur)
 *   - "Portefeuille" blanc gras à gauche + icône "..." à droite
 *   - Solde disponible depuis le contexte utilisateur
 *   - 2 boutons : "Retirer" (blanc, → /argent) et "Statistiques" (translucide)
 * - Corps blanc :
 *   - Carte "Revenus — Juillet 2026" avec graphique en barres
 *   - Liste "Transactions récentes"
 * - Barre de navigation inférieure avec onglet Portefeuille actif
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
  Dimensions,
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

const { width } = Dimensions.get('window');

// ─── Données mock ───────────────────────────────────────────────────
const WEEKLY_EARNINGS = [
  { week: 'S1', value: 450 },
  { week: 'S2', value: 820 },
  { week: 'S3', value: 600 },
  { week: 'S4', value: 1100 },
  { week: 'S5', value: 720 },
  { week: 'S6', value: 560 },
];

const TRANSACTIONS = [
  { id: '1', title: 'Plastique PET', date: '18 juil. 2026', amount: '+612 F' },
  { id: '2', title: 'Carton', date: '16 juil. 2026', amount: '+600 F' },
  { id: '3', title: 'Métal (alu)', date: '14 juil. 2026', amount: '+480 F' },
  { id: '4', title: 'Bouteilles verre', date: '12 juil. 2026', amount: '+250 F' },
  { id: '5', title: 'E-déchets', date: '10 juil. 2026', amount: '+1 150 F' },
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

// ─── Barre du graphique ─────────────────────────────────────────────
function ChartBar({ value, maxValue, label }: { value: number; maxValue: number; label: string }) {
  const [height, setHeight] = useState(0);
  const barHeight = (value / maxValue) * 120;

  useEffect(() => {
    const timer = setTimeout(() => setHeight(barHeight), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.chartBarContainer}>
      <View style={styles.chartBarWrapper}>
        <View
          style={[
            styles.chartBar,
            {
              height: height || 0,
              backgroundColor: GREEN_CTA,
            },
          ]}
        />
      </View>
      <Text style={styles.chartLabel}>{label}</Text>
    </View>
  );
}

// ─── Écran Portefeuille ─────────────────────────────────────────────
export default function WalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { balance } = useApp();

  const maxValue = Math.max(...WEEKLY_EARNINGS.map(w => w.value));

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
            <Text style={styles.headerTitle}>Portefeuille</Text>
            <View style={styles.headerMenuBtn}>
              <Text style={styles.headerMenuIcon}>...</Text>
            </View>
          </AnimatedView>

          {/* Solde */}
          <AnimatedView delay={100} style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Solde disponible</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceValue}>{balance.toLocaleString('fr-FR')}</Text>
              <Text style={styles.balanceUnit}>FCFA</Text>
            </View>
          </AnimatedView>

          {/* Boutons actions */}
          <AnimatedView delay={150}>
            <View style={styles.actionBtnsRow}>
              <Pressable
                style={styles.actionBtnWhite}
                onPress={() => router.push('/argent')}
              >
                <Text style={styles.actionBtnIcon}>↗</Text>
                <Text style={styles.actionBtnTextDark}>Retirer</Text>
              </Pressable>
              <Pressable style={styles.actionBtnOutline}>
                <Text style={styles.actionBtnIconWhite}>📊</Text>
                <Text style={styles.actionBtnTextWhite}>Statistiques</Text>
              </Pressable>
            </View>
          </AnimatedView>
        </View>

        {/* ─── Corps blanc ─────────────────────────────────────────── */}
        <View style={styles.body}>
          {/* Carte Revenus / Graphique */}
          <AnimatedView delay={200}>
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Revenus — Juillet 2026</Text>
                <Text style={styles.chartDropdown}>▾</Text>
              </View>
              <View style={styles.chartArea}>
                {WEEKLY_EARNINGS.map((item, idx) => (
                  <ChartBar
                    key={idx}
                    value={item.value}
                    maxValue={maxValue}
                    label={item.week}
                  />
                ))}
              </View>
            </View>
          </AnimatedView>

          {/* Transactions récentes */}
          <AnimatedView delay={250}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <View style={styles.transactionsCard}>
              {TRANSACTIONS.map((tx, idx) => (
                <View key={tx.id}>
                  <View style={styles.transactionRow}>
                    <View style={styles.txIconBox}>
                      <Text style={styles.txIcon}>♻️</Text>
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txTitle}>{tx.title}</Text>
                      <Text style={styles.txDate}>{tx.date}</Text>
                    </View>
                    <Text style={styles.txAmount}>{tx.amount}</Text>
                  </View>
                  {idx < TRANSACTIONS.length - 1 && <View style={styles.txDivider} />}
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
    paddingBottom: 28,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: WHITE,
  },
  headerMenuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMenuIcon: {
    fontSize: 16,
    color: WHITE,
    fontWeight: '700',
    letterSpacing: 2,
  },

  // ── Solde ──
  balanceSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '900',
    color: WHITE,
  },
  balanceUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },

  // ── Boutons actions ──
  actionBtnsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtnWhite: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 999,
    backgroundColor: WHITE,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'transparent',
  },
  actionBtnIcon: {
    fontSize: 16,
    color: GREEN_DARK,
    fontWeight: '700',
  },
  actionBtnIconWhite: {
    fontSize: 16,
  },
  actionBtnTextDark: {
    fontSize: 13,
    fontWeight: '700',
    color: GREEN_DARK,
  },
  actionBtnTextWhite: {
    fontSize: 13,
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

  // ── Graphique ──
  chartCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  chartDropdown: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 8,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarWrapper: {
    width: 24,
    height: 120,
    justifyContent: 'flex-end',
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  chartLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: TEXT_GRAY,
    marginTop: 6,
  },

  // ── Section ──
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 14,
  },

  // ── Transactions ──
  transactionsCard: {
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E9F8EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txIcon: {
    fontSize: 16,
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
  txDate: {
    fontSize: 11,
    fontWeight: '400',
    color: TEXT_GRAY,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: GREEN_CTA,
  },
  txDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 64,
  },
});
