import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../designSystem';

export default function MicButton({ isListening = false, onPress, size = 'large', style }) {
  const diameter = size === 'large' ? 128 : 80;
  const iconSize = size === 'large' ? 48 : 32;
  return (
    <View style={[styles.wrapper, { width: diameter, height: diameter }, style]}>
      {isListening && (
        <View style={[styles.pulse, { width: diameter, height: diameter }]} />
      )}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={[styles.button, { 
          width: diameter, 
          height: diameter, 
          borderRadius: diameter / 2, 
          backgroundColor: isListening ? '#D9534F' : COLORS.primary 
        }]}
      >
        <Ionicons name="mic" size={iconSize} color={COLORS.background} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  pulse: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(74,124,89,0.2)',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
