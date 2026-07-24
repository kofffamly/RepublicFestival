/**
 * Notifications — RecyGo CI
 *
 * Écran de liste de notifications avec :
 * - Titre "Notifications" en noir gras + lien "Tout lire" en vert
 * - Liste de cartes de notification (icône ronde, titre, sous-titre, heure, point "non lu")
 * - Notifications depuis le contexte avec état lu/non lu
 * - "Tout lire" marque toutes les notifications comme lues
 * - Cliquer sur une notification la marque comme lue
 */

import { useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated as RNAnimated,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

// ─── Constantes de design ───────────────────────────────────────────
const GREEN_CTA = '#2ECC71';
const TEXT_DARK = '#111827';
const TEXT_GRAY = '#6B7280';
const BG_LIGHT = '#F8FAFC';
const WHITE = '#FFFFFF';

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

// ─── Écran Notifications ────────────────────────────────────────────
export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAllNotificationsRead, markNotificationRead, unreadCount } = useApp();
  const insets = useSafeAreaInsets();

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  const handleNotificationPress = (id: string, action?: string) => {
    markNotificationRead(id);
    if (action) {
      router.push(action as any);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header avec retour */}
      <AnimatedView delay={0} style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={handleMarkAllRead}>
            <Text style={styles.markAllRead}>Tout lire</Text>
          </Pressable>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </AnimatedView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptySubtitle}>Vous serez notifié(e) lorsqu’un événement se produit.</Text>
          </View>
        ) : (
          notifications.map((notif, idx) => (
            <AnimatedView key={notif.id} delay={100 + idx * 80}>
              <Pressable
                onPress={() => handleNotificationPress(notif.id, notif.action)}
                style={styles.pressableWrapper}
              >
                <View style={[styles.notifCard, !notif.unread && styles.notifCardRead]}>
                  {/* Point non lu */}
                  {notif.unread && <View style={styles.unreadDot} />}

                  {/* Icône */}
                  <View style={[styles.notifIconBox, { backgroundColor: notif.iconBg }]}>
                    <Text style={[styles.notifIcon, { color: notif.iconColor }]}>{notif.icon}</Text>
                  </View>

                  {/* Contenu */}
                  <View style={styles.notifContent}>
                    <Text style={[styles.notifTitle, { color: notif.titleColor }]}>{notif.title}</Text>
                    <Text style={styles.notifSubtitle} numberOfLines={2}>{notif.subtitle}</Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                </View>
              </Pressable>
            </AnimatedView>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },

  // ── Header ──
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: BG_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  markAllRead: {
    fontSize: 13,
    fontWeight: '600',
    color: GREEN_CTA,
  },

  // ── Carte notification ──
  pressableWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  notifCardRead: {
    opacity: 0.7,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN_CTA,
  },
  notifIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  notifIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  notifSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: TEXT_GRAY,
    lineHeight: 16,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: '400',
    color: '#9CA3AF',
  },

  // ── Empty state ──
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_GRAY,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
