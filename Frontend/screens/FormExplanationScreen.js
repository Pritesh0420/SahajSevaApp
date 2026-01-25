import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';
import AudioPlayer from '../components/AudioPlayer';
import { formExplanations } from '../mockData';

export default function FormExplanationScreen({ language, formId = 'ration-card' }) {
  const data = formExplanations[formId];
  if (!data) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}> 
        <Text style={{ textAlign: 'center', color: COLORS.secondary }}>No explanation available.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{language === 'hi' ? 'यह फॉर्म क्या है?' : 'What is this form?'}</Text>
      <Text style={styles.text}>{data.what[language]}</Text>
      <AudioPlayer label={language === 'hi' ? 'सुनें' : 'Listen'} />

      <Text style={styles.header}>{language === 'hi' ? 'कौन भर सकता है?' : 'Who should fill it?'}</Text>
      <Text style={styles.text}>{data.who[language]}</Text>
      <AudioPlayer label={language === 'hi' ? 'सुनें' : 'Listen'} />

      <Text style={styles.header}>{language === 'hi' ? 'लाभ' : "Benefits you'll receive"}</Text>
      {Array.isArray(data.benefits[language]) ? (
        data.benefits[language].map((b, idx) => (
          <Text key={idx} style={styles.text}>• {b}</Text>
        ))
      ) : (
        <Text style={styles.text}>{data.benefits[language]}</Text>
      )}
      <AudioPlayer label={language === 'hi' ? 'सुनें' : 'Listen'} />

      <Text style={styles.header}>{language === 'hi' ? 'महत्वपूर्ण चेतावनी' : 'Important warnings'}</Text>
      {Array.isArray(data.warnings[language]) ? (
        data.warnings[language].map((w, idx) => (
          <Text key={idx} style={styles.text}>• {w}</Text>
        ))
      ) : (
        <Text style={styles.text}>{data.warnings[language]}</Text>
      )}
      <AudioPlayer label={language === 'hi' ? 'सुनें' : 'Listen'} />

      <Text style={styles.header}>{language === 'hi' ? 'फील्ड विवरण' : 'Field Explanation'}</Text>
      <View style={styles.table}>
        {data.fields.map((field, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.cell}>{field.name[language]}</Text>
            <Text style={styles.cell}>{field.help[language]}</Text>
          </View>
        ))}
      </View>
      <AudioPlayer label={language === 'hi' ? 'भरते समय सुनें' : 'Listen While You Fill'} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  header: {
    fontSize: FONT_SIZES.subheading,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    marginBottom: 8,
  },
  table: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginVertical: 8,
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
  },
  cell: {
    flex: 1,
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    paddingHorizontal: 4,
  },
});