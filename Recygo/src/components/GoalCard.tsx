import { View, Text, StyleSheet } from 'react-native';

interface GoalCardProps {
  title: string;
  progress: number;
  total: number;
  color: string;
}

export function GoalCard({ title, progress, total, color }: GoalCardProps) {
  const percentage = (progress / total) * 100;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>🎯</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      </View>
      <View style={styles.progressBarOuter}>
        <View
          style={[
            styles.progressBarInner,
            { width: `${percentage}%` as any, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.counter}>
        {progress} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  progressBarOuter: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    height: 8,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderRadius: 8,
    transition: 'width 0.5s',
  } as any,
  counter: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '600',
  },
});

