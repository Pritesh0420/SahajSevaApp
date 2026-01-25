import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MicButton from '../components/MicButton';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';
import { useLanguage } from '../LanguageContext';

export default function SchemeListeningScreen({ navigation }) {
  const { language } = useLanguage();
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('SchemeResults');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {language === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}
      </Text>
      <Text style={styles.subtitle}>
        {language === 'hi' ? 'अपनी उम्र, काम और आय बताएं...' : 'Tell us your age, job, and income...'}
      </Text>
      <MicButton
        size="large"
        isListening={true}
        style={{ marginVertical: 40 }}
      />
      <Text style={styles.recording}>
        {language === 'hi' ? '• रिकॉर्ड हो रहा है...' : '• Recording...'}
      </Text>
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
  },
  recording: {
    fontSize: FONT_SIZES.body,
    color: '#D9534F',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
});
