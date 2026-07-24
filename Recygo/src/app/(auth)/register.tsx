  /**
 * Inscription — "Créer un compte" — RecyGo CI
 *
 * Écran d'inscription avec :
 * - Bandeau supérieur vert foncé dégradé (~20% hauteur), arrondi en bas
 *   - Flèche retour blanche en haut à gauche
 *   - Titre "Créer un compte" blanc (22px, gras)
 *   - Sous-titre "Rejoignez la communauté RecyGo CI" vert clair (13px)
 * - Formulaire sur fond blanc :
 *   - 4 champs avec label gris majuscule + icône à gauche :
 *     1. "NOM COMPLET" — icône personne — placeholder "Aya Kouassi"
 *     2. "TÉLÉPHONE" — icône téléphone — placeholder "+225 07 XX XX XX XX"
 *     3. "E-MAIL" — icône enveloppe — placeholder "aya@example.com"
 *     4. "MOT DE PASSE" — icône cadenas — placeholder masqué + œil toggle
 *   - Bouton "Créer mon compte" vert (#2ECC71), pill, largeur complète
 *   - Texte conditions : "En créant un compte, vous acceptez nos Conditions d'utilisation
 *     et notre Politique de confidentialité" (liens en vert/gras)
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated as RNAnimated,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, UserRole } from '@/context/AppContext';

// ─── Constantes de design ───────────────────────────────────────────
const GREEN_DARK = '#0F5C34';
const GREEN_MID = '#1E7A46';
const GREEN_CTA = '#2ECC71';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#6B7280';
const BORDER_GRAY = '#D1D5DB';
const INPUT_BG = '#F9FAFB';

// ─── Composant d'animation ──────────────────────────────────────────
function AnimatedView({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(24)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      RNAnimated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 60,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <RNAnimated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </RNAnimated.View>
  );
}

// ─── Composant de champ de formulaire ──────────────────────────────
interface FormFieldProps {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  editable?: boolean;
  delay: number;
}

function FormField({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  showToggle,
  onToggle,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  editable = true,
  delay,
}: FormFieldProps) {
  return (
    <AnimatedView delay={delay}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>{icon}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry && !showToggle}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            maxLength={maxLength}
            editable={editable}
          />
          {showToggle !== undefined && onToggle && (
            <Pressable onPress={onToggle} style={styles.eyeButton}>
              <Text style={styles.eyeIcon}>
                {showToggle ? '👁️' : '👁️‍🗨️'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </AnimatedView>
  );
}

// ─── Écran d'inscription ────────────────────────────────────────────
export default function Register() {
  const router = useRouter();
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const { register } = useApp();
  const insets = useSafeAreaInsets();

  // États des champs
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // États UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const role = (roleParam as UserRole) || 'citizen';

  // ── Formatage téléphone ───────────────────────────────────────────
  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setPhone(digits);
  };

  // ── Soumission ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!fullName.trim()) {
      setError('Veuillez entrer votre nom complet');
      return;
    }
    if (phone.length < 10) {
      setError('Veuillez entrer un numéro de téléphone valide (10 chiffres)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez entrer une adresse e-mail valide');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Formatage du téléphone avec le préfixe Côte d'Ivoire
      const formattedPhone = `+225 ${phone}`;

      // Inscription réelle via Firebase Auth + Firestore
      await register(email.trim(), password, fullName.trim(), role, formattedPhone);

      router.replace('/(tabs)/home');
    } catch (e: unknown) {
      // L'erreur est déjà gérée dans le contexte (setError)
      // Récupère le message d'erreur du contexte
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* ─── Bandeau supérieur ───────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerGradient} />

          {/* Flèche retour */}
          <AnimatedView delay={0} style={styles.headerTopRow}>
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
          </AnimatedView>

          {/* Titres du bandeau */}
          <AnimatedView delay={100} style={styles.headerTextSection}>
            <Text style={styles.headerTitle}>Créer un compte</Text>
            <Text style={styles.headerSubtitle}>
              Rejoignez la communauté RecyGo CI
            </Text>
          </AnimatedView>
        </View>

        {/* ─── Formulaire ──────────────────────────────────────────── */}
        <View style={styles.formContainer}>
          {/* Champ 1 : Nom complet */}
          <FormField
            label="NOM COMPLET"
            icon="👤"
            placeholder="Aya Kouassi"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            editable={!isLoading}
            delay={150}
          />

          {/* Champ 2 : Téléphone */}
          <FormField
            label="TÉLÉPHONE"
            icon="📞"
            placeholder="+225 07 XX XX XX XX"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={10}
            editable={!isLoading}
            delay={200}
          />

          {/* Champ 3 : E-mail */}
          <FormField
            label="E-MAIL"
            icon="✉️"
            placeholder="aya@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isLoading}
            delay={250}
          />

          {/* Champ 4 : Mot de passe */}
          <FormField
            label="MOT DE PASSE"
            icon="🔒"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            showToggle={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            editable={!isLoading}
            delay={300}
          />

          {/* Message d'erreur */}
          {error ? (
            <AnimatedView delay={100}>
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            </AnimatedView>
          ) : null}

          {/* Bouton Créer mon compte */}
          <AnimatedView delay={350}>
            <Pressable
              onPress={handleSubmit}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.submitButton,
                {
                  opacity: isLoading ? 0.7 : pressed ? 0.9 : 1,
                  transform: [{ scale: pressed && !isLoading ? 0.98 : 1 }],
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={WHITE} />
              ) : (
                <Text style={styles.submitText}>Créer mon compte</Text>
              )}
            </Pressable>
          </AnimatedView>

          {/* Conditions d'utilisation */}
          <AnimatedView delay={400}>
            <Text style={styles.termsText}>
              En créant un compte, vous acceptez nos{' '}
              <Text style={styles.termsLink}>Conditions d'utilisation</Text> et
              notre <Text style={styles.termsLink}>Politique de confidentialité</Text>
            </Text>
          </AnimatedView>

          {/* Lien vers connexion */}
          <AnimatedView delay={450}>
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Déjà un compte ? </Text>
              <Pressable
                onPress={() => router.push(`/(auth)/login?role=${role}`)}
              >
                <Text style={styles.footerLink}>Se connecter</Text>
              </Pressable>
            </View>
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
    backgroundColor: WHITE,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── Bandeau supérieur ──
  header: {
    height: 200,
    backgroundColor: GREEN_MID,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GREEN_DARK,
    opacity: 0.25,
  },
  headerTopRow: {
    marginBottom: 8,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  backArrow: {
    fontSize: 20,
    color: WHITE,
    fontWeight: '700',
  },
  headerTextSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: WHITE,
    textAlign: 'center',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  // ── Formulaire ──
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_GRAY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: TEXT_DARK,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
  },
  eyeIcon: {
    fontSize: 16,
    opacity: 0.6,
  },

  // ── Erreur ──
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },

  // ── Bouton Créer mon compte ──
  submitButton: {
    width: '100%',
    height: 52,
    borderRadius: 999,
    backgroundColor: GREEN_CTA,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: GREEN_CTA,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE,
  },

  // ── Conditions ──
  termsText: {
    fontSize: 12,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 20,
    paddingHorizontal: 8,
  },
  termsLink: {
    fontWeight: '700',
    color: GREEN_CTA,
  },

  // ── Footer ──
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: TEXT_GRAY,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: GREEN_CTA,
  },
});
