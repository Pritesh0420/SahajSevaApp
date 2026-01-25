import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MicButton from '../components/MicButton';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';
import { useLanguage } from '../LanguageContext';

export default function SchemeLandingScreen({ navigation }) {
  const { language } = useLanguage();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {language === 'hi' ? 'टैप करें और बोलें' : 'Tap and Speak'}
      </Text>
      <Text style={styles.subtitle}>
        {language === 'hi' ? 'अपनी उम्र, काम और आय बताएं...' : 'Tell us your age, job, and income...'}
      </Text>
      <MicButton
        size="large"
        onPress={() => navigation.navigate('SchemeListening')}
        style={{ marginVertical: 40 }}
      />
      <View style={styles.exampleBox}>
        <Text style={styles.exampleText}>
          {language === 'hi' 
            ? '"मैं 62 साल का हूं, किसान, आय ₹2 लाख"' 
            : '"I am 62 years old, a farmer, income ₹2 lakh"'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.heading,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  exampleBox: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  exampleText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});