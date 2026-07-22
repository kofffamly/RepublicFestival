import { useState, useRef, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, Animated as RNAnimated, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, Role } from '@/context/AppContext';
import { MobileFrame } from '@/components/MobileFrame';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

function AnimatedView({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(30)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      RNAnimated.spring(translateY, { toValue: 0, friction: 8, tension: 60, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <RNAnimated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </RNAnimated.View>
  );
}

function ShakeView({ children, triggerKey, style }: { children: React.ReactNode; triggerKey: number; style?: any }) {
  const shakeAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    if (triggerKey > 0) {
      RNAnimated.sequence([
        RNAnimated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: -5, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: 5, duration: 60, useNativeDriver: true }),
        RNAnimated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [triggerKey]);

  return (
    <RNAnimated.View style={[{ transform: [{ translateX: shakeAnim }] }, style]}>
      {children}
    </RNAnimated.View>
  );
}

export default function Login() {
  const router = useRouter();
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const { login, setRole } = useApp();
  const role = (roleParam || 'citizen') as Role;
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(0);

  const accent = role === 'citizen' ? GREEN : CHARCOAL;

  const handleLogin = () => {
    if (!phone.trim() || phone.length < 10) {
      setError('Numéro de téléphone invalide (10 chiffres requis)');
      setErrorKey(prev => prev + 1);
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = {
        name: role === 'citizen' ? 'Koné Moussa' : "Recycleur Côte d'Ivoire",
        phone: `+225 ${phone}`,
        role,
      };
      login(user);
      setRole(role);
      router.replace(('/(tabs)/home') as any);
    }, 1200);
  };

  return (
    <MobileFrame bgColor="#F8F9F9">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <AnimatedView delay={0}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Retour</Text>
          </Pressable>
        </AnimatedView>

        {/* Header */}
        <AnimatedView delay={100} style={styles.headerWrapper}>
          <View style={styles.headerSection}>
            <View style={[styles.headerIcon, { backgroundColor: accent, shadowColor: accent }]}>
              <Text style={styles.headerIconText}>♻️</Text>
            </View>
            <Text style={styles.headerTitle}>Connexion</Text>
            <View style={[styles.rolePill, { backgroundColor: `${accent}15` }]}>
              <Text style={[styles.rolePillText, { color: accent }]}>
                {role === 'citizen' ? '🌿 Espace Citoyen' : '🏭 Espace Recycleur Pro'}
              </Text>
            </View>
          </View>
        </AnimatedView>

        {/* Phone Input */}
        <AnimatedView delay={200}>
          <View>
            <Text style={styles.label}>📞 Ton Numéro de Téléphone</Text>
            <View
              style={[
                styles.phoneContainer,
                {
                  borderColor: isFocused ? accent : phone.length === 10 ? '#34c759' : '#E8ECEF',
                  shadowColor: isFocused ? accent : 'transparent',
                  shadowOpacity: isFocused ? 0.1 : 0,
                  shadowRadius: isFocused ? 20 : 0,
                },
              ]}
            >
              <View
                style={[
                  styles.phonePrefix,
                  {
                    backgroundColor: isFocused ? `${accent}10` : '#F8F9FA',
                    borderRightColor: isFocused ? accent : '#E8ECEF',
                  },
                ]}
              >
                <Text style={[styles.phonePrefixText, { color: isFocused ? accent : CHARCOAL }]}>📞</Text>
                <Text style={[styles.phonePrefixCode, { color: isFocused ? accent : CHARCOAL }]}>+225</Text>
              </View>
              <TextInput
                placeholder="07 00 00 00 00"
                placeholderTextColor="#94A3B8"
                value={phone}
                onChangeText={(val) => setPhone(val.replace(/\D/g, ''))}
                maxLength={10}
                keyboardType="phone-pad"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                editable={!isLoading}
                style={styles.phoneInput}
              />
            </View>
          </View>
        </AnimatedView>

        {/* Error Alert with Shake */}
        {error ? (
          <ShakeView triggerKey={errorKey} style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </ShakeView>
        ) : null}

        {/* Submit CTA */}
        <AnimatedView delay={300}>
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.submitButton,
              {
                opacity: isLoading ? 0.8 : 1,
                transform: [{ scale: pressed && !isLoading ? 0.98 : 1 }],
              },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitText}>Se connecter</Text>
                <Text style={styles.submitArrow}>→</Text>
              </>
            )}
          </Pressable>
        </AnimatedView>

        {/* Separator */}
        <AnimatedView delay={400} style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.separatorLine} />
        </AnimatedView>

        {/* Register Link */}
        <AnimatedView delay={500}>
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>Nouveau sur RecyGo ?</Text>
            <Pressable onPress={() => router.push(`/(auth)/register?role=${role}` as any)}>
              <Text style={[styles.registerLink, { color: accent }]}>
                Créer un compte gratuitement
              </Text>
            </Pressable>
          </View>
        </AnimatedView>

        {/* Switch Profile Space */}
        <AnimatedView delay={600} style={styles.switchSection}>
          <View style={styles.switchCard}>
            <Text style={styles.switchLabel}>
              {role === 'citizen' ? 'Recycleur Professionnel ?' : 'Simple Citoyen ?'}
            </Text>
            <Pressable
              onPress={() => {
                const nextRole = role === 'citizen' ? 'pro' : 'citizen';
                router.push(`/(auth)/login?role=${nextRole}` as any);
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '900', marginTop: 4, color: role === 'citizen' ? CHARCOAL : GREEN }}>
                Basculer vers l'espace {role === 'citizen' ? 'Pro' : 'Citoyen'} →
              </Text>
            </Pressable>
          </View>
        </AnimatedView>
      </ScrollView>
    </MobileFrame>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32, minHeight: 760 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backIcon: { fontSize: 20, color: '#64748B' },
  backText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  headerWrapper: { alignSelf: 'stretch' },
  headerSection: { alignItems: 'center', marginBottom: 32 },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 6,
  },
  headerIconText: { fontSize: 34 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: CHARCOAL, textAlign: 'center' },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  rolePillText: { fontSize: 11, fontWeight: '800' },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 2,
  },
  phonePrefixText: { fontSize: 16 },
  phonePrefixCode: { fontSize: 15, fontWeight: '900' },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: CHARCOAL,
    letterSpacing: 2,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 16,
  },
  errorIcon: { fontSize: 16 },
  errorText: { fontSize: 13, fontWeight: '700', color: '#DC2626', flex: 1 },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: ORANGE,
    borderRadius: 20,
    paddingVertical: 18,
    marginTop: 8,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  submitArrow: { fontSize: 20, color: '#FFFFFF', fontWeight: '900' },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 24,
  },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  separatorText: { fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 },
  registerSection: { alignItems: 'center', marginBottom: 24 },
  registerText: { fontSize: 13, color: '#64748B' },
  registerLink: { fontSize: 15, fontWeight: '900', marginTop: 4, textDecorationLine: 'underline' },
  switchSection: { marginTop: 'auto' },
  switchCard: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  switchLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

