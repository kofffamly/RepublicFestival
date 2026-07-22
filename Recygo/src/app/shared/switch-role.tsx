import { useRef } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

function AnimatedPressable({ onPress, children, style }: { onPress?: () => void; children: React.ReactNode; style?: any }) {
  const scale = useRef(new RNAnimated.Value(1)).current;
  const handlePressIn = () => RNAnimated.spring(scale, { toValue: 0.95, friction: 8, tension: 100, useNativeDriver: true }).start();
  const handlePressOut = () => RNAnimated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();

  return (
    <RNAnimated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {children}
      </Pressable>
    </RNAnimated.View>
  );
}

export default function SwitchRole() {
  const router = useRouter();
  const { role, user, setRole, logout } = useApp();
  const insets = useSafeAreaInsets();

  const isCitizen = role === 'citizen';
  const accentColor = isCitizen ? GREEN : CHARCOAL;

  const handleSwitchToCitizen = () => {
    setRole('citizen');
    router.replace('/(tabs)/home' as any);
  };

  const handleSwitchToPro = () => {
    setRole('pro');
    router.replace('/(tabs)/home' as any);
  };

  const handleLogout = () => {
    logout();
    router.replace('/' as any);
  };

  const settingsItems = [
    { emoji: '🔔', label: 'Notifications', desc: 'Alertes collectes activées', color: ORANGE },
    { emoji: '🛡️', label: 'Confidentialité', desc: 'Données personnelles cryptées', color: GREEN },
    { emoji: '❓', label: 'Aide & Support client', desc: 'FAQ, Assistance Whatsapp 24h/7', color: '#3498DB' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.header, { backgroundColor: accentColor }]}>
          <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Retour</Text>
          </AnimatedPressable>

          {/* User Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>{isCitizen ? '🌿' : '🏭'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Utilisateur'}</Text>
              <Text style={styles.profilePhone}>{user?.phone || '+225 07 00 00 00 00'}</Text>
              <View style={styles.badgeRow}>
                <Text style={styles.badgeText}>🏆 Niveau 4 · Protecteur Vert</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Panel */}
        <View style={styles.actionPanel}>
          {/* Switch Role Block */}
          <View>
            <Text style={styles.sectionTitle}>Changer de mode</Text>
            <View style={styles.switchRow}>
              {/* Citizen */}
              <AnimatedPressable onPress={handleSwitchToCitizen} style={styles.switchCard}>
                <View style={[styles.switchCardContent, isCitizen ? styles.switchActive : styles.switchInactive]}>
                  <View style={[styles.switchIcon, { backgroundColor: isCitizen ? `${GREEN}20` : '#F1F5F9' }]}>
                    <Text style={[styles.switchEmoji, { opacity: isCitizen ? 1 : 0.5 }]}>🌿</Text>
                  </View>
                  <Text style={[styles.switchLabel, { color: isCitizen ? GREEN : '#64748B' }]}>Citoyen</Text>
                  <Text style={styles.switchAction}>Vendre</Text>
                  {isCitizen && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>Actif</Text>
                    </View>
                  )}
                </View>
              </AnimatedPressable>

              {/* Pro */}
              <AnimatedPressable onPress={handleSwitchToPro} style={styles.switchCard}>
                <View style={[styles.switchCardContent, !isCitizen ? styles.switchActiveDark : styles.switchInactive]}>
                  <View style={[styles.switchIcon, { backgroundColor: !isCitizen ? `${CHARCOAL}20` : '#F1F5F9' }]}>
                    <Text style={[styles.switchEmoji, { opacity: !isCitizen ? 1 : 0.5 }]}>🏭</Text>
                  </View>
                  <Text style={[styles.switchLabel, { color: !isCitizen ? CHARCOAL : '#64748B' }]}>Recycleur Pro</Text>
                  <Text style={styles.switchAction}>Gérer</Text>
                  {!isCitizen && (
                    <View style={[styles.activeBadge, styles.activeBadgeDark]}>
                      <Text style={[styles.activeBadgeText, { color: '#FFFFFF' }]}>Actif</Text>
                    </View>
                  )}
                </View>
              </AnimatedPressable>
            </View>
          </View>

          {/* Account & Support */}
          <View>
            <Text style={styles.sectionTitle}>Mon compte & Support</Text>
            <View style={styles.settingsCard}>
              {settingsItems.map((item, idx) => (
                <AnimatedPressable
                  key={idx}
                  style={[styles.settingsRow, idx < settingsItems.length - 1 && styles.settingsRowBorder]}
                >
                  <View style={[styles.settingsIcon, { backgroundColor: `${item.color}10` }]}>
                    <Text style={styles.settingsEmoji}>{item.emoji}</Text>
                  </View>
                  <View style={styles.settingsInfo}>
                    <Text style={styles.settingsLabel}>{item.label}</Text>
                    <Text style={styles.settingsDesc}>{item.desc}</Text>
                  </View>
                  <Text style={styles.settingsChevron}>›</Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>

          {/* Logout */}
          <AnimatedPressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </AnimatedPressable>

          <Text style={styles.version}>RecyGo App v1.0.3 · Fait avec ♻️ à Abidjan, Côte d'Ivoire</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9F9' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backIcon: { fontSize: 20, color: 'rgba(255,255,255,0.95)' },
  backText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.95)' },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 30 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  profilePhone: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 8, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },
  actionPanel: { paddingHorizontal: 20, paddingTop: 20, gap: 20 },
  sectionTitle: { fontSize: 9, fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  switchRow: { flexDirection: 'row', gap: 16 },
  switchCard: {
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
    flex: 1,
  },
  switchCardContent: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
  },
  switchActive: {
    backgroundColor: `${GREEN}08`,
    borderColor: GREEN,
    borderWidth: 1,
  },
  switchActiveDark: {
    backgroundColor: `${CHARCOAL}08`,
    borderColor: CHARCOAL,
    borderWidth: 1,
  },
  switchInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  switchIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  switchEmoji: { fontSize: 22 },
  switchLabel: { fontSize: 13, fontWeight: '900' },
  switchAction: { fontSize: 8, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginTop: 2, letterSpacing: 0.5 },
  activeBadge: {
    backgroundColor: GREEN,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 12,
  },
  activeBadgeDark: { backgroundColor: CHARCOAL },
  activeBadgeText: { fontSize: 7, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5 },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingsRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsEmoji: { fontSize: 16 },
  settingsInfo: { flex: 1 },
  settingsLabel: { fontSize: 12, fontWeight: '900', color: '#1E293B' },
  settingsDesc: { fontSize: 9, color: '#94A3B8', marginTop: 2 },
  settingsChevron: { fontSize: 18, color: '#CBD5E1', fontWeight: '300' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FDE8E8',
    backgroundColor: '#FDF2F2',
  },
  logoutIcon: { fontSize: 16 },
  logoutText: { fontSize: 11, fontWeight: '900', color: '#DC2626', textTransform: 'uppercase', letterSpacing: 0.5 },
  version: { fontSize: 8, color: '#94A3B8', textAlign: 'center', marginTop: 16 },
});

