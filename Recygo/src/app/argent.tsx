import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { MobileFrame } from '@/components/MobileFrame';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

const PAYMENT_CHANNELS = [
  { id: 'wave', name: 'Wave', emoji: '🌊', color: '#1E90FF', bg: '#EBF5FF', description: 'Retrait sans frais · 0%' },
  { id: 'orange', name: 'Orange Money', emoji: '🟠', color: '#FF6600', bg: '#FFF3EB', description: 'Instantané 24h/7' },
  { id: 'mtn', name: 'MTN MoMo', emoji: '💛', color: '#FFCC00', bg: '#FFFBEB', description: 'Réseau national CI' },
];

const TRANSACTIONS = [
  { id: 1, type: 'Plastique PET', amount: 300, date: "Aujourd'hui 14h30", status: 'success', emoji: '🧴' },
  { id: 2, type: 'Carton brun', amount: 150, date: 'Hier 09h15', status: 'success', emoji: '📦' },
  { id: 3, type: 'Canette alu', amount: 450, date: '18 Juil 16h45', status: 'success', emoji: '🥫' },
  { id: 4, type: 'Bouteilles verre', amount: 200, date: '15 Juil 11h20', status: 'success', emoji: '🍶' },
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

function AnimatedBalanceCounter({ balance }: { balance: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (balance === 0) return;
    const startTime = Date.now();
    const duration = 1000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * balance));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [balance]);

  return (
    <Text style={styles.balanceAmount}>{displayed.toLocaleString()}</Text>
  );
}

function WithdrawStepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: 'Sélection', emoji: '👆' },
    { label: 'Confirmation', emoji: '⚡' },
    { label: 'Transfert', emoji: '💸' },
    { label: 'Terminé', emoji: '✅' },
  ];

  return (
    <View style={styles.stepsRow}>
      {steps.map((step, idx) => (
        <View key={idx} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            { backgroundColor: idx < currentStep ? GREEN : idx === currentStep ? ORANGE : '#F1F5F9' }
          ]}>
            <Text style={styles.stepCircleText}>
              {idx < currentStep ? '✓' : step.emoji}
            </Text>
          </View>
          <Text style={styles.stepLabel}>{step.label}</Text>
        </View>
      ))}
    </View>
  );
}

export default function Argent() {
  const router = useRouter();
  const { balance } = useApp();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadingChannel, setLoadingChannel] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [txRef, setTxRef] = useState('');
  const scaleAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    setTxRef(`RG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
  }, []);

  const handleWithdraw = (channelId: string) => {
    setLoadingChannel(channelId);
    setSelected(channelId);
    setStep(1);
    setTimeout(() => setStep(2), 500);
    setTimeout(() => setStep(3), 1100);
    setTimeout(() => {
      setLoadingChannel(null);
      setSuccess(true);
      setStep(4);
      RNAnimated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    }, 1600);
  };

  if (success) {
    const channel = PAYMENT_CHANNELS.find(c => c.id === selected);
    return (
      <MobileFrame bgColor="#F8F9F9">
        <View style={styles.successContainer}>
          <RNAnimated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.successIcon}>✅</Text>
          </RNAnimated.View>
          <Text style={styles.successTitle}>{balance.toLocaleString()} FCFA transférés !</Text>
          <Text style={styles.successSub}>Virement effectué vers ton compte {channel?.name}</Text>

          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptEmoji}>{channel?.emoji}</Text>
              <View>
                <Text style={styles.receiptName}>{channel?.name}</Text>
                <Text style={styles.receiptSecure}>🛡️ Paiement instantané sécurisé</Text>
              </View>
            </View>
            <View style={styles.receiptDivider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>N° de Référence</Text>
              <Text style={styles.receiptValue}>{txRef}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Statut</Text>
              <Text style={styles.receiptStatus}>⚡ Confirmé</Text>
            </View>
            <View style={styles.txHashBox}>
              <View style={styles.txHashDot} />
              <Text style={styles.txHashText}>TX_HASH: 0x7a3f...{txRef.slice(-4)}</Text>
            </View>
          </View>

          <AnimatedPressable onPress={() => router.push('/(tabs)/home')} style={styles.backHomeBtn}>
            <Text style={styles.backHomeBtnText}>✨ Retour à l'accueil</Text>
          </AnimatedPressable>
        </View>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame bgColor="#F8F9F9">
      <View style={styles.container}>
        <View style={styles.gradientHeader}>
          <AnimatedPressable onPress={() => router.push('/(tabs)/home')}>
            <View style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Retour</Text>
            </View>
          </AnimatedPressable>

          <View style={styles.walletCard}>
            <View style={styles.walletDecor} />
            <View style={styles.walletTop}>
              <Text style={styles.walletLabel}>RecyGo Wallet</Text>
              <Text style={styles.walletIcon}>📶</Text>
            </View>
            <Text style={styles.walletBalanceLabel}>Solde disponible pour retrait</Text>
            <View style={styles.balanceRow}>
              <AnimatedBalanceCounter balance={balance} />
              <Text style={styles.balanceUnit}>FCFA</Text>
            </View>
            {step > 0 && (
              <View style={styles.stepsContainer}>
                <WithdrawStepIndicator currentStep={step} />
              </View>
            )}
            <View style={styles.walletFooter}>
              <Text style={styles.walletCardNum}>**** **** **** 1092</Text>
              <Text style={styles.walletCountry}>CI</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>💰 Choisir le mode de paiement</Text>
          {PAYMENT_CHANNELS.map((channel) => {
            const isSelected = selected === channel.id;
            const isLoading = loadingChannel === channel.id;

            return (
              <Pressable
                key={channel.id}
                onPress={() => handleWithdraw(channel.id)}
                disabled={loadingChannel !== null}
                style={[styles.channelCard, { borderColor: isSelected ? channel.color : '#E2E8F0', backgroundColor: isSelected ? channel.bg : '#FFFFFF' }]}
              >
                <Text style={styles.channelEmoji}>{channel.emoji}</Text>
                <View style={styles.channelInfo}>
                  <Text style={styles.channelName}>{channel.name}</Text>
                  <Text style={styles.channelDesc}>{channel.description}</Text>
                </View>
                <View style={styles.channelRight}>
                  <Text style={[styles.channelAmount, { color: channel.color }]}>
                    {balance.toLocaleString()} FCFA
                  </Text>
                  {isLoading ? (
                    <Text style={styles.channelLoading}>⏳ En cours...</Text>
                  ) : (
                    <Text style={styles.channelAction}>Retirer ↗</Text>
                  )}
                </View>
              </Pressable>
            );
          })}

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>⏰ Historique des gains</Text>
          <View style={styles.transactionsCard}>
            {TRANSACTIONS.map((tx, idx) => (
              <View key={tx.id} style={[styles.transactionRow, idx < TRANSACTIONS.length - 1 && styles.transactionBorder]}>
                <Text style={styles.txEmoji}>{tx.emoji}</Text>
                <View style={styles.txInfo}>
                  <Text style={styles.txType}>{tx.type}</Text>
                  <Text style={styles.txDate}>⏰ {tx.date}</Text>
                </View>
                <Text style={styles.txAmount}>+{tx.amount} FCFA</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </MobileFrame>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradientHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    backgroundColor: GREEN,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backBtn: { marginBottom: 16, alignSelf: 'flex-start' },
  backBtnText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700' },
  walletCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  walletDecor: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundColor: 'transparent',
  },
  walletTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  walletLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  walletIcon: { fontSize: 20, opacity: 0.6 },
  walletBalanceLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 },
  balanceAmount: { fontSize: 32, fontWeight: '900', color: '#FFFFFF' },
  balanceUnit: { fontSize: 16, fontWeight: '700', color: 'rgba(209,250,229,0.8)' },
  stepsContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepItem: { alignItems: 'center', gap: 4, flex: 1 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepCircleText: { fontSize: 10, fontWeight: '900', color: '#FFFFFF' },
  stepLabel: { fontSize: 7, fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' },
  walletFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  walletCardNum: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', letterSpacing: 1 },
  walletCountry: { fontSize: 12, fontWeight: '900', color: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  channelCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16,
    borderRadius: 16, borderWidth: 1, marginBottom: 12,
  },
  channelEmoji: { fontSize: 28 },
  channelInfo: { flex: 1 },
  channelName: { fontSize: 14, fontWeight: '900', color: CHARCOAL },
  channelDesc: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  channelRight: { alignItems: 'flex-end' },
  channelAmount: { fontSize: 14, fontWeight: '900' },
  channelLoading: { fontSize: 8, fontWeight: '700', color: '#94A3B8', marginTop: 4 },
  channelAction: { fontSize: 8, fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4 },
  transactionsCard: { backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
  transactionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  transactionBorder: { borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  txEmoji: { fontSize: 20 },
  txInfo: { flex: 1 },
  txType: { fontSize: 12, fontWeight: '700', color: CHARCOAL },
  txDate: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  txAmount: { fontSize: 12, fontWeight: '900', color: '#10b981' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successIcon: { fontSize: 52 },
  successTitle: { fontSize: 28, fontWeight: '900', color: CHARCOAL, textAlign: 'center' },
  successSub: { fontSize: 14, color: '#64748B', marginTop: 8, textAlign: 'center' },
  receiptCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, width: '100%', marginTop: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  receiptHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  receiptEmoji: { fontSize: 32 },
  receiptName: { fontSize: 16, fontWeight: '900', color: CHARCOAL },
  receiptSecure: { fontSize: 11, color: '#10b981', fontWeight: '700', marginTop: 2 },
  receiptDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  receiptLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  receiptValue: { fontSize: 12, fontWeight: '900', color: CHARCOAL, fontFamily: 'monospace' },
  receiptStatus: { fontSize: 10, fontWeight: '900', color: '#10b981' },
  txHashBox: { padding: 8, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  txHashDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  txHashText: { fontSize: 8, color: '#94A3B8', fontFamily: 'monospace' },
  backHomeBtn: { width: '100%', backgroundColor: GREEN, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
  backHomeBtnText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },
});

