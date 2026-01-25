import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../designSystem';
import LanguageToggle from './LanguageToggle';

export default function PageHeader({ title, showBack = false, showLanguageToggle = true, rightElement, onBack }) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      <View style={styles.right}>
        {showLanguageToggle && <LanguageToggle />}
        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 12,
    backgroundColor: 'rgba(250,250,248,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { padding: 6, marginRight: 6 },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});