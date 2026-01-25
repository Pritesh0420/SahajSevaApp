import React from 'react';
import { View, StyleSheet } from 'react-native';
import ActionCard from '../components/ActionCard';
import BigButton from '../components/BigButton';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../designSystem';
import LanguageToggle from '../components/LanguageToggle';

export default function HomeScreen({ language, setLanguage, navigation }) {
  return (
    <View style={styles.container}>
      <LanguageToggle language={language} onToggle={setLanguage} />
      <ActionCard
        title={language === 'hi' ? 'मेरे लिए योजनाएँ खोजें' : 'Find Schemes for Me'}
        icon={<Ionicons name="search" size={36} color={COLORS.primary} />}
        style={styles.card}
        description={language === 'hi' ? 'सरकारी योजनाएँ खोजें' : 'Discover government schemes'}
        >
        <BigButton title={language === 'hi' ? 'जाएँ' : 'Go'} onPress={() => navigation.navigate('SchemeDiscovery')} style={{ marginTop: 8 }} />
      </ActionCard>
      <ActionCard
        title={language === 'hi' ? 'मदद करें फॉर्म भरने में' : 'Help Me Fill a Form'}
        icon={<Ionicons name="document-text" size={36} color={COLORS.primary} />}
        style={styles.card}
        description={language === 'hi' ? 'सरकारी फॉर्म समझें और भरें' : 'Understand and fill government forms'}
      >
        <BigButton title={language === 'hi' ? 'जाएँ' : 'Go'} onPress={() => navigation.navigate('FormAssistant')} style={{ marginTop: 8 }} />
      </ActionCard>

      <ActionCard
        title={language === 'hi' ? 'त्वरित सुझाव' : 'Quick Tip'}
        description={language === 'hi' ? 'होम स्क्रीन पर बड़े माइक्रोफोन बटन दबाएँ और अपनी उम्र, काम और आय बोलें।' : 'Press the big mic button and speak about your age, job and income.'}
      />

      <ActionCard
        title={language === 'hi' ? 'हाल की गतिविधि' : 'Recent Activity'}
        description={language === 'hi' ? 'अभी कोई इतिहास नहीं' : 'No history yet'}
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
  card: {
    marginBottom: SPACING.md,
  },
});