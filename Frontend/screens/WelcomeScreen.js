import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Logo from '../assets/logo';
import BigButton from '../components/BigButton';
import { COLORS, FONT_SIZES, BORDER_RADIUS } from '../designSystem';
import { useLanguage } from '../LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const { setLanguage } = useLanguage();
  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>सहज सेवा</Text>
      <Text style={styles.subTitle}>Sahaj Seva</Text>
      <Text style={styles.tagline}>Your Digital Government Helper</Text>
      <Text style={styles.taglineHindi}>आपका डिजिटल सरकारी सहायक</Text>
      <Text style={styles.selectText}>Select Your Language / अपनी भाषा चुनें</Text>
      <View style={styles.buttonContainer}>
        <BigButton 
          title="IN हिंदी (Hindi)" 
          onPress={() => setLanguage('hi')} 
          variant="primary" 
          fullWidth={true}
          style={styles.button}
        />
        <BigButton 
          title="GB English" 
          onPress={() => setLanguage('en')} 
          variant="secondary" 
          fullWidth={true}
          style={styles.button}
        />
      </View>
      <View style={styles.voiceHintContainer}>
        <Ionicons name="mic" size={20} color={COLORS.secondary} />
        <Text style={styles.voiceHint}>Or speak to select / या बोलकर चुनें</Text>
      </View>
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
  title: {
    fontSize: 32,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: FONT_SIZES.heading - 4,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  taglineHindi: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  selectText: {
    fontSize: FONT_SIZES.body + 2,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    marginVertical: 8,
  },
  voiceHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  voiceHint: {
    fontSize: FONT_SIZES.small,
    color: COLORS.secondary,
    marginLeft: 8,
  },
});