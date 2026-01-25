import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BigButton from '../components/BigButton';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';
import { useLanguage } from '../LanguageContext';

export default function FormAssistantScreen({ navigation }) {
  const { language } = useLanguage();
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="document-text" size={80} color={COLORS.secondary} />
      </View>
      <Text style={styles.title}>
        {language === 'hi' ? 'अपना फॉर्म अपलोड करें' : 'Upload Your Form'}
      </Text>
      <Text style={styles.subtitle}>
        {language === 'hi' ? 'फोटो लें या गैलरी से चुनें' : 'Take a photo or choose from gallery'}
      </Text>
      
      <View style={styles.buttonContainer}>
        <BigButton
          title={language === 'hi' ? 'फॉर्म की फोटो लें' : 'Take Photo of Form'}
          icon={<Ionicons name="camera" size={24} color={COLORS.background} />}
          onPress={() => navigation.navigate('FormSetup')}
          variant="primary"
          style={styles.button}
        />
        <BigButton
          title={language === 'hi' ? 'गैलरी से अपलोड करें' : 'Upload from Gallery'}
          icon={<Ionicons name="folder" size={24} color={COLORS.background} />}
          onPress={() => navigation.navigate('FormSetup')}
          variant="secondary"
          style={styles.button}
        />
      </View>
      
      <Text style={styles.supportText}>
        {language === 'hi' ? 'समर्थित: JPG, PNG, PDF' : 'Supported: JPG, PNG, PDF'}
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
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: COLORS.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: FONT_SIZES.heading,
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginVertical: 8,
  },
  supportText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.secondary,
    marginTop: 24,
    textAlign: 'center',
  },
});