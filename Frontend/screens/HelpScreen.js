import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';
import { useLanguage } from '../LanguageContext';

export default function HelpScreen() {
  const { language } = useLanguage();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{language === 'hi' ? 'मदद' : 'Help'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          {language === 'hi' ? 'कैसे उपयोग करें' : 'How to Use'}
        </Text>
        <Text style={styles.text}>
          {language === 'hi' 
            ? '1. अपनी भाषा चुनें\n2. योजनाएं खोजने के लिए माइक पर बोलें\n3. फॉर्म भरने के लिए फोटो अपलोड करें' 
            : '1. Select your language\n2. Speak into the mic to find schemes\n3. Upload form photo for guidance'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.heading,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  content: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.subheading,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    lineHeight: 28,
  },
});
