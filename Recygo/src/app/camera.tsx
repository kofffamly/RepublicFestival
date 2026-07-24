/**
 * Scanner — RecyGo CI
 *
 * Écran de capture photo avec caméra réelle.
 * - Demande et vérifie les permissions caméra
 * - Affiche le flux caméra en direct
 * - Capture photo → compression → envoi à Gemini AI
 * - Affiche l'analyse ou les erreurs
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated as RNAnimated,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {
  compressImage,
  analyzeWasteImage,
  getBinColor,
  getBinLabel,
  getHazardLabel,
} from '@/services/wasteAnalysis';
import type { AnalyzeWasteResponse } from '@/services/wasteAnalysis';

// ─── Constantes ─────────────────────────────────────────────────────
const ORANGE = '#E67E22';
const EMERALD = '#34D399';
const GREEN_CTA = '#2ECC71';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_GRAY = '#6B7280';

type ScanState = 'idle' | 'permission_denied' | 'camera' | 'capturing' | 'analyzing' | 'success' | 'error';
type CameraMode = 'auto' | 'manual';

// ─── Composants d'animation ────────────────────────────────────────

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

// ─── Écran de résultat (intégré) ────────────────────────────────────
function AnalysisResult({ result, onRescan, onClose }: {
  result: AnalyzeWasteResponse;
  onRescan: () => void;
  onClose: () => void;
}) {
  const data = result.data;
  if (!data) return null;

  return (
    <View style={styles.resultOverlay}>
      <View style={styles.resultContainer}>
        {/* Header */}
        <View style={styles.resultHeader}>
          <Pressable onPress={onClose} style={styles.resultCloseBtn}>
            <Text style={styles.resultCloseText}>✕</Text>
          </Pressable>
          <Text style={styles.resultTitle}>Résultat IA</Text>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceIcon}>✓</Text>
            <Text style={styles.confidenceText}>{data.confidence}%</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.resultContent}>
          {/* Waste Icon & Type */}
          <View style={styles.resultIconBox}>
            {data.recyclable ? (
              <Text style={styles.resultIcon}>♻️</Text>
            ) : (
              <Text style={styles.resultIcon}>🗑️</Text>
            )}
          </View>
          <Text style={styles.resultWasteType}>{data.wasteType}</Text>
          <Text style={styles.resultCategory}>{data.category}</Text>

          {/* Confidence bar */}
          <View style={styles.confidenceBarOuter}>
            <View style={[styles.confidenceBarInner, { width: `${data.confidence}%` }]} />
          </View>
          <Text style={styles.confidenceLabel}>Confiance: {data.confidence}%</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.descriptionText}>{data.description}</Text>

          {/* Recycling Info */}
          <View style={styles.infoRow}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeLabel}>Recyclable</Text>
              <Text style={[styles.infoBadgeValue, { color: data.recyclable ? '#22C55E' : '#EF4444' }]}>
                {data.recyclable ? 'Oui' : 'Non'}
              </Text>
            </View>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeLabel}>Bac conseillé</Text>
              <View style={[styles.binColorDot, { backgroundColor: getBinColor(data.binType) }]} />
              <Text style={styles.infoBadgeValue}>{getBinLabel(data.binType)}</Text>
            </View>
          </View>

          {/* Instructions de tri */}
          <Text style={styles.sectionLabel}>Consignes de tri</Text>
          <Text style={styles.instructionsText}>{data.recyclingInstructions}</Text>

          {/* Impact */}
          <View style={styles.impactRow}>
            <View style={styles.impactCard}>
              <Text style={styles.impactIcon}>🌱</Text>
              <Text style={styles.impactLabel}>Valeur estimée</Text>
              <Text style={styles.impactValue}>{data.estimatedValueMin}–{data.estimatedValueMax} F</Text>
            </View>
            <View style={styles.impactCard}>
              <Text style={styles.impactIcon}>⚡</Text>
              <Text style={styles.impactLabel}>Poids estimé</Text>
              <Text style={styles.impactValue}>{data.estimatedWeight} kg</Text>
            </View>
          </View>

          {/* Recommendation */}
          <Text style={styles.sectionLabel}>Recommandation</Text>
          <Text style={styles.recommendationText}>{data.recommendation}</Text>

          {/* Hazard */}
          <View style={styles.hazardRow}>
            <Text style={styles.hazardLabel}>Niveau de danger:</Text>
            <Text style={[styles.hazardValue, {
              color: data.hazardLevel === 'none' ? '#22C55E' :
                     data.hazardLevel === 'low' ? '#EAB308' :
                     data.hazardLevel === 'moderate' ? '#F97316' : '#EF4444'
            }]}>
              {getHazardLabel(data.hazardLevel)}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.resultActions}>
          <Pressable onPress={onRescan} style={styles.rescanBtn}>
            <Text style={styles.rescanBtnText}>Rescanner</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Écran principal ────────────────────────────────────────────────
export default function Camera() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [activeTab, setActiveTab] = useState<CameraMode>('auto');
  const [flash, setFlash] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeWasteResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // ─── Gestion des permissions ─────────────────────────────────────
  useEffect(() => {
    if (permission === null) {
      requestPermission();
    } else if (!permission.granted) {
      setScanState('permission_denied');
    } else {
      setScanState('camera');
    }
  }, [permission]);

  // ─── Capture photo et analyse ────────────────────────────────────
  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || analyzing) return;

    try {
      setAnalyzing(true);
      setScanState('capturing');

      // Prendre la photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo?.uri) {
        throw new Error('Échec de la capture photo');
      }

      setCapturedUri(photo.uri);

      // Compresser l'image
      setScanState('analyzing');
      const compressed = await compressImage(photo.uri, 1024, 1024, 0.7);

      if (!compressed.base64) {
        throw new Error('Échec de la compression de l\'image');
      }

      // Envoyer à l'IA
      const result = await analyzeWasteImage(compressed.base64, compressed.mimeType);

      if (result.success && result.data) {
        setAnalysisResult(result);
        setScanState('success');
      } else {
        setErrorMessage(result.error?.message || 'Analyse impossible');
        setScanState('error');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erreur inattendue';
      setErrorMessage(msg);
      setScanState('error');
    } finally {
      setAnalyzing(false);
    }
  }, [analyzing]);

  // ─── Fallback web: image picker ──────────────────────────────────
  const handleWebPickImage = useCallback(async () => {
    if (analyzing) return;

    try {
      setAnalyzing(true);
      setScanState('capturing');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled || !result.assets[0]) {
        setAnalyzing(false);
        setScanState('camera');
        return;
      }

      const asset = result.assets[0];
      setCapturedUri(asset.uri);

      setScanState('analyzing');
      const compressed = await compressImage(asset.uri, 1024, 1024, 0.7);

      if (!compressed.base64) {
        throw new Error('Échec de la compression de l\'image');
      }

      const analysis = await analyzeWasteImage(compressed.base64, compressed.mimeType);

      if (analysis.success && analysis.data) {
        setAnalysisResult(analysis);
        setScanState('success');
      } else {
        setErrorMessage(analysis.error?.message || 'Analyse impossible');
        setScanState('error');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erreur inattendue';
      setErrorMessage(msg);
      setScanState('error');
    } finally {
      setAnalyzing(false);
    }
  }, [analyzing]);

  // ─── Reset scanner ───────────────────────────────────────────────
  const handleRescan = useCallback(() => {
    setAnalysisResult(null);
    setCapturedUri(null);
    setErrorMessage('');
    setAnalyzing(false);
    setScanState('camera');
  }, []);

  // ─── Permission refusée ──────────────────────────────────────────
  if (scanState === 'permission_denied') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Accès caméra requis</Text>
          <Text style={styles.permissionText}>
            RecyGo a besoin d'accéder à votre caméra pour scanner et analyser vos déchets.
          </Text>
          <Pressable
            onPress={() => {
              Alert.alert(
                'Autorisation requise',
                'Veuillez autoriser l\'accès à la caméra dans les paramètres de votre appareil.',
                [{ text: 'OK' }]
              );
            }}
            style={styles.permissionBtn}
          >
            <Text style={styles.permissionBtnText}>Comment autoriser ?</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.permissionBackBtn}>
            <Text style={styles.permissionBackText}>Retour</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── Écran d'analyse en cours ────────────────────────────────────
  if (scanState === 'analyzing') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="large" color={GREEN_CTA} />
          <Text style={styles.analyzingTitle}>Analyse en cours...</Text>
          <Text style={styles.analyzingSubtitle}>
            L'IA Gemini analyse votre déchet
          </Text>
          {capturedUri && (
            <Image source={{ uri: capturedUri }} style={styles.analyzingPreview} />
          )}
          <View style={styles.analyzingDots}>
            <View style={[styles.dot, { backgroundColor: GREEN_CTA }]} />
            <View style={[styles.dot, { backgroundColor: GREEN_CTA, opacity: 0.6 }]} />
            <View style={[styles.dot, { backgroundColor: GREEN_CTA, opacity: 0.3 }]} />
          </View>
        </View>
      </View>
    );
  }

  // ─── Résultat affiché ────────────────────────────────────────────
  if (scanState === 'success' && analysisResult) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <AnalysisResult
          result={analysisResult}
          onRescan={handleRescan}
          onClose={() => router.back()}
        />
      </View>
    );
  }

  // ─── Écran d'erreur ──────────────────────────────────────────────
  if (scanState === 'error') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Analyse impossible</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable onPress={handleRescan} style={styles.errorRetryBtn}>
            <Text style={styles.errorRetryText}>Réessayer</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.errorBackBtn}>
            <Text style={styles.errorBackText}>Retour</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── Afficher l'écran caméra par défaut ──────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ViewFinder avec caméra réelle */}
      <View style={styles.viewfinder}>
        {Platform.OS === 'web' ? (
          // Fallback web: fond avec bouton pour choisir une image
          <View style={styles.webFallback}>
            <Text style={styles.webFallbackIcon}>📷</Text>
            <Text style={styles.webFallbackText}>
              Sur le Web, veuillez sélectionner une image depuis votre appareil
            </Text>
          </View>
        ) : (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            flash={flash ? 'on' : 'off'}
          >
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
          </CameraView>
        )}

        {/* Top Controls */}
        <View style={styles.topControls}>
          <AnimatedPressable onPress={() => router.back()} style={styles.topBtn}>
            <Text style={styles.topBtnText}>←</Text>
          </AnimatedPressable>

          <View style={styles.aiBadge}>
            <View style={styles.aiDot} />
            <Text style={styles.aiText}>Objectif IA</Text>
          </View>

          {Platform.OS !== 'web' && (
            <AnimatedPressable
              onPress={() => setFlash((f) => !f)}
              style={[styles.topBtn, flash && styles.flashActive]}
            >
              <Text style={styles.topBtnText}>⚡</Text>
            </AnimatedPressable>
          )}
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
          <AnimatedPressable
            onPress={Platform.OS === 'web' ? handleWebPickImage : handleCapture}
            style={styles.shutterOuter}
          >
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

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F' },
  viewfinder: { flex: 1, position: 'relative', overflow: 'hidden' },
  camera: { flex: 1 },
  webFallback: { flex: 1, backgroundColor: '#0D121A', alignItems: 'center', justifyContent: 'center', padding: 32 },
  webFallbackIcon: { fontSize: 64, marginBottom: 16 },
  webFallbackText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
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

  // Permission denied
  permissionContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#090A0F' },
  permissionIcon: { fontSize: 64, marginBottom: 16 },
  permissionTitle: { fontSize: 20, fontWeight: '700', color: WHITE, marginBottom: 8 },
  permissionText: { fontSize: 14, color: TEXT_GRAY, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  permissionBtn: { backgroundColor: GREEN_CTA, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 999, marginBottom: 12 },
  permissionBtnText: { fontSize: 14, fontWeight: '700', color: WHITE },
  permissionBackBtn: { padding: 12 },
  permissionBackText: { fontSize: 14, color: TEXT_GRAY },

  // Analyzing
  analyzingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#090A0F', padding: 32 },
  analyzingTitle: { fontSize: 18, fontWeight: '700', color: WHITE, marginTop: 20, marginBottom: 8 },
  analyzingSubtitle: { fontSize: 14, color: TEXT_GRAY, textAlign: 'center', marginBottom: 24 },
  analyzingPreview: { width: 120, height: 120, borderRadius: 16, marginBottom: 24 },
  analyzingDots: { flexDirection: 'row', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },

  // Error
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#090A0F' },
  errorIcon: { fontSize: 64, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: WHITE, marginBottom: 8 },
  errorText: { fontSize: 14, color: TEXT_GRAY, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  errorRetryBtn: { backgroundColor: GREEN_CTA, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 999, marginBottom: 12 },
  errorRetryText: { fontSize: 14, fontWeight: '700', color: WHITE },
  errorBackBtn: { padding: 12 },
  errorBackText: { fontSize: 14, color: TEXT_GRAY },

  // Result overlay
  resultOverlay: { flex: 1, backgroundColor: '#090A0F' },
  resultContainer: { flex: 1, margin: 16, marginTop: 0, backgroundColor: '#F8FAFC', borderRadius: 24, overflow: 'hidden' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#0F5C34' },
  resultCloseBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultCloseText: { fontSize: 14, fontWeight: '700', color: WHITE },
  resultTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: WHITE },
  confidenceBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.15)' },
  confidenceIcon: { fontSize: 10, color: WHITE, fontWeight: '700' },
  confidenceText: { fontSize: 10, fontWeight: '600', color: WHITE },
  resultContent: { flex: 1, padding: 20 },
  resultIconBox: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#E9F8EF', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 },
  resultIcon: { fontSize: 32 },
  resultWasteType: { fontSize: 20, fontWeight: '700', color: TEXT_DARK, textAlign: 'center', marginBottom: 4 },
  resultCategory: { fontSize: 13, fontWeight: '400', color: TEXT_GRAY, textAlign: 'center', marginBottom: 12 },
  confidenceBarOuter: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 4 },
  confidenceBarInner: { height: 6, backgroundColor: GREEN_CTA, borderRadius: 3 },
  confidenceLabel: { fontSize: 11, fontWeight: '500', color: TEXT_GRAY, textAlign: 'center', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: TEXT_DARK, marginBottom: 6, marginTop: 4 },
  descriptionText: { fontSize: 13, fontWeight: '400', color: '#4B5563', lineHeight: 18, marginBottom: 16 },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  infoBadge: { flex: 1, backgroundColor: WHITE, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  infoBadgeLabel: { fontSize: 10, fontWeight: '500', color: TEXT_GRAY, marginBottom: 4 },
  infoBadgeValue: { fontSize: 13, fontWeight: '700', color: TEXT_DARK },
  binColorDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 4 },
  instructionsText: { fontSize: 13, fontWeight: '400', color: '#4B5563', lineHeight: 18, marginBottom: 16 },
  impactRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  impactCard: { flex: 1, backgroundColor: '#F0FDF4', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#DCFCE7' },
  impactIcon: { fontSize: 20, marginBottom: 4 },
  impactLabel: { fontSize: 10, fontWeight: '500', color: TEXT_GRAY, marginBottom: 4 },
  impactValue: { fontSize: 16, fontWeight: '700', color: GREEN_CTA },
  recommendationText: { fontSize: 13, fontWeight: '400', color: '#4B5563', lineHeight: 18, marginBottom: 12 },
  hazardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  hazardLabel: { fontSize: 12, fontWeight: '500', color: TEXT_GRAY },
  hazardValue: { fontSize: 13, fontWeight: '700' },
  resultActions: { padding: 20, paddingTop: 0 },
  rescanBtn: { height: 48, borderRadius: 999, backgroundColor: GREEN_CTA, alignItems: 'center', justifyContent: 'center' },
  rescanBtnText: { fontSize: 14, fontWeight: '700', color: WHITE },
});

