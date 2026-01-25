import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';
import { Ionicons } from '@expo/vector-icons';

const faqs = [
  {
    q: 'How to find government schemes?',
    a: 'Use the "Find Schemes" feature and speak about yourself.',
  },
  {
    q: 'How to fill a form?',
    a: 'Use the "Help Me Fill a Form" feature and follow the guidance.',
  },
];

export default function HelpScreen({ language }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{language === 'hi' ? 'सहायता' : 'Help'}</Text>
      {faqs.map((faq, idx) => (
        <View key={idx} style={styles.faq}>
          <Text style={styles.q}>{faq.q}</Text>
          <Text style={styles.a}>{faq.a}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.helpButton} onPress={() => Linking.openURL('tel:1800123456')}>
        <Ionicons name="call" size={24} color={COLORS.background} />
        <Text style={styles.helpText}>{language === 'hi' ? 'सहायता के लिए कॉल करें' : 'Call for Help'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.videoButton} onPress={() => Linking.openURL('https://www.youtube.com/')}> 
        <Ionicons name="play-circle" size={24} color={COLORS.accent} />
        <Text style={styles.videoText}>{language === 'hi' ? 'वीडियो ट्यूटोरियल' : 'Video Tutorial'}</Text>
      </TouchableOpacity>
      <Text style={styles.contact}>{language === 'hi' ? 'संपर्क: 1800-123-456' : 'Contact: 1800-123-456'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  header: {
    fontSize: FONT_SIZES.heading,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  faq: {
    marginBottom: 16,
  },
  q: {
    fontSize: FONT_SIZES.body,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  a: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    marginLeft: 8,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  helpText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.body,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoText: {
    color: COLORS.accent,
    fontSize: FONT_SIZES.body,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  contact: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
});