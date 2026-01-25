import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BigButton from '../components/BigButton';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';

export default function SchemeListeningScreen({ navigation, language }) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('SchemeResults'), 1200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{language === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}</Text>
      <Text style={styles.subtitle}>{language === 'hi' ? 'अपनी उम्र, काम और आय बताएं...' : 'Tell us your age, job, and income...'}</Text>
      <BigButton
        title=""
        icon={<Ionicons name="mic" size={36} color={COLORS.background} />}
        onPress={() => {}}
        style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#D9534F', alignSelf: 'center', marginTop: 24 }}
      />
      <Text style={styles.recording}>{language === 'hi' ? '• रिकॉर्ड हो रहा है...' : '• Recording...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.subheading,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.secondary,
    textAlign: 'center',
  },
  recording: {
    fontSize: FONT_SIZES.small,
    color: '#D9534F',
    textAlign: 'center',
    marginTop: 12,
  },
});