import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MobileFrame } from '@/components/MobileFrame';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

function AnimatedPressable({ onPress, children, delay = 0 }: { onPress: () => void; children: React.ReactNode; delay?: number }) {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(30)).current;
  const scale = useRef(new RNAnimated.Value(1)).current;

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

  const handlePressIn = () => {
    RNAnimated.spring(scale, {
      toValue: 0.97,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    RNAnimated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  return (
    <RNAnimated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </Pressable>
    </RNAnimated.View>
  );
}

function SpinningLogo() {
  const rotateAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const spin = () => {
      rotateAnim.setValue(0);
      RNAnimated.timing(rotateAnim, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.logoWrapper}>
      <View style={styles.halo} />
      <RNAnimated.View style={[styles.logoCircle, { transform: [{ rotate }] }]}>
        <Text style={styles.logoIcon}>♻️</Text>
      </RNAnimated.View>
    </View>
  );
}

function PulseHalo() {
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  return (
    <RNAnimated.View
      style={{
        position: 'absolute',
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: GREEN,
        opacity: pulseAnim.interpolate({
          inputRange: [0.6, 1],
          outputRange: [0.12, 0.25],
        }),
      }}
    />
  );
}

export default function RoleSelection() {
  const router = useRouter();
  const { setRole } = useApp();
  const insets = useSafeAreaInsets();

  const handleCitizen = () => {
    setRole('citizen');
    router.push(`/(auth)/register?role=citizen` as any);
  };

  const handlePro = () => {
    setRole('pro');
    router.push(`/(auth)/register?role=pro` as any);
  };

  return (
    <MobileFrame bgColor="#F8F9F9">
      <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
        {/* Top & Logo */}
        <View style={styles.topSection}>
          <AnimatedPressable onPress={() => {}} delay={0}>
            <View style={styles.logoSection}>
              <SpinningLogo />
              <PulseHalo />
              <Text style={styles.brandName}>RecyGo</Text>
              <Text style={styles.tagline}>
                Transforme tes déchets en argent de façon moderne
              </Text>
            </View>
          </AnimatedPressable>

          <AnimatedPressable onPress={() => {}} delay={150}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Qui es-tu ?</Text>
              <Text style={styles.subtitle}>
                Choisis ton profil pour commencer l'aventure
              </Text>
            </View>
          </AnimatedPressable>
        </View>

        {/* Role Cards */}
        <View style={styles.cardsSection}>
          {/* Citizen Card */}
          <AnimatedPressable onPress={handleCitizen} delay={300}>
            <View style={[styles.roleCard, styles.citizenCard]}>
              <View style={styles.roleIconContainer}>
                <Text style={styles.roleIcon}>🌿</Text>
              </View>
              <View style={styles.roleContent}>
                <View style={styles.roleHeader}>
                  <Text style={styles.roleName}>🧑‍🤝‍🧑 Citoyen</Text>
                  <View style={styles.badge}>
                    <Text style={[styles.badgeText, { color: GREEN }]}>Vendeur</Text>
                  </View>
                </View>
                <Text style={styles.roleAction}>Je veux vendre mes déchets</Text>
                <Text style={styles.roleDesc}>
                  Prends une photo de tes déchets et reçois de l'argent directement sur Mobile Money.
                </Text>
              </View>
            </View>
          </AnimatedPressable>

          {/* Pro Card */}
          <AnimatedPressable onPress={handlePro} delay={450}>
            <View style={[styles.roleCard, styles.proCard]}>
              <View style={[styles.roleIconContainer, styles.proIconContainer]}>
                <Text style={styles.roleIcon}>🏭</Text>
              </View>
              <View style={styles.roleContent}>
                <View style={styles.roleHeader}>
                  <Text style={styles.proName}>🏭 Recycleur Pro</Text>
                  <View style={[styles.badge, styles.proBadge]}>
                    <Text style={[styles.badgeText, { color: ORANGE }]}>Collecteur</Text>
                  </View>
                </View>
                <Text style={styles.proAction}>Je gère les collectes</Text>
                <Text style={styles.proDesc}>
                  Suis ton inventaire, gère tes tournées de ramassage et connecte-toi aux usines.
                </Text>
              </View>
            </View>
          </AnimatedPressable>
        </View>

        {/* Footer */}
        <AnimatedPressable onPress={() => {}} delay={600}>
          <Text style={styles.footer}>
            En continuant, tu acceptes nos{' '}
            <Text style={styles.footerLink}>Conditions d'utilisation</Text>
          </Text>
        </AnimatedPressable>
      </View>
    </MobileFrame>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'space-between',
    minHeight: 760,
  },
  topSection: {
    alignItems: 'center',
    width: '100%',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  logoWrapper: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  halo: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: GREEN,
    opacity: 0.15,
    top: 0,
    left: 0,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 36,
  },
  brandName: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: CHARCOAL,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  titleSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: CHARCOAL,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  cardsSection: {
    gap: 20,
    flex: 1,
    justifyContent: 'center',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  citizenCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: GREEN,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  proCard: {
    backgroundColor: CHARCOAL,
    borderWidth: 2,
    borderColor: '#34495E',
    shadowColor: CHARCOAL,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 4,
  },
  roleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${GREEN}12`,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  proIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  roleIcon: {
    fontSize: 28,
  },
  roleContent: {
    flex: 1,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleName: {
    fontSize: 17,
    fontWeight: '900',
    color: CHARCOAL,
  },
  proName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: `${GREEN}15`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  proBadge: {
    backgroundColor: `${ORANGE}22`,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  roleAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#27AE60',
    marginTop: 4,
  },
  proAction: {
    fontSize: 13,
    fontWeight: '700',
    color: ORANGE,
    marginTop: 4,
  },
  roleDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 16,
  },
  proDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
    lineHeight: 16,
  },
  footer: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 24,
  },
  footerLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    color: '#64748B',
  },
});

