import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const COLORS = {
  green: '#2ECC71',
  charcoal: '#2C3E50',
  orange: '#E67E22',
  white: '#FFFFFF',
  lightBg: '#F8F9F9',
};

const CATEGORIES = [
  { emoji: '🧴', label: 'Plastique', color: '#EBF5FB' },
  { emoji: '📦', label: 'Carton', color: '#FEF5E7' },
  { emoji: '🥫', label: 'Métal', color: '#F2F4F4' },
  { emoji: '🍶', label: 'Verre', color: '#E8F8F5' },
  { emoji: '🔋', label: 'Électronique', color: '#F4ECF7' },
  { emoji: '👕', label: 'Textile', color: '#FDF2F8' },
];

const NEARBY_POINTS = [
  { name: 'SIPEF Recyclage', location: 'Port-Bouët', distance: '1.2 km', price: '250 FCFA/kg', emoji: '🏭' },
  { name: 'EcoTech Abidjan', location: 'Yopougon', distance: '3.5 km', price: '235 FCFA/kg', emoji: '♻️' },
  { name: 'GreenPro Ind.', location: 'Koumassi', distance: '5.8 km', price: '260 FCFA/kg', emoji: '🏗️' },
];

export default function SearchScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Rechercher</Text>
        <Text style={styles.subtitle}>Trouve un point de collecte près de chez toi</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Plastique, carton, verre..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Catégories</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat, idx) => (
            <View key={idx} style={[styles.categoryCard, { backgroundColor: cat.color }]}>
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </View>
          ))}
        </View>

        {/* Nearby Points */}
        <Text style={styles.sectionTitle}>Points de rachat à proximité</Text>
        {NEARBY_POINTS.map((point, idx) => (
          <View key={idx} style={styles.pointCard}>
            <View style={styles.pointHeader}>
              <Text style={styles.pointEmoji}>{point.emoji}</Text>
              <View style={styles.pointInfo}>
                <Text style={styles.pointName}>{point.name}</Text>
                <Text style={styles.pointLocation}>{point.location}</Text>
              </View>
              <Text style={styles.pointDistance}>{point.distance}</Text>
            </View>
            <View style={styles.pointFooter}>
              <Text style={styles.pointPrice}>{point.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightBg,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.charcoal,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.charcoal,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  categoryCard: {
    width: '30%',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    flexGrow: 1,
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  pointCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  pointInfo: {
    flex: 1,
  },
  pointName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.charcoal,
  },
  pointLocation: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  pointDistance: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.orange,
  },
  pointFooter: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  pointPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.green,
  },
});

