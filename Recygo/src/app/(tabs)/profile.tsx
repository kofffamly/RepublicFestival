import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  green: '#2ECC71',
  charcoal: '#2C3E50',
  orange: '#E67E22',
  white: '#FFFFFF',
  lightBg: '#F8F9F9',
};

const MENU_ITEMS = [
  { emoji: '🔔', label: 'Notifications', desc: 'Alertes collectes activées' },
  { emoji: '🛡️', label: 'Confidentialité', desc: 'Données personnelles cryptées' },
  { emoji: '❓', label: 'Aide & Support', desc: 'FAQ, Assistance 24h/7' },
  { emoji: 'ℹ️', label: 'À propos', desc: 'Version 1.0.0' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>🌿</Text>
          </View>
          <Text style={styles.profileName}>Utilisateur</Text>
          <Text style={styles.profilePhone}>+225 07 00 00 00 00</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Niveau 4 · Protecteur Vert</Text>
          </View>
        </View>

        {/* Stats Overview */}
        <Text style={styles.sectionTitle}>Mes Statistiques</Text>
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total recyclé</Text>
            <Text style={styles.statValue}>45 kg</Text>
          </View>
          <View style={[styles.statRow, styles.statBorder]}>
            <Text style={styles.statLabel}>Gains totaux</Text>
            <Text style={[styles.statValue, { color: COLORS.green }]}>2 450 FCFA</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Collectes effectuées</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
        </View>

        {/* Menu */}
        <Text style={styles.sectionTitle}>Mon compte</Text>
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => [
                styles.menuItem,
                idx < MENU_ITEMS.length - 1 && styles.menuBorder,
                pressed && styles.menuPressed,
              ]}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* Logout */}
        <Pressable style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutPressed]}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>

        <Text style={styles.footer}>RecyGo App v1.0.0 · Fait avec ♻️ à Abidjan</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightBg,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.charcoal,
  },
  profilePhone: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#F0FFF4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.green,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.charcoal,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  menuPressed: {
    backgroundColor: '#F8F9FA',
  },
  menuEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  menuDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 22,
    color: '#CBD5E1',
    fontWeight: '300',
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  logoutPressed: {
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 24,
  },
});

