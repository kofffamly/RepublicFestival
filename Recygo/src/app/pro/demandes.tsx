import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MobileFrame } from '@/components/MobileFrame';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

interface Demande {
  id: number;
  location: string;
  district: string;
  type: string;
  emoji: string;
  weight: number;
  price: number;
  distance: string;
  time: string;
  status: 'pending' | 'accepted' | 'refused';
}

const INITIAL_DEMANDES: Demande[] = [
  { id: 1, location: 'Cocody', district: 'Riviera 2', type: 'Plastique PET', emoji: '🧴', weight: 30, price: 8000, distance: '1.2 km', time: 'Il y a 3 min', status: 'pending' },
  { id: 2, location: 'Yopougon', district: 'Selmer', type: 'Carton brun', emoji: '📦', weight: 45, price: 6750, distance: '3.5 km', time: 'Il y a 8 min', status: 'pending' },
  { id: 3, location: 'Plateau', district: 'Centre', type: 'Canettes alu', emoji: '🥫', weight: 12, price: 4800, distance: '5.1 km', time: 'Il y a 15 min', status: 'pending' },
  { id: 4, location: 'Adjamé', district: 'Marché', type: 'Bouteilles verre', emoji: '🍶', weight: 20, price: 3000, distance: '6.8 km', time: 'Il y a 22 min', status: 'pending' },
];

function AnimatedPressable({ onPress, children, style }: { onPress?: () => void; children: React.ReactNode; style?: any }) {
  const scale = useRef(new RNAnimated.Value(1)).current;
  const hp = () => RNAnimated.spring(scale, { toValue: 0.95, friction: 8, tension: 100, useNativeDriver: true }).start();
  const hpr = () => RNAnimated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();
  return (
    <RNAnimated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={hp} onPressOut={hpr}>{children}</Pressable>
    </RNAnimated.View>
  );
}

export default function Demandes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [demandes, setDemandes] = useState<Demande[]>(INITIAL_DEMANDES);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastAnim = useRef(new RNAnimated.Value(100)).current;
  const toastOpacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    if (showToast) {
      RNAnimated.parallel([
        RNAnimated.spring(toastAnim, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
        RNAnimated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        RNAnimated.parallel([
          RNAnimated.timing(toastAnim, { toValue: 100, duration: 300, useNativeDriver: true }),
          RNAnimated.timing(toastOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => setShowToast(false));
      }, 2500);
    }
  }, [showToast]);

  const handleAction = (id: number, action: 'accepted' | 'refused') => {
    if (action === 'accepted') {
      setLoadingId(id);
      setTimeout(() => {
        setDemandes(prev => prev.map(d => d.id === id ? { ...d, status: action } : d));
        setLoadingId(null);
        const demande = demandes.find(d => d.id === id);
        setToastMessage(`Dépôt ${demande?.type} - ${demande?.location} · +${demande?.price.toLocaleString()} FCFA`);
        setShowToast(true);
      }, 900);
    } else {
      setDemandes(prev => prev.map(d => d.id === id ? { ...d, status: action } : d));
    }
  };

  const filtered = demandes.filter(d => activeTab === 'pending' ? d.status === 'pending' : d.status === 'accepted');
  const pendingCount = demandes.filter(d => d.status === 'pending').length;
  const acceptedCount = demandes.filter(d => d.status === 'accepted').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Pro Header */}
      <View style={styles.proHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <AnimatedPressable onPress={() => router.push('/pro/dashboard' as any)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }}>←</Text>
            <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)' }}>Tableau de bord</Text>
          </AnimatedPressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${ORANGE}30`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: `${ORANGE}50` }}>
            <Text style={{ fontSize: 10, color: ORANGE }}>📡</Text>
            <Text style={{ fontSize: 8, fontWeight: '900', color: ORANGE, textTransform: 'uppercase', letterSpacing: 0.5 }}>Flux Live</Text>
          </View>
        </View>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#FFFFFF' }}>Demandes de collecte</Text>
        <Text style={{ fontSize: 11, color: '#CBD5E1', marginTop: 2 }}>{pendingCount} dépôt{pendingCount > 1 ? 's' : ''} disponible{pendingCount > 1 ? 's' : ''} à proximité</Text>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabRow}>
        {(['pending', 'accepted'] as const).map(tab => {
          const isActive = activeTab === tab;
          const count = tab === 'pending' ? pendingCount : acceptedCount;
          return (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, isActive && styles.tabActive]}>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab === 'pending' ? '⏳' : '✅'} {tab === 'pending' ? 'À collecter' : 'Acceptées'}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: isActive ? (tab === 'pending' ? ORANGE : GREEN) : '#E2E8F0' }]}>
                  <Text style={[styles.tabBadgeText, { color: isActive ? '#FFFFFF' : '#94A3B8' }]}>{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🎉</Text>
            <Text style={{ fontSize: 16, fontWeight: '900', color: CHARCOAL }}>Rien en attente</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
              {activeTab === 'pending' ? 'Toutes les demandes ont été prises en charge !' : 'Accepte des collectes pour les voir ici'}
            </Text>
          </View>
        ) : (
          filtered.map((demande, index) => {
            const isAccepting = loadingId === demande.id;
            return (
              <View key={demande.id} style={[styles.card, demande.status === 'accepted' && { borderColor: GREEN }]}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 12 }}>📍</Text>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: CHARCOAL }}>{demande.location}</Text>
                    <Text style={{ fontSize: 9, fontWeight: '700', color: '#94A3B8' }}>{demande.district}</Text>
                  </View>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: '#94A3B8' }}>⏰ {demande.time}</Text>
                </View>

                <View style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <Text style={{ fontSize: 28 }}>{demande.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: CHARCOAL }}>Dépôt {demande.type}</Text>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: '#94A3B8', marginTop: 2 }}>Distance: {demande.distance}</Text>
                    </View>
                    {index === 0 && demande.status === 'pending' && (
                      <View style={{ backgroundColor: `${ORANGE}20`, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8 }}>
                        <Text style={{ fontSize: 7, fontWeight: '900', color: ORANGE, textTransform: 'uppercase' }}>✨ Urgent</Text>
                      </View>
                    )}
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                    <View style={styles.cardStat}>
                      <Text style={{ fontSize: 16 }}>⚖️</Text>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: CHARCOAL }}>{demande.weight} kg</Text>
                      <Text style={{ fontSize: 8, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Poids</Text>
                    </View>
                    <View style={styles.cardStat}>
                      <Text style={{ fontSize: 16 }}>💵</Text>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: '#10b981' }}>{demande.price.toLocaleString()} FCFA</Text>
                      <Text style={{ fontSize: 8, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Prix</Text>
                    </View>
                  </View>

                  {demande.status === 'pending' ? (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <AnimatedPressable onPress={() => handleAction(demande.id, 'refused')} style={styles.refuseBtn}>
                        <Text style={{ fontSize: 14, color: '#64748B' }}>✕</Text>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Refuser</Text>
                      </AnimatedPressable>
                      <AnimatedPressable onPress={() => handleAction(demande.id, 'accepted')} style={styles.acceptBtn}>
                        {isAccepting ? (
                          <>
                            <Text style={{ fontSize: 14, color: '#fff' }}>⏳</Text>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff', textTransform: 'uppercase' }}>Confirmation...</Text>
                          </>
                        ) : (
                          <>
                            <Text style={{ fontSize: 14, color: '#fff' }}>✅</Text>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff', textTransform: 'uppercase' }}>Prendre la collecte</Text>
                          </>
                        )}
                      </AnimatedPressable>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, backgroundColor: `${GREEN}15`, borderRadius: 16, borderWidth: 1, borderColor: `${GREEN}25` }}>
                      <Text style={{ fontSize: 14, color: GREEN }}>✅</Text>
                      <Text style={{ fontSize: 11, fontWeight: '900', color: GREEN, textTransform: 'uppercase' }}>Collecte acceptée · En route</Text>
                      <Text style={{ fontSize: 12, color: GREEN }}>🚗</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Toast */}
      {showToast && (
        <RNAnimated.View style={[styles.toast, { transform: [{ translateY: toastAnim }], opacity: toastOpacity }]}>
          <Text style={{ fontSize: 16 }}>⚡</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '900', color: '#fff', textTransform: 'uppercase' }}>Collecte acceptée !</Text>
            <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', marginTop: 1 }}>{toastMessage}</Text>
          </View>
        </RNAnimated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9F9' },
  proHeader: {
    backgroundColor: CHARCOAL,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    padding: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 13,
  },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 11, fontWeight: '800', color: '#718096' },
  tabTextActive: { color: CHARCOAL },
  tabBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  tabBadgeText: { fontSize: 8, fontWeight: '900' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardStat: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  refuseBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: GREEN,
    borderRadius: 16,
  },
  toast: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#10b981',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
});

