import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  green: '#2ECC71',
  charcoal: '#2C3E50',
  orange: '#E67E22',
  white: '#FFFFFF',
  lightBg: '#F8F9F9',
  inactive: '#94A3B8',
};

function TabIcon({ name, color, size }: { name: string; color: any; size: number }) {
  const iconMap: Record<string, string> = {
    home: '🏠',
    search: '🔍',
    profile: '👤',
  };
  return (
    <Text style={{ fontSize: size, color }}>{iconMap[name] || '📄'}</Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: '#E8ECEF',
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color, size }) => <TabIcon name="search" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <TabIcon name="profile" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

