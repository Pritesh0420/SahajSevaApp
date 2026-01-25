import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BigButton from '../components/BigButton';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';
import { useLanguage } from '../contexts/LanguageContext';

export default function SchemeListeningScreen({ navigation, language }) {
  const { t } = useLanguage();
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('SchemeResults'), 1200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('schemeListeningTitle')}</Text>
      <Text style={styles.subtitle}>{t('schemeListeningHint')}</Text>
      <BigButton
        title=""
        icon={<Ionicons name="mic" size={36} color={COLORS.background} />}
        onPress={() => {}}
        style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#D9534F', alignSelf: 'center', marginTop: 24 }}
      />
      <Text style={styles.recording}>{t('schemeRecordingLabel')}</Text>
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