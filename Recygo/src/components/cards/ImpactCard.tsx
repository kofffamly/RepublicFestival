import { View, Text, StyleSheet } from 'react-native';

interface ImpactCardProps {
  emoji: string;
  title: string;
  value: string;
  subtitle: string;
  accentColor?: string;
}

export function ImpactCard({
  emoji,
  title,
  value,
  subtitle,
  accentColor = '#2ECC71',
}: ImpactCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});

