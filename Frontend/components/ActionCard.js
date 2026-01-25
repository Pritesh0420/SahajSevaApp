import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, BORDER_RADIUS } from '../designSystem';
import { Ionicons } from '@expo/vector-icons';

export default function ActionCard({ title, icon, description, children, style, onPress, variant = 'green' }) {
  const bgColor = variant === 'green' ? COLORS.greenLight : variant === 'blue' ? COLORS.blueLight : COLORS.orangeLight;
  const borderColor = variant === 'green' ? COLORS.primary : variant === 'blue' ? COLORS.secondary : COLORS.accent;
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container style={[styles.card, { backgroundColor: bgColor, borderColor: borderColor }, style]} onPress={onPress} activeOpacity={0.95}>
      <View style={styles.row}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.desc}>{description}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
      </View>
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: BORDER_RADIUS,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: FONT_SIZES.subheading,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    marginTop: 4,
  },
});