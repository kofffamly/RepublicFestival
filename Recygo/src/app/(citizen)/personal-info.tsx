/**
 * Mes Informations — RecyGo CI
 *
 * Écran de détail des informations personnelles de l'utilisateur :
 * - En-tête vert foncé : flèche retour + titre "Mes informations"
 * - Corps blanc :
 *   - Carte avatar + nom + email
 *   - Liste des informations (Téléphone, Membre depuis, Adresse, etc.)
 *   - Chaque ligne est cliquable → affiche un détail
 * - Barre de navigation inférieure
 */

import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

// ─── Constantes de design ───────────────────────────────────────────
const GREEN_DARK = '#0F5C34';
const GREEN_MID = '#1E7A46';
const GREEN_CTA = '#2ECC71';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_GRAY = '#6B7280';
const BG_LIGHT = '#F8FAFC';

// ─── Écran Mes Informations ────────────────────────────────────────
export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user } = useApp();
  const insets = useSafeAreaInsets();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AK'
    : 'AK';

  const infoItems = [
    { icon: '📱', label: 'Téléphone', value: user?.phone || '+225 07 00 00 00', route: '/(citizen)/personal-info' },
    { icon: '📧', label: 'Email', value: user?.email || 'aya.kouassi@example.com', route: '/(citizen)/personal-info' },
    { icon: '📅', label: 'Membre depuis', value: user?.memberSince || 'mai 2025', route: '/(citizen)/personal-info' },
    { icon: '📍', label: 'Adresse', value: user?.address || 'Abidjan, Côte d\'Ivoire', route: '/(citizen)/personal-info' },
    { icon: '♻️', label: 'Total collecté', value: `${user?.recycledKg ?? 20} kg`, route: '/(citizen)/personal-info' },
    { icon: '💰', label: 'Total gagné', value: `${user?.earnings ?? 3092} FCFA`, route: '/(citizen)/personal-info' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ─── En-tête vert foncé ──────────────────────────────────── */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Mes informations</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* ─── Corps blanc ─────────────────────────────────────────── */}
        <View style={styles.body}>
          {/* Carte Avatar + Nom */}
          <View style={styles.avatarCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.userName}>{user?.name || 'Aya Kouassi'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'aya.kouassi@example.com'}</Text>
          </View>

          {/* Liste des informations */}
          <View style={styles.infoList}>
            {infoItems.map((item, idx) => (
              <View key={idx}>
                <Pressable
                  onPress={() => router.push(item.route as any)}
                  style={styles.infoItem}
                >
                  <View style={[styles.infoIconBox, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={styles.infoIcon}>{item.icon}</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                  <Text style={styles.infoArrow}>›</Text>
                </Pressable>
                {idx < infoItems.length - 1 && <View style={styles.infoDivider} />}
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
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

  // ── Avatar Card ──
  avatarCard: {
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GREEN_CTA,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: WHITE,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '400',
    color: TEXT_GRAY,
  },

  // ── Liste informations ──
  infoList: {
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: TEXT_GRAY,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  infoArrow: {
    fontSize: 20,
    fontWeight: '300',
    color: '#CBD5E1',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 66,
  },
});
