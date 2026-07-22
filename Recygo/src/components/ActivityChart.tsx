import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';

const DATA = [
  { day: 'Lun', tasks: 12 },
  { day: 'Mar', tasks: 15 },
  { day: 'Mer', tasks: 8 },
  { day: 'Jeu', tasks: 18 },
  { day: 'Ven', tasks: 14 },
  { day: 'Sam', tasks: 10 },
  { day: 'Dim', tasks: 16 },
];

const CHART_HEIGHT = 200;
const CHART_WIDTH = 300;
const BAR_WIDTH = 28;
const MAX_VALUE = 20;

export function ActivityChart() {
  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Grid lines */}
        {[0, 5, 10, 15, 20].map((val) => {
          const y = CHART_HEIGHT - (val / MAX_VALUE) * CHART_HEIGHT;
          return (
            <Line
              key={val}
              x1={0}
              y1={y}
              x2={CHART_WIDTH}
              y2={y}
              stroke="#F1F5F9"
              strokeWidth={1}
            />
          );
        })}
        {/* Bars */}
        {DATA.map((item, index) => {
          const barHeight = (item.tasks / MAX_VALUE) * (CHART_HEIGHT - 20);
          const x = 10 + index * (BAR_WIDTH + 14);
          const y = CHART_HEIGHT - barHeight - 10;
          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={barHeight}
              rx={8}
              ry={8}
              fill="#3b82f6"
              opacity={0.85}
            />
          );
        })}
      </Svg>
      {/* Labels */}
      <View style={styles.labelsRow}>
        {DATA.map((item, index) => (
          <Text key={index} style={styles.label}>
            {item.day}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: CHART_WIDTH,
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    width: BAR_WIDTH + 14,
    textAlign: 'center',
  },
});

