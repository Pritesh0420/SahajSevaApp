import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, FONT_SIZES, BUTTON_HEIGHT, BORDER_RADIUS } from '../designSystem';

export default function BigButton({
  title,
  children,
  icon,
  onPress,
  style,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'outline'
  iconPosition = 'left',
  fullWidth = true,
}) {
  const bgStyle =
    variant === 'primary'
      ? { backgroundColor: COLORS.primary }
      : variant === 'secondary'
      ? { backgroundColor: COLORS.secondary }
      : variant === 'accent'
      ? { backgroundColor: COLORS.accent }
      : { backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.primary };

  const contentColor =
    variant === 'outline' ? COLORS.primary : COLORS.background;

  return (
    <TouchableOpacity
      style={[styles.button, fullWidth && { alignSelf: 'stretch' }, bgStyle, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!!disabled}
    >
      <View style={styles.contentRow}>
        {icon && iconPosition === 'left' && <View style={{ marginRight: 8 }}>{icon}</View>}
        <Text style={[styles.text, { color: contentColor }]}>
          {title ?? children}
        </Text>
        {icon && iconPosition === 'right' && <View style={{ marginLeft: 8 }}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: BUTTON_HEIGHT,
    borderRadius: BORDER_RADIUS,
    marginVertical: 8,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FONT_SIZES.button,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: COLORS.border,
  },
});