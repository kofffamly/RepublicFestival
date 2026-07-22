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
      RNAnimated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
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

export default function Register() {
  const router = useRouter();
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const { login, setRole } = useApp();
  const role = (roleParam || 'citizen') as Role;
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [activeInput, setActiveInput] = useState<'name' | 'phone' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(0);

  const accent = role === 'citizen' ? GREEN : CHARCOAL;

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Saisis ton nom complet');
      setErrorKey(prev => prev + 1);
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Numéro de téléphone invalide (10 chiffres requis)');
      setErrorKey(prev => prev + 1);
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = { name: name.trim(), phone: `+225 ${phone}`, role };
      login(user);
      setRole(role);
      router.replace((role === 'citizen' ? '/(tabs)/home' : '/(tabs)/home') as any);
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
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Retour</Text>
          </Pressable>
        </AnimatedView>

        {/* Header */}
        <AnimatedView delay={100}>
          <View style={styles.header}>
            <View style={[styles.headerIcon, { backgroundColor: accent, shadowColor: accent }]}>
              <Text style={styles.headerIconText}>♻️</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Créer mon compte</Text>
              <Text style={[styles.headerSubtitle, { color: accent }]}>
                {role === 'citizen' ? '🌿 Profil Citoyen' : '🏭 Profil Recycleur Pro'}
              </Text>
            </View>
          </View>
        </AnimatedView>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <AnimatedView delay={200}>
            <View>
              <Text style={styles.label}>👤 Ton Nom Complet</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: activeInput === 'name' ? accent : name.trim() ? '#34c759' : '#E8ECEF',
                    shadowColor: activeInput === 'name' ? accent : 'transparent',
                    shadowOpacity: activeInput === 'name' ? 0.1 : 0,
                    shadowRadius: activeInput === 'name' ? 16 : 0,
                  },
                ]}
              >
                <Text style={[styles.inputIcon, { color: activeInput === 'name' ? accent : name.trim() ? '#34c759' : '#94A3B8' }]}>👤</Text>
                <TextInput
                  placeholder="Ex: Koné Moussa"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setActiveInput('name')}
                  onBlur={() => setActiveInput(null)}
                  editable={!isLoading}
                  style={styles.textInput}
                />
              </View>
            </View>
          </AnimatedView>

          {/* Phone Field */}
          <AnimatedView delay={300}>
            <View>
              <Text style={styles.label}>📞 Numéro de Téléphone</Text>
              <View
                style={[
                  styles.inputContainer,
                  styles.phoneInputContainer,
                  {
                    borderColor: activeInput === 'phone' ? accent : phone.length === 10 ? '#34c759' : '#E8ECEF',
                    shadowColor: activeInput === 'phone' ? accent : 'transparent',
                    shadowOpacity: activeInput === 'phone' ? 0.1 : 0,
                    shadowRadius: activeInput === 'phone' ? 16 : 0,
                  },
                ]}
              >
                <View
                  style={[
                    styles.phonePrefix,
                    {
                      backgroundColor: activeInput === 'phone' ? `${accent}10` : '#F8F9FA',
                      borderRightColor: activeInput === 'phone' ? accent : '#E8ECEF',
                    },
                  ]}
                >
                  <Text style={[styles.phonePrefixText, { color: activeInput === 'phone' ? accent : CHARCOAL }]}>📞</Text>
                  <Text style={[styles.phonePrefixCode, { color: activeInput === 'phone' ? accent : CHARCOAL }]}>+225</Text>
                </View>
                <TextInput
                  placeholder="07 00 00 00 00"
                  placeholderTextColor="#94A3B8"
                  value={phone}
                  onChangeText={(val) => setPhone(val.replace(/\D/g, ''))}
                  maxLength={10}
                  keyboardType="phone-pad"
                  onFocus={() => setActiveInput('phone')}
                  onBlur={() => setActiveInput(null)}
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

          {/* Premium Info Panel */}
          <AnimatedView delay={400}>
            <View style={[styles.infoPanel, { backgroundColor: `${accent}08`, borderColor: `${accent}25` }]}>
              <Text style={[styles.infoIcon, { color: accent }]}>ℹ️</Text>
              <Text style={styles.infoText}>
                Ton numéro servira pour recevoir ton argent instantanément via Mobile Money (Wave, Orange Money, MTN) dès validation de tes dépôts.
              </Text>
            </View>
          </AnimatedView>
        </View>

        {/* CTA Button */}
        <AnimatedView delay={500}>
          <Pressable
            onPress={handleSubmit}
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
                <Text style={styles.submitText}>Créer mon compte</Text>
                <Text style={styles.submitArrow}>→</Text>
              </>
            )}
          </Pressable>
        </AnimatedView>

        {/* Bottom Switch Link */}
        <AnimatedView delay={600}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Tu as déjà un compte ? </Text>
            <Pressable onPress={() => router.push(`/(auth)/login?role=${role}` as any)}>
              <Text style={[styles.switchLink, { color: accent }]}>Se connecter</Text>
            </Pressable>
          </View>
        </AnimatedView>
      </ScrollView>
    </MobileFrame>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    minHeight: 760,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backIcon: {
    fontSize: 20,
    color: '#64748B',
  },
  backText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  headerIconText: {
    fontSize: 26,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: CHARCOAL,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  formSection: {
    gap: 20,
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    paddingVertical: 16,
  },
  phoneInputContainer: {
    overflow: 'hidden',
    paddingLeft: 0,
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 2,
  },
  phonePrefixText: {
    fontSize: 14,
  },
  phonePrefixCode: {
    fontSize: 14,
    fontWeight: '900',
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: CHARCOAL,
    letterSpacing: 1.5,
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
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    flex: 1,
  },
  infoPanel: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 1,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    color: CHARCOAL,
    lineHeight: 18,
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: ORANGE,
    borderRadius: 20,
    paddingVertical: 18,
    marginTop: 24,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  submitArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchText: {
    fontSize: 13,
    color: '#64748B',
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});

