import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Logo from '../../assets/logo';
import BigButton from '../components/BigButton';
import { COLORS, FONT_SIZES, BORDER_RADIUS } from '../designSystem';
import { useLanguage } from '../contexts/LanguageContext';

export default function WelcomeScreen() {
  const { setLanguage, t } = useLanguage();
  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>{t('appName')}</Text>
      <Text style={styles.subTitle}>Sahaj Seva</Text>
      <Text style={styles.tagline}>{t('tagline')}</Text>
      <View style={styles.buttonRow}>
        <BigButton title="हिंदी" onPress={() => setLanguage('hi')} variant="primary" />
        <BigButton title="English" onPress={() => setLanguage('en')} variant="secondary" />
      </View>
      <Text style={styles.voiceHint}>{t('speakToSelect')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: BORDER_RADIUS,
  },
  title: {
    fontSize: FONT_SIZES.heading + 4,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    marginBottom: 2,
  },
  tagline: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  voiceHint: {
    fontSize: FONT_SIZES.small,
    color: COLORS.secondary,
    marginTop: 16,
  },
});