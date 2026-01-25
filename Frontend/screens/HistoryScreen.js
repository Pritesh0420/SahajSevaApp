import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../designSystem';
import { useLanguage } from '../LanguageContext';

const mockHistory = [
  { id: '1', type: 'scheme', title: 'PM-KISAN Eligibility Check', date: '20 Jan 2024', icon: 'mic' },
  { id: '2', type: 'form', title: 'Ration Card Application', date: '19 Jan 2024', icon: 'document-text' },
  { id: '3', type: 'scheme', title: 'Ayushman Bharat Search', date: '18 Jan 2024', icon: 'mic' },
  { id: '4', type: 'form', title: 'Pension Form', date: '15 Jan 2024', icon: 'document-text' },
];

export default function HistoryScreen() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filteredHistory = filter === 'all' 
    ? mockHistory 
    : mockHistory.filter(item => item.type === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{language === 'hi' ? 'इतिहास' : 'History'}</Text>
        <TouchableOpacity>
          <Text style={styles.langToggle}>{language === 'hi' ? 'हिं' : 'EN'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.filterActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            {language === 'hi' ? 'सभी' : 'All'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'scheme' && styles.filterActive]}
          onPress={() => setFilter('scheme')}
        >
          <Text style={[styles.filterText, filter === 'scheme' && styles.filterTextActive]}>
            {language === 'hi' ? 'योजनाएं' : 'Schemes'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'form' && styles.filterActive]}
          onPress={() => setFilter('form')}
        >
          <Text style={[styles.filterText, filter === 'form' && styles.filterTextActive]}>
            {language === 'hi' ? 'फॉर्म' : 'Forms'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: item.type === 'scheme' ? COLORS.greenLight : COLORS.blueLight }]}>
              <Ionicons name={item.icon} size={24} color={item.type === 'scheme' ? COLORS.primary : COLORS.secondary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.secondary} />
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.heading,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  langToggle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    backgroundColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS,
    backgroundColor: COLORS.border,
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: FONT_SIZES.small,
    color: COLORS.secondary,
    marginLeft: 4,
  },
});
