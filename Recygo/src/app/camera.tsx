import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ORANGE = '#E67E22';
const EMERALD = '#34D399';

function AnimatedPressable({ onPress, children, style }: { onPress?: () => void; children: React.ReactNode; style?: any }) {
  const scale = useRef(new RNAnimated.Value(1)).current;
  const hp = () => RNAnimated.spring(scale, { toValue: 0.9, friction: 8, tension: 100, useNativeDriver: true }).start();
  const hpr = () => RNAnimated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();
  return (
    <RNAnimated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={hp} onPressOut={hpr}>{children}</Pressable>
    </RNAnimated.View>
  );
}

function PulseCorner({ style: s }: { style: any }) {
  const op = useRef(new RNAnimated.Value(1)).current;
  useEffect(() => {
    const p = RNAnimated.loop(RNAnimated.sequence([
      RNAnimated.timing(op, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
      RNAnimated.timing(op, { toValue: 1, duration: 1200, useNativeDriver: true }),
    ]));
    p.start();
    return () => p.stop();
  }, []);
  return <RNAnimated.View style={[{ opacity: op }, s]} />;
}

function ScanLine() {
  const ty = useRef(new RNAnimated.Value(4)).current;
  useEffect(() => {
    const a = RNAnimated.loop(RNAnimated.sequence([
      RNAnimated.timing(ty, { toValue: 226, duration: 2000, useNativeDriver: true }),
      RNAnimated.timing(ty, { toValue: 4, duration: 2000, useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, []);
  return (
    <RNAnimated.View style={{
      position: 'absolute', left: 4, right: 4, height: 3,
      backgroundColor: EMERALD, shadowColor: EMERALD,
      shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4,
      transform: [{ translateY: ty }],
    }} />
  );
}

function PulseDot() {
  const s = useRef(new RNAnimated.Value(1)).current;
  useEffect(() => {
    const p = RNAnimated.loop(RNAnimated.sequence([
      RNAnimated.timing(s, { toValue: 1.5, duration: 1500, useNativeDriver: true }),
      RNAnimated.timing(s, { toValue: 1, duration: 1500, useNativeDriver: true }),
    ]));
    p.start();
    return () => p.stop();
  }, []);
  return (
    <RNAnimated.View
      style={{
        position: 'absolute', width: 64, height: 64, borderRadius: 32,
        borderWidth: 1, borderColor: 'rgba(52,211,153,0.3)',
        alignItems: 'center', justifyContent: 'center', transform: [{ scale: s }],
      }}
    />
  );
}

function FocusDot() {
  return (
    <View
      style={{
        width: 8, height: 8, borderRadius: 4, backgroundColor: EMERALD,
        shadowColor: EMERALD, shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8, shadowRadius: 8, elevation: 4, position: 'absolute',
      }}
    />
  );
}

function CaptureFlash({ visible }: { visible: boolean }) {
  const op = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      RNAnimated.sequence([
        RNAnimated.timing(op, { toValue: 1, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(op, { toValue: 1, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(op, { toValue: 0, duration: 480, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);
  return (
    <RNAnimated.View
      style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        backgroundColor: '#FFFFFF', zIndex: 50, opacity: op,
      }}
      pointerEvents="none"
    />
  );
}

function CaptureShutter({ visible }: { visible: boolean }) {
  const scaleY = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      RNAnimated.sequence([
        RNAnimated.timing(scaleY, { toValue: 1, duration: 200, useNativeDriver: true }),
        RNAnimated.timing(scaleY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);
  return (
    <RNAnimated.View
      style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        backgroundColor: '#000', zIndex: 40, transform: [{ scaleY }],
      }}
      pointerEvents="none"
    />
  );
}

export default function Camera() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');

  const handleCapture = () => {
    setCaptured(true);
    setTimeout(() => {
      router.replace('/analyse');
    }, 700);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#090A0F" />

      {/* ViewFinder */}
      <View style={styles.viewfinder}>
        {/* Background */}
        <View style={styles.camBg} />

        {/* 3x3 Grid */}
        <View style={styles.gridOverlay} pointerEvents="none">
          {[0, 1, 2].map((row) => (
            <View key={row} style={styles.gridRow}>
              {[0, 1, 2].map((col) => (
                <View key={col} style={styles.gridCell} />
              ))}
            </View>
          ))}
        </View>

        {/* Top Controls */}
        <View style={styles.topControls}>
          <AnimatedPressable onPress={() => router.back()} style={styles.topBtn}>
            <Text style={styles.topBtnText}>←</Text>
          </AnimatedPressable>

          <View style={styles.aiBadge}>
            <View style={styles.aiDot} />
            <Text style={styles.aiText}>Objectif IA</Text>
          </View>

          <AnimatedPressable
            onPress={() => setFlash((f) => !f)}
            style={[styles.topBtn, flash && styles.flashActive]}
          >
            <Text style={styles.topBtnText}>⚡</Text>
          </AnimatedPressable>
        </View>

        {/* AI Focus Reticle */}
        <View style={styles.reticle} pointerEvents="none">
          <PulseCorner style={styles.cornerTL} />
          <PulseCorner style={styles.cornerTR} />
          <PulseCorner style={styles.cornerBL} />
          <PulseCorner style={styles.cornerBR} />
          <ScanLine />
          <PulseDot />
          <FocusDot />
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsBadge}>
            <Text style={styles.tipsText}>♻️ Cadre ton déchet</Text>
            <Text style={styles.tipsSub}>Plastique, carton ou canette</Text>
          </View>
        </View>

        {/* Capture flash/shutter effects */}
        <CaptureFlash visible={captured} />
        <CaptureShutter visible={captured} />
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomBar}>
        {/* Mode Tabs */}
        <View style={styles.modeRow}>
          <Pressable onPress={() => setActiveTab('auto')}>
            <Text style={[styles.modeText, activeTab === 'auto' && { color: ORANGE }]}>Détection IA</Text>
          </Pressable>
          <Pressable onPress={() => setActiveTab('manual')}>
            <Text style={[styles.modeText, activeTab === 'manual' && { color: ORANGE }]}>Photo simple</Text>
          </Pressable>
        </View>

        {/* Shutter */}
        <View style={styles.shutterRow}>
          <AnimatedPressable style={styles.sideBtn}>
            <Text style={styles.sideBtnIcon}>🖼️</Text>
          </AnimatedPressable>
          <AnimatedPressable onPress={handleCapture} style={styles.shutterOuter}>
            <View style={styles.shutterInner}>
              <View style={styles.shutterCenter} />
            </View>
          </AnimatedPressable>
          <AnimatedPressable style={styles.sideBtn}>
            <Text style={styles.sideBtnIcon}>🔄</Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F' },
  viewfinder: { flex: 1, position: 'relative', overflow: 'hidden' },
  camBg: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#0D121A', opacity: 0.8 },
  gridOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 10 },
  gridRow: { flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  gridCell: { flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)' },
  topControls: { position: 'absolute', top: 8, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 30 },
  topBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  topBtnText: { fontSize: 20, color: '#FFFFFF' },
  flashActive: { backgroundColor: `${ORANGE}dd`, borderColor: ORANGE },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  aiDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DC2626' },
  aiText: { fontSize: 10, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },
  reticle: { position: 'absolute', top: '50%', left: '50%', width: 230, height: 230, marginLeft: -115, marginTop: -115, zIndex: 20, alignItems: 'center', justifyContent: 'center' },
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 32, height: 32, borderTopWidth: 4, borderLeftWidth: 4, borderColor: EMERALD, borderTopLeftRadius: 12 },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 32, height: 32, borderTopWidth: 4, borderRightWidth: 4, borderColor: EMERALD, borderTopRightRadius: 12 },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 32, height: 32, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: EMERALD, borderBottomLeftRadius: 12 },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderBottomWidth: 4, borderRightWidth: 4, borderColor: EMERALD, borderBottomRightRadius: 12 },
  tipsContainer: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center', zIndex: 30 },
  tipsBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  tipsText: { fontSize: 12, fontWeight: '900', color: 'rgba(255,255,255,0.9)' },
  tipsSub: { fontSize: 10, fontWeight: '600', color: '#94A3B8' },
  bottomBar: { backgroundColor: '#000000', paddingBottom: 32 },
  modeRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  modeText: { fontSize: 11, fontWeight: '900', color: '#555555', textTransform: 'uppercase', letterSpacing: 1 },
  shutterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32, paddingTop: 20 },
  sideBtn: { width: 50, height: 50, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  sideBtnIcon: { fontSize: 20 },
  shutterOuter: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#FFFFFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 24, elevation: 8, borderWidth: 4, borderColor: '#000' },
  shutterInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  shutterCenter: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFFFFF', opacity: 0.45 },
});

