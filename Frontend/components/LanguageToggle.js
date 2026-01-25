import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, BORDER_RADIUS } from '../designSystem';

export default function LanguageToggle({ language, onToggle }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, language === 'en' && styles.selected]}
        onPress={() => onToggle('en')}
      >
        <Text style={[styles.text, language === 'en' && styles.selectedText]}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, language === 'hi' && styles.selected]}
        onPress={() => onToggle('hi')}
      >
        <Text style={[styles.text, language === 'hi' && styles.selectedText]}>हिं</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    padding: 4,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS - 2,
  },
  selected: {
    backgroundColor: COLORS.background,
  },
  text: {
    color: COLORS.secondary,
    fontSize: FONT_SIZES.body - 2,
    fontWeight: '600',
  },
  selectedText: {
    color: COLORS.text,
  },
});
