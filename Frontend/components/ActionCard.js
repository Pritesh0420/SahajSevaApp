import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, BORDER_RADIUS } from '../designSystem';
import { Ionicons } from '@expo/vector-icons';

export default function ActionCard({ title, icon, description, children, style, onPress, variant = 'green' }) {
  const bgColor = variant === 'green' ? COLORS.greenLight : variant === 'blue' ? COLORS.blueLight : COLORS.orangeLight;
  const iconBgColor = variant === 'green' ? COLORS.primary : variant === 'blue' ? COLORS.secondary : COLORS.accent;
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container style={[styles.card, { backgroundColor: bgColor }, style]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            {icon}
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.desc}>{description}</Text>}
        </View>
        {onPress && <Ionicons name="chevron-forward" size={24} color={COLORS.text} />}
      </View>
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.subheading - 2,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  desc: {
    fontSize: FONT_SIZES.body - 2,
    color: COLORS.text,
    opacity: 0.8,
  },
});