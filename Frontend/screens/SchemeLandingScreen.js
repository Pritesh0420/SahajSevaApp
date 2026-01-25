import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BigButton from '../components/BigButton';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';
import { useLanguage } from '../contexts/LanguageContext';

export default function SchemeLandingScreen({ navigation, language }) {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('schemeTapSpeakTitle')}</Text>
      <Text style={styles.subtitle}>{t('schemeTapSpeakHint')}</Text>
      <BigButton
        title=""
        icon={<Ionicons name="mic" size={36} color={COLORS.background} />}
        onPress={() => navigation.navigate('SchemeListening')}
        style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, alignSelf: 'center', marginTop: 24 }}
      />
      <Text style={styles.example}>{t('schemeExample')}</Text>
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