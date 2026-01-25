import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BigButton from '../components/BigButton';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../designSystem';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../LanguageContext';

const mockSchemes = [
  {
    id: '1',
    name: 'PM-Kisan Samman Nidhi',
    eligibility: 'Farmers with land up to 2 hectares',
    benefit: '₹6,000/year in 3 installments',
  },
  {
    id: '2',
    name: 'Old Age Pension',
    eligibility: 'Senior citizens above 60 years',
    benefit: '₹500-1000/month pension',
  },
  {
    id: '3',
    name: 'Ayushman Bharat',
    eligibility: 'Families with annual income below ₹2.5 lakh',
    benefit: 'Free health insurance up to ₹5 lakh',
  },
];

export default function SchemeResultsScreen() {
  const { language } = useLanguage();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.youSaidBox}>
        <Text style={styles.youSaidLabel}>
          {language === 'hi' ? 'आपने कहा:' : 'You said:'}
        </Text>
        <Text style={styles.youSaidText}>
          {language === 'hi' 
            ? 'मैं 62 साल का किसान हूं, आय ₹2 लाख' 
            : 'I am 62 years old, a farmer, income ₹2 lakh'}
        </Text>
      </View>

      <Text style={styles.header}>
        {language === 'hi' ? 'आपके लिए मिली योजनाएं (3)' : 'Schemes Found for You (3)'}
      </Text>

      {mockSchemes.map((scheme, index) => (
        <View key={scheme.id} style={styles.schemeCard}>
          <Text style={styles.schemeName}>{scheme.name}</Text>
          <Text style={styles.schemeEligibility}>
            <Text style={styles.label}>
              {language === 'hi' ? 'पात्रता: ' : 'Eligibility: '}
            </Text>
            {scheme.eligibility}
          </Text>
          <View style={styles.benefitBox}>
            <Ionicons name="gift" size={18} color={COLORS.primary} />
            <Text style={styles.benefit}>{scheme.benefit}</Text>
          </View>
        </View>
      ))}

      <BigButton 
        title={language === 'hi' ? 'विवरण सुनें' : 'Listen to Details'}
        icon={<Ionicons name="volume-high" size={24} color={COLORS.background} />}
        onPress={() => {}}
        variant="secondary"
        style={{ marginVertical: 16 }}
      />
      
      <BigButton 
        title={language === 'hi' ? 'फिर से खोजें' : 'Search Again'}
        onPress={() => {}}
        variant="primary"
        style={{ marginBottom: 24 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  youSaidBox: {
    backgroundColor: COLORS.border,
    padding: 16,
    borderRadius: BORDER_RADIUS,
    marginBottom: 20,
  },
  youSaidLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  youSaidText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    fontWeight: '600',
  },
  header: {
    fontSize: FONT_SIZES.subheading,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  schemeCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  schemeName: {
    fontSize: FONT_SIZES.body + 2,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  schemeEligibility: {
    fontSize: FONT_SIZES.body - 2,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  label: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  benefitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenLight,
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  benefit: {
    fontSize: FONT_SIZES.body - 2,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
});
