import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, BORDER_RADIUS } from '../designSystem';
import { Ionicons } from '@expo/vector-icons';

export default function SchemeCard({ title, description, benefits, onListen, onSave, isSaved = false, icon }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: isSaved ? COLORS.accent : '#EFEFEF' }]} onPress={onSave}>
          <Ionicons name="bookmark" size={18} color={isSaved ? COLORS.background : COLORS.text} />
        </TouchableOpacity>
      </View>
      <Text style={styles.desc}>{description}</Text>
      {benefits && (
        <View style={styles.benefitBox}>
          <Text style={styles.benefitText}>💰 {benefits}</Text>
        </View>
      )}
      <BigButton variant="secondary" onPress={onListen}>
        🔊 Listen to Details
      </BigButton>
    </View>
  );
}

import BigButton from './BigButton';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(74,124,89,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  title: { fontSize: FONT_SIZES.body, fontWeight: 'bold', color: COLORS.text },
  saveBtn: { padding: 8, borderRadius: 8 },
  desc: { color: '#666', fontSize: FONT_SIZES.body, marginBottom: 8 },
  benefitBox: { backgroundColor: COLORS.greenLight, borderRadius: 10, padding: 10, marginBottom: 8 },
  benefitText: { fontSize: FONT_SIZES.small, color: COLORS.primary, fontWeight: '600' },
});