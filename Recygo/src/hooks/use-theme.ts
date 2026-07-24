import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    green: '#2ECC71',
    charcoal: '#2C3E50',
    orange: '#E67E22',
    white: '#FFFFFF',
    lightBg: '#F8F9F9',
    inactive: '#94A3B8',
    background: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    card: '#FFFFFF',
    error: '#EF4444',
    success: '#2ECC71',
    backgroundElement: '#F8F9F9',
    backgroundSelected: '#E9F8EF',
    tint: '#2ECC71',
  },
  dark: {
    green: '#2ECC71',
    charcoal: '#1E293B',
    orange: '#E67E22',
    white: '#FFFFFF',
    lightBg: '#0F172A',
    inactive: '#64748B',
    background: '#0F172A',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    card: '#1E293B',
    error: '#F87171',
    success: '#34D399',
    backgroundElement: '#0F172A',
    backgroundSelected: '#E9F8EF',
    tint: '#2ECC71',
  },
};

export function useTheme() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  return Colors[scheme];
}
