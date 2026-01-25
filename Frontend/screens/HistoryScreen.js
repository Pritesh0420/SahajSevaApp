import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';

const mockHistory = [
  { id: '1', type: 'scheme', desc: 'PM-Kisan Samman Nidhi', date: '2026-01-20' },
  { id: '2', type: 'form', desc: 'Old Age Pension Form', date: '2026-01-18' },
];

export default function HistoryScreen({ language }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{language === 'hi' ? 'इतिहास' : 'History'}</Text>
      <FlatList
        data={mockHistory}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.desc}>{item.desc}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  header: {
    fontSize: FONT_SIZES.heading,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  desc: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: FONT_SIZES.small,
    color: COLORS.secondary,
  },
});