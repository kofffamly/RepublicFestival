/**
 * Connexion — RecyGo CI
 *
 * Écran de connexion avec :
 * - Bandeau supérieur vert foncé dégradé (~25% hauteur), arrondi en bas
 *   - Icône recyclage blanche + "RecyGo CI" (13px)
 *   - Titre "Bon retour ! 👋" blanc (24px, gras)
 *   - Sous-titre "Connectez-vous pour continuer" vert clair (13px)
 * - Formulaire sur fond blanc :
 *   - Label "E-MAIL OU TÉLÉPHONE" (11px, majuscules, gris)
 *   - Input arrondi (radius 12px), bordure grise fine, placeholder
 *   - Label "MOT DE PASSE"
 *   - Input avec icône cadenas, œil toggle, placeholder masqué
 *   - Lien "Mot de passe oublié ?" vert aligné droite (12px)
 *   - Bouton plein largeur vert (#2ECC71), pill, "Se connecter" (52px)
 *   - Séparateur "ou" avec lignes
 *   - Bouton "Continuer avec Google" (bordure grise, fond blanc)
 *   - Footer: "Pas encore de compte ? S'inscrire" (lien vert)
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
import { useApp, Role } from '@/context/AppContext';
import { MobileFrame } from '@/components/MobileFrame';

// ─── Constantes de design ───────────────────────────────────────────
const GREEN_DARK = '#0F5C34';
const GREEN_MID = '#1E7A46';
const GREEN_CTA = '#2ECC71';
const GREEN_LIGHT = '#2ECC71';
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

// ─── Écran de connexion ─────────────────────────────────────────────
export default function Login() {
  const router = useRouter();
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const { login, setRole } = useApp();
  const insets = useSafeAreaInsets();

  // États
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Connexion mock ────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!identifier.trim()) {
      setError('Veuillez entrer votre e-mail ou téléphone');
      return;
    }
    if (!password.trim()) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simule une latence réseau
    setTimeout(() => {
      const role = (roleParam as Role) || 'citizen';
      const mockUser = {
        name: role === 'citizen' ? 'Aya Kouassi' : "Recycleur Pro Côte d'Ivoire",
        phone: identifier,
        role,
      };
      login(mockUser);
      setRole(role);
      setIsLoading(false);
      router.replace('/(tabs)/home');
    }, 1200);
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
          {/* Dégradé */}
          <View style={styles.headerGradient} />

          <AnimatedView delay={0} style={styles.headerTopRow}>
            <View style={styles.headerBrandRow}>
              <Text style={styles.headerBrandIcon}>♻️</Text>
              <Text style={styles.headerBrandName}>RecyGo CI</Text>
            </View>
          </AnimatedView>

          <AnimatedView delay={100} style={styles.headerTextSection}>
            <Text style={styles.headerTitle}>Bon retour ! 👋</Text>
            <Text style={styles.headerSubtitle}>
              Connectez-vous pour continuer
            </Text>
          </AnimatedView>
        </View>

        {/* ─── Formulaire ──────────────────────────────────────────── */}
        <View style={styles.formContainer}>
          {/* Champ E-mail ou Téléphone */}
          <AnimatedView delay={150}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-MAIL OU TÉLÉPHONE</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.input}
                  placeholder="aya.kouassi@example.com"
                  placeholderTextColor="#9CA3AF"
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>
          </AnimatedView>

          {/* Champ Mot de passe */}
          <AnimatedView delay={200}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>MOT DE PASSE</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </AnimatedView>

          {/* Mot de passe oublié */}
          <AnimatedView delay={250}>
            <Pressable style={styles.forgotRow}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </Pressable>
          </AnimatedView>

          {/* Message d'erreur */}
          {error ? (
            <AnimatedView delay={100}>
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            </AnimatedView>
          ) : null}

          {/* Bouton Se connecter */}
          <AnimatedView delay={300}>
            <Pressable
              onPress={handleLogin}
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
                <Text style={styles.submitText}>Se connecter</Text>
              )}
            </Pressable>
          </AnimatedView>

          {/* Séparateur */}
          <AnimatedView delay={350}>
            <View style={styles.separatorRow}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>
          </AnimatedView>

          {/* Bouton Google */}
          <AnimatedView delay={400}>
            <Pressable
              style={({ pressed }) => [
                styles.googleButton,
                { opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleText}>Continuer avec Google</Text>
            </Pressable>
          </AnimatedView>

          {/* Footer : inscription */}
          <AnimatedView delay={450}>
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Pas encore de compte ? </Text>
              <Pressable
                onPress={() =>
                  router.push(
                    `/(auth)/register?role=${roleParam || 'citizen'}`
                  )
                }
              >
                <Text style={styles.footerLink}>S'inscrire</Text>
              </Pressable>
            </View>
          </AnimatedView>

          {/* Espace de sécurité */}
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
    height: 260,
    backgroundColor: GREEN_MID,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 16,
    justifyContent: 'flex-start',
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
    alignItems: 'center',
    marginBottom: 16,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerBrandIcon: {
    fontSize: 16,
    color: WHITE,
  },
  headerBrandName: {
    fontSize: 13,
    fontWeight: '600',
    color: WHITE,
    opacity: 0.9,
  },
  headerTextSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: WHITE,
    textAlign: 'center',
    marginBottom: 8,
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
    marginBottom: 20,
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

  // ── Mot de passe oublié ──
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
    color: GREEN_CTA,
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

  // ── Bouton Se connecter ──
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

  // ── Séparateur ──
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    fontSize: 12,
    fontWeight: '500',
    color: TEXT_GRAY,
  },

  // ── Bouton Google ──
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: 50,
    borderRadius: 999,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },
  googleText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_DARK,
  },

  // ── Footer ──
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
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

