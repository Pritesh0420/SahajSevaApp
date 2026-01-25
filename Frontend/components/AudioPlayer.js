import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../designSystem';
import { Ionicons } from '@expo/vector-icons';
import LanguageToggle from './LanguageToggle';

export default function AudioPlayer({ label, isPlaying: externalIsPlaying, onPlayPause, showLanguageOptions = false }) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isPlaying = externalIsPlaying ?? internalIsPlaying;

  const handlePress = () => {
    if (onPlayPause) onPlayPause();
    else setInternalIsPlaying(!internalIsPlaying);
  };

  return (
    <View style={styles.container}>
      {showLanguageOptions && (
        <View style={{ marginBottom: 8 }}>
          <LanguageToggle />
        </View>
      )}
      <TouchableOpacity style={[styles.playButton, { backgroundColor: isPlaying ? '#D9534F' : COLORS.accent }]} onPress={handlePress} activeOpacity={0.9}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={COLORS.background} />
        <Text style={styles.playText}>{label || (isPlaying ? 'Pause' : 'Listen')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  playText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.body,
    marginLeft: 8,
    fontWeight: '600',
  },
});