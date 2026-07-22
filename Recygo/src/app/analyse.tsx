import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MobileFrame } from '@/components/MobileFrame';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

const ANALYSIS_RESULTS = [
  { type: 'Bouteille plastique PET', recyclable: true, price: 300, weight: 10, confidence: 96, category: 'Plastique', emoji: '🧴', materialCode: 'PET-1', co2: 15.6 },
  { type: 'Carton brun', recyclable: true, price: 150, weight: 8, confidence: 92, category: 'Carton', emoji: '📦', materialCode: 'CARD-2', co2: 8.2 },
  { type: 'Canette aluminium', recyclable: true, price: 450, weight: 5, confidence: 98, category: 'Métal', emoji: '🥫', materialCode: 'ALU-3', co2: 22.1 },
];

const PRICING_BREAKDOWN = [
  { label: 'Prix de base (plastique PET)', value: 250, unit: 'FCFA', positive: true },
  { label: 'Bonus Qualité A+ (propreté)', value: 50, unit: 'FCFA', positive: true },
  { label: 'Prime poids > 5 kg', value: 25, unit: 'FCFA', positive: true },
  { label: 'Frais de traitement', value: -25, unit: 'FCFA', positive: false },
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

function AnimatedMetric({ value, label, icon, color, suffix }: { value: number; label: string; icon: string; color: string; suffix?: string }) {
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const startTime = Date.now();
    const duration = 1200;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedValue(Math.round(eased * value));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <View style={styles.metricCard}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text style={[styles.metricValue, { color: CHARCOAL }]}>
        {displayedValue}{suffix || ''}
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function PricingBar({ label, value, unit, maxValue, positive }: { label: string; value: number; unit: string; maxValue: number; positive: boolean }) {
  const absValue = Math.abs(value);
  const barPercent = (absValue / maxValue) * 100;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(barPercent), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ marginBottom: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>{label}</Text>
        <Text style={{ fontSize: 12, fontWeight: '900', color: positive ? '#10b981' : '#ef4444' }}>
          {positive ? '+' : '-'}{absValue} {unit}
        </Text>
      </View>
      <View style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
        <View style={{ width: `${width}%` as any, height: '100%', borderRadius: 3, backgroundColor: positive ? GREEN : '#ef4444' }} />
      </View>
    </View>
  );
}

export default function Analyse() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [results] = useState(ANALYSIS_RESULTS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const scanLineAnim = useRef(new RNAnimated.Value(20)).current;

  const result = results[selectedIndex];
  const maxPricingValue = Math.max(...PRICING_BREAKDOWN.map(p => Math.abs(p.value)));

  useEffect(() => {
    if (analyzing) {
      const p = RNAnimated.loop(RNAnimated.sequence([
        RNAnimated.timing(scanLineAnim, { toValue: 220, duration: 2500, useNativeDriver: true }),
        RNAnimated.timing(scanLineAnim, { toValue: 20, duration: 2500, useNativeDriver: true }),
      ]));
      p.start();
      return () => p.stop();
    }
  }, [analyzing]);

  useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 2200);
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 200);
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setAnalyzing(true);
    setScanProgress(0);
    setTimeout(() => setAnalyzing(false), 2200);
    const pi = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) { clearInterval(pi); return prev; }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 200);
  }, []);

  return (
    <MobileFrame bgColor="#F8F9F9">
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.navHeader}>
          <AnimatedPressable onPress={() => router.back()}>
            <View style={styles.navBtn}>
              <Text style={styles.navBtnText}>←</Text>
            </View>
          </AnimatedPressable>
          <Text style={styles.navTitle}>Analyse IA en direct</Text>
          <View style={styles.navBtn}>
            <Text style={styles.navBtnText}>↗</Text>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.viewfinder}>
            <View style={styles.viewfinderBg} />
            <View style={styles.gridOverlay}>
              {[0, 1, 2].map(row => (
                <View key={row} style={styles.gridRow}>
                  {[0, 1, 2].map(col => (
                    <View key={col} style={styles.gridCell} />
                  ))}
                </View>
              ))}
            </View>
            <Text style={styles.viewfinderEmoji}>{result.emoji}</Text>
            {analyzing ? (
              <>
                <View style={styles.mainBbox} />
                <View style={styles.secondaryBbox} />
                <View style={styles.tertiaryBbox} />
                <RNAnimated.View style={[styles.scanLine, { transform: [{ translateY: scanLineAnim }] }]} />
              </>
            ) : (
              <View style={styles.detectedOverlay}>
                <View style={styles.detectedTop}>
                  <View style={styles.detectedBadge}><Text style={styles.detectedBadgeText}>✅ {result.materialCode}</Text></View>
                  <View style={styles.detectedConfidence}><Text style={styles.detectedConfidenceText}>💻 {result.confidence}%</Text></View>
                </View>
                <View style={styles.detectedBottom}>
                  <View style={styles.materialBadge}><Text style={styles.materialBadgeText}>♻️ RECYCLABLE</Text></View>
                  <View style={[styles.materialBadge, styles.co2Badge]}><Text style={[styles.materialBadgeText, { color: '#93c5fd' }]}>🌱 BIO {result.weight * 1.8}kg CO2</Text></View>
                </View>
              </View>
            )}
            {analyzing && (
              <View style={styles.analyzingOverlay}>
                <View style={styles.spinner}><Text style={styles.spinnerIcon}>💻</Text></View>
                <Text style={styles.analyzingTitle}>Analyse IA en cours...</Text>
                <Text style={styles.analyzingSub}>Classification des polymères...</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}><Text style={styles.progressLabel}>Scan</Text><Text style={styles.progressValue}>{scanProgress}%</Text></View>
                  <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${scanProgress}%` as any }]} /></View>
                </View>
              </View>
            )}
          </View>

          {!analyzing && (
            <>
              <View style={styles.tabsRow}>
                {results.map((r, idx) => (
                  <Pressable key={idx} onPress={() => setSelectedIndex(idx)} style={[styles.tab, idx === selectedIndex && styles.tabActive]}>
                    <Text style={styles.tabEmoji}>{r.emoji}</Text>
                    <Text style={[styles.tabText, idx === selectedIndex && styles.tabTextActive]}>{r.type.split(' ')[0]}</Text>
                    <Text style={[styles.tabPrice, idx === selectedIndex && styles.tabPriceActive]}>{r.price} FCFA</Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View>
                    <Text style={styles.resultCategory}>{result.category}</Text>
                    <Text style={styles.resultTitle}>{result.type}</Text>
                  </View>
                  <View style={styles.recyclableBadge}><Text style={styles.recyclableBadgeText}>♻️ Recyclable</Text></View>
                </View>
                <View style={styles.metricsRow}>
                  <AnimatedMetric value={result.price} label="FCFA Estimés" icon="💰" color={ORANGE} />
                  <AnimatedMetric value={result.weight} label="Kg Estimés" icon="⚖️" color={GREEN} suffix=" kg" />
                  <AnimatedMetric value={result.confidence} label="Confiance" icon="🏆" color="#9b59b6" suffix="%" />
                </View>
              </View>

              <View style={styles.ecoCard}>
                <Text style={styles.ecoIcon}>🌱</Text>
                <View style={styles.ecoInfo}>
                  <Text style={styles.ecoTitle}>Impact Écologique</Text>
                  <Text style={styles.ecoDesc}>Cette collecte évite environ <Text style={styles.ecoBold}>{result.co2} kg</Text> d'émissions de CO2.</Text>
                </View>
                <View style={styles.ecoBadge}><Text style={styles.ecoBadgeText}>Éco+</Text></View>
              </View>

              <View style={styles.pricingCard}>
                <Text style={styles.sectionLabel}>Estimation du tarif</Text>
                {PRICING_BREAKDOWN.map((row, idx) => (
                  <PricingBar key={idx} label={row.label} value={row.value} unit={row.unit} maxValue={maxPricingValue} positive={row.positive} />
                ))}
                <View style={styles.pricingTotal}>
                  <Text style={styles.pricingTotalLabel}>Valeur totale estimée</Text>
                  <Text style={styles.pricingTotalValue}>{result.price} FCFA</Text>
                </View>
              </View>

              <View style={styles.pricingCard}>
                <Text style={styles.sectionLabel}>Composition du matériau</Text>
                <View style={styles.compositionRow}>
                  {[
                    { label: 'Polymère', value: 'PET-1', color: '#3498db', icon: '💧' },
                    { label: 'Densité', value: '0.38 g/cm³', color: GREEN, icon: '⚖️' },
                    { label: 'Humidité', value: '2.1%', color: ORANGE, icon: '🗑️' },
                  ].map((item, idx) => (
                    <View key={idx} style={styles.compositionItem}>
                      <Text style={{ fontSize: 14, marginBottom: 4 }}>{item.icon}</Text>
                      <Text style={styles.compositionLabel}>{item.label}</Text>
                      <Text style={[styles.compositionValue, { color: item.color }]}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.footerControls}>
                <AnimatedPressable onPress={handleRetry} style={styles.retryBtn}>
                  <Text style={styles.retryBtnText}>🔄 Réessayer</Text>
                </AnimatedPressable>
                <AnimatedPressable onPress={() => router.push('/argent' as any)} style={styles.collectBtn}>
                  <Text style={styles.collectBtnText}>📍 Trouver un collecteur</Text>
                </AnimatedPressable>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </MobileFrame>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9F9' },
  navHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  navBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  navBtnText: { fontSize: 18, color: CHARCOAL, fontWeight: '700' },
  navTitle: { fontSize: 16, fontWeight: '900', color: CHARCOAL },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  viewfinder: {
    height: 240, borderRadius: 24, overflow: 'hidden',
    backgroundColor: '#0a1628', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 16,
  },
  viewfinderBg: { position: 'absolute', inset: 0, backgroundColor: '#0D121A', opacity: 0.8 },
  gridOverlay: { position: 'absolute', inset: 0, opacity: 0.1 },
  gridRow: { flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(52,211,153,0.3)' },
  gridCell: { flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(52,211,153,0.3)' },
  viewfinderEmoji: { fontSize: 64, zIndex: 5 },
  mainBbox: { position: 'absolute', width: 160, height: 160, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(52,211,153,0.6)' },
  secondaryBbox: { position: 'absolute', top: '20%', right: '18%', width: 70, height: 90, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(34,211,238,0.4)' },
  tertiaryBbox: { position: 'absolute', bottom: '25%', left: '15%', width: 55, height: 65, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)' },
  scanLine: { position: 'absolute', left: 32, right: 32, height: 2, backgroundColor: '#34d399' },
  detectedOverlay: { position: 'absolute', inset: 0, padding: 16, justifyContent: 'space-between' },
  detectedTop: { flexDirection: 'row', justifyContent: 'space-between' },
  detectedBadge: { backgroundColor: '#10b981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  detectedBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  detectedConfidence: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  detectedConfidenceText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  detectedBottom: { flexDirection: 'row', gap: 6 },
  materialBadge: { backgroundColor: 'rgba(4,120,87,0.7)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  materialBadgeText: { color: '#6ee7b7', fontSize: 9, fontWeight: '700' },
  co2Badge: { backgroundColor: 'rgba(30,64,175,0.7)' },
  analyzingOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', alignItems: 'center', justifyContent: 'center' },
  spinner: { width: 56, height: 56, borderRadius: 28, borderWidth: 4, borderColor: '#34d399', borderTopColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  spinnerIcon: { fontSize: 22 },
  analyzingTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  analyzingSub: { color: '#cbd5e1', fontSize: 10, marginTop: 4 },
  progressContainer: { width: 192, marginTop: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { color: '#94a3b8', fontSize: 9 },
  progressValue: { color: '#94a3b8', fontSize: 9 },
  progressBar: { width: '100%', height: 6, borderRadius: 3, backgroundColor: '#334155', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: '#34d399' },
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
  },
  tabActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  tabEmoji: { fontSize: 14 },
  tabText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#FFFFFF' },
  tabPrice: { fontSize: 9, color: '#94A3B8', fontWeight: '700' },
  tabPriceActive: { color: '#d1fae5' },
  resultCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  resultCategory: { fontSize: 10, color: '#10b981', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  resultTitle: { fontSize: 20, fontWeight: '900', color: CHARCOAL, marginTop: 4 },
  recyclableBadge: { backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  recyclableBadgeText: { fontSize: 12, fontWeight: '900', color: '#059669' },
  metricsRow: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, alignItems: 'center', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  metricValue: { fontSize: 18, fontWeight: '900', marginTop: 4 },
  metricLabel: { fontSize: 8, fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', marginTop: 2 },
  ecoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: 'rgba(16,185,129,0.05)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.15)', marginBottom: 16 },
  ecoIcon: { fontSize: 24 },
  ecoInfo: { flex: 1 },
  ecoTitle: { fontSize: 12, fontWeight: '900', color: '#1e293b' },
  ecoDesc: { fontSize: 11, color: '#059669', marginTop: 2, fontWeight: '600' },
  ecoBold: { fontWeight: '900' },
  ecoBadge: { backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ecoBadgeText: { fontSize: 9, fontWeight: '900', color: '#059669' },
  pricingCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16 },
  sectionLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  pricingRow: { marginBottom: 6 },
  pricingLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  pricingLabel: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  pricingValue: { fontSize: 12, fontWeight: '900' },
  pricingBarOuter: { width: '100%', height: 6, borderRadius: 3, backgroundColor: '#F1F5F9', overflow: 'hidden' },
  pricingBarInner: { height: '100%', borderRadius: 3 },
  pricingTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  pricingTotalLabel: { fontSize: 12, fontWeight: '900', color: '#1e293b' },
  pricingTotalValue: { fontSize: 16, fontWeight: '900', color: ORANGE },
  compositionRow: { flexDirection: 'row', gap: 12 },
  compositionItem: { flex: 1, alignItems: 'center', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  compositionLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '900', textTransform: 'uppercase', marginTop: 2 },
  compositionValue: { fontSize: 14, fontWeight: '900', marginTop: 2 },
  footerControls: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  retryBtn: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  retryBtnText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  collectBtn: { flex: 2, backgroundColor: ORANGE, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  collectBtnText: { fontSize: 12, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },
});

