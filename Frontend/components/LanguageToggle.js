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
        <Text style={styles.text}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, language === 'hi' && styles.selected]}
        onPress={() => onToggle('hi')}
      >
        <Text style={styles.text}>हिंदी</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  button: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS,
    marginHorizontal: 6,
  },
  selected: {
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.background,
    fontSize: FONT_SIZES.body,
    fontWeight: 'bold',
  },
});