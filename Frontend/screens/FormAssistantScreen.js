import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BigButton from '../components/BigButton';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';

export default function FormAssistantScreen({ language, navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{language === 'hi' ? 'फॉर्म अपलोड करें या फोटो लें' : 'Upload or Take Photo of Form'}</Text>
      <BigButton
        title={language === 'hi' ? 'फोटो लें' : 'Take Photo'}
        icon={<Ionicons name="camera" size={28} color={COLORS.background} />}
        onPress={() => navigation.navigate('FormSetup')}
        style={styles.button}
      />
      <BigButton
        title={language === 'hi' ? 'गैलरी से चुनें' : 'Upload from Gallery'}
        icon={<Ionicons name="folder" size={28} color={COLORS.background} />}
        onPress={() => navigation.navigate('FormSetup')}
        style={styles.button}
      />
      <BigButton
        title={language === 'hi' ? 'फॉर्म समझाएँ' : 'Explain This Form'}
        icon={<Ionicons name="help-circle" size={28} color={COLORS.background} />}
        onPress={() => navigation.navigate('FormSetup')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.subheading,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    marginBottom: 16,
  },
});