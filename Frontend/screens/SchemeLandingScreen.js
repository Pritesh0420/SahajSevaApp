import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BigButton from '../components/BigButton';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';

export default function SchemeLandingScreen({ navigation, language }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{language === 'hi' ? 'टैप करें और बोलें' : 'Tap and Speak'}</Text>
      <Text style={styles.subtitle}>{language === 'hi' ? 'अपनी उम्र, काम और आय बताएं...' : 'Tell us your age, job, and income...'}</Text>
      <BigButton
        title=""
        icon={<Ionicons name="mic" size={36} color={COLORS.background} />}
        onPress={() => navigation.navigate('SchemeListening')}
        style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, alignSelf: 'center', marginTop: 24 }}
      />
      <Text style={styles.example}>{language === 'hi' ? '"मैं 62 साल का हूं, किसान, आय ₹2 लाख"' : '"I am 62 years old, a farmer, income ₹2 lakh"'}</Text>
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
  example: {
    fontSize: FONT_SIZES.small,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 12,
  },
});