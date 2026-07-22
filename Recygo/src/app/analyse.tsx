/**
 * Résultat IA — RecyGo CI (Spec #12)
 *
 * Écran affichant le résultat de l'analyse IA d'un déchet scanné :
 * - En-tête vert foncé : flèche retour + "Résultat IA" + badge confiance
 * - Corps blanc : carte résultat (type, estimation, stats), impact environnemental,
 *   bouton "Demander une collecte", lien "Rescanner"
 */

import { useState, useRef, useEffect } from 'react';
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

// ─── Données mock ───────────────────────────────────────────────────
const MOCK_RESULT = {
  icon: '📦',
  type: 'Plastique PET',
  category: 'Bouteilles & emballages',
  estimatedMin: 300,
  estimatedMax: 600,
  weightMin: 2,
  weightMax: 3,
  pricePerKg: '150-200',
  quality: 'Bonne',
  co2Saved: '2.4',
  energySaved: '4.8',
  confidence: 94,
};

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

// ─── Écran Résultat IA ──────────────────────────────────────────────
export default function AnalyseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleRequestCollect = () => {
    router.push('/(citizen)/new-request');
  };

  const handleRescan = () => {
    router.back();
  };

  const r = MOCK_RESULT;

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
          <AnimatedView delay={0} style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Résultat IA</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceIcon}>✓</Text>
              <Text style={styles.confidenceText}>{r.confidence}% confiance</Text>
            </View>
          </AnimatedView>
        </View>

        {/* ─── Corps blanc ─────────────────────────────────────────── */}
        <View style={styles.body}>
          {/* Carte résultat principal */}
          <AnimatedView delay={100}>
            <View style={styles.resultCard}>
              {/* Icône */}
              <View style={styles.resultIconBox}>
                <Text style={styles.resultIcon}>{r.icon}</Text>
              </View>

              {/* Type et estimation */}
              <View style={styles.resultMainRow}>
                <View style={styles.resultLeft}>
                  <Text style={styles.resultType}>{r.type}</Text>
                  <Text style={styles.resultCategory}>{r.category}</Text>
                </View>
                <View style={styles.resultRight}>
                  <Text style={styles.resultPrice}>{r.estimatedMin}–{r.estimatedMax}</Text>
                  <Text style={styles.resultPriceLabel}>FCFA estimés</Text>
                </View>
              </View>

              {/* Séparateur */}
              <View style={styles.resultDivider} />

              {/* Statistiques */}
              <View style={styles.resultStatsRow}>
                <View style={styles.resultStat}>
                  <Text style={styles.statLabel}>Poids estimé</Text>
                  <Text style={styles.statValue}>{r.weightMin}-{r.weightMax} kg</Text>
                </View>
                <View style={styles.resultStatDivider} />
                <View style={styles.resultStat}>
                  <Text style={styles.statLabel}>Prix / kg</Text>
                  <Text style={styles.statValue}>{r.pricePerKg} F</Text>
                </View>
                <View style={styles.resultStatDivider} />
                <View style={styles.resultStat}>
                  <Text style={styles.statLabel}>Qualité</Text>
                  <Text style={[styles.statValue, { color: GREEN_CTA }]}>{r.quality}</Text>
                </View>
              </View>
            </View>
          </AnimatedView>

          {/* Carte Impact environnemental */}
          <AnimatedView delay={150}>
            <View style={styles.impactCard}>
              <View style={styles.impactHeader}>
                <Text style={styles.impactIcon}>🌿</Text>
                <Text style={styles.impactTitle}>Impact environnemental</Text>
              </View>
              <View style={styles.impactRow}>
                <View style={styles.impactSubCard}>
                  <Text style={styles.impactSubIcon}>🌱</Text>
                  <Text style={styles.impactSubLabel}>CO2 évité</Text>
                  <Text style={styles.impactSubValue}>{r.co2Saved} kg</Text>
                </View>
                <View style={styles.impactSubCard}>
                  <Text style={styles.impactSubIcon}>⚡</Text>
                  <Text style={styles.impactSubLabel}>Énergie économisée</Text>
                  <Text style={styles.impactSubValue}>{r.energySaved} kWh</Text>
                </View>
              </View>
            </View>
          </AnimatedView>

          {/* Bouton Demander une collecte */}
          <AnimatedView delay={200}>
            <AnimatedPressable onPress={handleRequestCollect}>
              <View style={styles.collectBtn}>
                <Text style={styles.collectBtnIcon}>🚛</Text>
                <Text style={styles.collectBtnText}>Demander une collecte</Text>
              </View>
            </AnimatedPressable>
          </AnimatedView>

          {/* Lien Rescanner */}
          <AnimatedView delay={250}>
            <Pressable onPress={handleRescan} style={styles.rescanBtn}>
              <Text style={styles.rescanText}>Rescanner</Text>
            </Pressable>
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
    paddingBottom: 20,
  },
  headerRow: {
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
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: WHITE,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  confidenceIcon: {
    fontSize: 10,
    color: WHITE,
    fontWeight: '700',
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '600',
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

  // ── Carte résultat ──
  resultCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resultIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#E9F8EF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  resultIcon: {
    fontSize: 28,
  },
  resultMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  resultLeft: {
    flex: 1,
  },
  resultType: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 13,
    fontWeight: '400',
    color: TEXT_GRAY,
  },
  resultRight: {
    alignItems: 'flex-end',
  },
  resultPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: GREEN_CTA,
  },
  resultPriceLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: TEXT_GRAY,
    marginTop: 2,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  resultStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultStat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: TEXT_GRAY,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  resultStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#F1F5F9',
  },

  // ── Impact environnemental ──
  impactCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  impactIcon: {
    fontSize: 18,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  impactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  impactSubCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  impactSubIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  impactSubLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: TEXT_GRAY,
    marginBottom: 4,
  },
  impactSubValue: {
    fontSize: 18,
    fontWeight: '700',
    color: GREEN_CTA,
  },

  // ── Bouton collecte ──
  collectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 999,
    backgroundColor: GREEN_CTA,
    shadowColor: GREEN_CTA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  collectBtnIcon: {
    fontSize: 18,
  },
  collectBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE,
  },

  // ── Rescanner ──
  rescanBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  rescanText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_GRAY,
  },
});

