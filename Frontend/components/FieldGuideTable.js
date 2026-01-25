import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, BORDER_RADIUS } from '../designSystem';

export default function FieldGuideTable({ fields }) {
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerCell]}>Field Name</Text>
        <Text style={[styles.cell, styles.headerCell]}>What to Write</Text>
      </View>
      {fields.map((f, i) => (
        <View key={i} style={[styles.row, i % 2 === 0 ? styles.bodyRow : styles.altBodyRow]}>
          <Text style={[styles.cell, styles.nameCell]}>{f.name}</Text>
          <Text style={[styles.cell, styles.hintCell]}>{f.hint}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    marginVertical: 8,
  },
  row: { flexDirection: 'row' },
  headerRow: { backgroundColor: '#F4F4F4', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  bodyRow: { backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border },
  altBodyRow: { backgroundColor: '#F9FAFB', borderTopWidth: 1, borderTopColor: COLORS.border },
  cell: { flex: 1, padding: 10 },
  headerCell: { fontWeight: '600', fontSize: FONT_SIZES.small },
  nameCell: { fontWeight: '500', color: COLORS.text },
  hintCell: { color: '#666' },
});