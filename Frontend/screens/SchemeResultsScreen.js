import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';
import BigButton from '../components/BigButton';

export default function SchemeResultsScreen({ language }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{language === 'hi' ? 'आपके लिए मिली योजनाएँ (3)' : 'Schemes Found for You (3)'}</Text>
      <View style={styles.saidBox}>
        <Text style={styles.saidText}>{language === 'hi' ? 'आपने कहा:' : 'You said:'}</Text>
        <Text style={styles.quote}>{language === 'hi' ? '"मैं 62 साल का हूं, किसान, आय ₹2 लाख"' : '"I am 62 years old, a farmer, income ₹2 lakh"'}</Text>
      </View>
      {[1,2,3].map((i) => (
        <View key={i} style={styles.schemeCard}>
          <Text style={styles.schemeTitle}>{i===1 ? 'PM-KISAN' : i===2 ? 'PM Awas Yojana' : 'Ayushman Bharat'}</Text>
          <View style={styles.benefitBar} />
          <BigButton title={language === 'hi' ? 'विवरण सुनें' : 'Listen to Details'} onPress={() => {}} style={{ marginTop: 8, backgroundColor: COLORS.secondary }} />
        </View>
      ))}
      <BigButton title={language === 'hi' ? 'फिर से खोजें' : 'Search Again'} onPress={() => {}} style={{ marginVertical: 16 }} />
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
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  saidBox: {
    backgroundColor: '#D7ECD9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  saidText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.small,
    marginBottom: 4,
  },
  quote: {
    color: COLORS.text,
    fontSize: FONT_SIZES.small,
    fontStyle: 'italic',
  },
  schemeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  schemeTitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  benefitBar: {
    height: 12,
    backgroundColor: '#D7ECD9',
    borderRadius: 8,
  },
});