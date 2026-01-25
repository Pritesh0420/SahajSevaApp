import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BigButton from '../components/BigButton';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';

export default function FormExplainSetupScreen({ navigation, language }) {
  return (
    <View style={styles.container}>
      <View style={styles.preview} />
      <Text style={styles.choose}>{language === 'hi' ? 'भाषा चुनें:' : 'Choose explanation language:'}</Text>
      <View style={styles.langRow}>
        <BigButton title={language === 'hi' ? 'हिंदी' : 'Hindi'} onPress={() => {}} style={[styles.langBtn, { backgroundColor: '#D9534F' }]} />
        <BigButton title="English" onPress={() => {}} style={[styles.langBtn, { backgroundColor: '#5CB85C' }]} />
      </View>
      <BigButton title={language === 'hi' ? 'इस फॉर्म को समझाएँ →' : 'Explain This Form →'} onPress={() => navigation.navigate('FormExplanation')} style={{ backgroundColor: '#C49A6C', marginVertical: 12 }} />
      <BigButton title={language === 'hi' ? 'दूसरा फॉर्म चुनें' : 'Choose Different Form'} onPress={() => navigation.navigate('FormUpload')} style={{ backgroundColor: '#EDEDED' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  preview: {
    flex: 1,
    backgroundColor: '#F2F2ED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E0',
    marginBottom: 12,
  },
  choose: {
    textAlign: 'center',
    fontSize: FONT_SIZES.small,
    color: COLORS.secondary,
    marginVertical: 8,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  langBtn: {
    flex: 1,
    marginHorizontal: 6,
  },
});