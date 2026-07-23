/**
 * Nouvelle collecte — Formulaire de demande (Spec #13)
 *
 * Écran de formulaire pour planifier une collecte avec :
 * - En-tête vert foncé : flèche retour + "Nouvelle collecte"
 * - Carte résumé : type de déchet, poids, estimation
 * - Adresse de collecte (avec icône localisation + lien Modifier)
 * - Disponibilité : grille 2x2 de boutons pill (Aujourd'hui, Demain, Dans 2 jours, Choisir une date)
 * - Notes optionnelles (textarea)
 * - Bouton "Confirmer la demande"
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated as RNAnimated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
const BORDER_GRAY = '#D1D5DB';

type Availability = 'today' | 'tomorrow' | 'in2days' | 'pickdate' | null;

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

// ─── Écran Nouvelle collecte ────────────────────────────────────────
export default function NewRequestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedAvailability, setSelectedAvailability] = useState<Availability>('today');
  const [notes, setNotes] = useState('');

  const availabilityOptions: { key: Availability; label: string }[] = [
    { key: 'today', label: "Aujourd'hui" },
    { key: 'tomorrow', label: 'Demain' },
    { key: 'in2days', label: 'Dans 2 jours' },
    { key: 'pickdate', label: '📅 Choisir une date' },
  ];

  const handleConfirm = () => {
    router.push('/tracking' as any);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* ─── En-tête vert foncé ──────────────────────────────────── */}
        <View style={styles.header}>
          <AnimatedView delay={0} style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Nouvelle collecte</Text>
          </AnimatedView>
        </View>

        {/* ─── Corps blanc ─────────────────────────────────────────── */}
        <View style={styles.body}>
          {/* Carte résumé */}
          <AnimatedView delay={100}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryLeft}>
                <View style={styles.summaryIconBox}>
                  <Text style={styles.summaryIcon}>📦</Text>
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryTitle}>Plastique PET · 2-3 kg</Text>
                  <Text style={styles.summarySub}>Estimation : 300-600 FCFA</Text>
                </View>
              </View>
            </View>
          </AnimatedView>

          {/* Adresse de collecte */}
          <AnimatedView delay={150}>
            <Text style={styles.sectionLabel}>ADRESSE DE COLLECTE</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressLeft}>
                <View style={styles.addressIconBox}>
                  <Text style={styles.addressIcon}>📍</Text>
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressTitle}>Cocody Angré, Rue 27</Text>
                  <Text style={styles.addressSub}>Abidjan, Côte d'Ivoire</Text>
                </View>
              </View>
              <Pressable>
                <Text style={styles.addressEdit}>Modifier</Text>
              </Pressable>
            </View>
          </AnimatedView>

          {/* Disponibilité */}
          <AnimatedView delay={200}>
            <Text style={styles.sectionLabel}>DISPONIBILITÉ</Text>
            <View style={styles.availabilityGrid}>
              {availabilityOptions.map((option) => {
                const isSelected = selectedAvailability === option.key;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setSelectedAvailability(option.key)}
                    style={[
                      styles.availabilityPill,
                      isSelected ? styles.availabilityPillActive : styles.availabilityPillInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.availabilityText,
                        isSelected ? styles.availabilityTextActive : styles.availabilityTextInactive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </AnimatedView>

          {/* Notes optionnelles */}
          <AnimatedView delay={250}>
            <Text style={styles.sectionLabel}>NOTES (OPTIONNEL)</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Ex : Appelez avant de venir, entrée par le portail noir"
              placeholderTextColor="#9CA3AF"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </AnimatedView>

          {/* Bouton Confirmer */}
          <AnimatedView delay={300}>
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => [
                styles.confirmBtn,
                { opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={styles.confirmBtnIcon}>✓</Text>
              <Text style={styles.confirmBtnText}>Confirmer la demande</Text>
            </Pressable>
          </AnimatedView>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 18,
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

  // ── Section label ──
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_GRAY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 20,
  },

  // ── Carte résumé ──
  summaryCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E9F8EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  summaryIcon: {
    fontSize: 22,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  summarySub: {
    fontSize: 12,
    fontWeight: '400',
    color: TEXT_GRAY,
  },

  // ── Adresse ──
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E9F8EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressIcon: {
    fontSize: 18,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  addressSub: {
    fontSize: 11,
    fontWeight: '400',
    color: TEXT_GRAY,
  },
  addressEdit: {
    fontSize: 12,
    fontWeight: '600',
    color: GREEN_CTA,
    marginLeft: 8,
  },

  // ── Disponibilité ──
  availabilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  availabilityPill: {
    width: '47%',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityPillActive: {
    backgroundColor: '#E9F8EF',
    borderWidth: 1.5,
    borderColor: GREEN_CTA,
  },
  availabilityPillInactive: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  availabilityTextActive: {
    color: GREEN_CTA,
  },
  availabilityTextInactive: {
    color: TEXT_DARK,
  },

  // ── Textarea ──
  textarea: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    fontWeight: '400',
    color: TEXT_DARK,
    minHeight: 100,
    lineHeight: 20,
  },

  // ── Bouton Confirmer ──
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 999,
    backgroundColor: GREEN_CTA,
    marginTop: 28,
    shadowColor: GREEN_CTA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmBtnIcon: {
    fontSize: 18,
    color: WHITE,
    fontWeight: '700',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE,
  },
});

