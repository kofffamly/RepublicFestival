/**
 * Tab Layout — Barre de navigation inférieure
 *
 * 5 items : Accueil, Historique, Scanner (flottant central), Portefeuille, Profil
 * - Accueil : icône maison, actif en vert
 * - Scanner : bouton central flottant rond vert avec icône caméra, surélevé
 * - Profil : icône personne
 */

import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Constantes de design ───────────────────────────────────────────
const GREEN_CTA = '#2ECC71';
const GREEN_MID = '#1E7A46';
const WHITE = '#FFFFFF';
const INACTIVE = '#9CA3AF';
const TAB_BAR_HEIGHT = 65;

// ─── Constantes de couleur pour les icônes ─────────────────────────
const ACTIVE_COLOR = GREEN_CTA;
const INACTIVE_COLOR = INACTIVE;

// ─── Composant d'icône Tab ──────────────────────────────────────────
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const iconMap: Record<string, string> = {
    home: '🏠',
    history: '⏱️',
    wallet: '👛',
    profile: '👤',
  };
  return (
    <Text style={{ fontSize: 22, color: focused ? ACTIVE_COLOR : INACTIVE_COLOR, lineHeight: 26 }}>
      {iconMap[name] || '📄'}
    </Text>
  );
}

// ─── Bouton Scanner flottant ────────────────────────────────────────
function ScannerButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.scannerButton,
        { transform: [{ scale: pressed ? 0.92 : 1 }] },
      ]}
    >
      <Text style={styles.scannerIcon}>📷</Text>
    </Pressable>
  );
}

// ─── Layout des Tabs ────────────────────────────────────────────────
export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: GREEN_CTA,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: WHITE,
          borderTopWidth: 0,
          borderTopColor: '#E5E7EB',
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          height: TAB_BAR_HEIGHT + Math.max(insets.bottom - 8, 0),
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historique',
          tabBarIcon: ({ focused }) => <TabIcon name="history" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="camera-placeholder"
        options={{
          title: '',
          tabBarButton: (props) => <ScannerButton onPress={() => {}} />,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Portefeuille',
          tabBarIcon: ({ focused }) => <TabIcon name="wallet" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scannerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GREEN_CTA,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    shadowColor: GREEN_CTA,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: WHITE,
  },
  scannerIcon: {
    fontSize: 24,
    color: WHITE,
  },
});

