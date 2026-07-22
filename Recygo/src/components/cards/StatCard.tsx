import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  emoji: string;
  value: string;
  label: string;
  color?: string;
}

export function StatCard({ emoji, value, label, color = '#2ECC71' }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

