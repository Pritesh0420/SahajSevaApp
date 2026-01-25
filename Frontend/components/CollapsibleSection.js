import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, BORDER_RADIUS } from '../designSystem';
import { Ionicons } from '@expo/vector-icons';

export default function CollapsibleSection({ title, icon, children, defaultOpen = false, style }) {
  const [isOpen, setIsOpen] = useState(!!defaultOpen);
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.header} onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.left}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.text} />
      </TouchableOpacity>
      {isOpen && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FBFBFB',
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 18, marginRight: 8 },
  title: { fontSize: FONT_SIZES.subheading - 2, fontWeight: '600', color: COLORS.text },
  body: { padding: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
});