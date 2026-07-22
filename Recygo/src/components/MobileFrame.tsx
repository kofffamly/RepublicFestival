import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
  bgColor?: string;
}

const NARROW_GREEN = '#2ECC71';
const NARROW_CHARCOAL = '#2C3E50';

export function MobileFrame({ children, bgColor = '#F8F9F9' }: MobileFrameProps) {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const isDarkBg = bgColor === '#000' || bgColor === '#090a0f' || bgColor === '#0f0f15' || bgColor === '#2C3E50';
  const textColor = isDarkBg ? '#FFFFFF' : '#1A1A1A';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]} edges={['top']}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={[styles.time, { color: textColor }]}>{time}</Text>
        <View style={styles.statusIcons}>
          <View style={styles.signalBars}>
            {[3, 5, 7, 9].map((h, i) => (
              <View key={i} style={[styles.signalBar, { height: h, backgroundColor: textColor }]} />
            ))}
          </View>
          <View style={[styles.batteryOuter, { borderColor: textColor }]}>
            <View style={[styles.batteryInner, { backgroundColor: '#34c759' }]} />
          </View>
          <View style={[styles.batteryTip, { backgroundColor: textColor }]} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={[styles.homeBar, { backgroundColor: textColor, opacity: 0.35 }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: 44,
    zIndex: 50,
  },
  time: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 9,
  },
  signalBar: {
    width: 3,
    borderRadius: 0.5,
  },
  batteryOuter: {
    width: 22,
    height: 11,
    borderRadius: 3.5,
    borderWidth: 1,
    padding: 1,
    justifyContent: 'center',
  },
  batteryInner: {
    width: '85%',
    height: '100%',
    borderRadius: 2,
  },
  batteryTip: {
    width: 1.5,
    height: 4,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  homeIndicator: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  homeBar: {
    width: 134,
    height: 5,
    borderRadius: 100,
    marginBottom: 4,
  },
});

