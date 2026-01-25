import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ActionCard from '../components/ActionCard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../designSystem';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../LanguageContext';

export default function HomeScreen({ language, setLanguage, navigation }) {
  const { t } = useLanguage();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>{language === 'hi' ? 'सहज सेवा' : 'Sahaj Seva'}</Text>
          <Text style={styles.greeting}>{language === 'hi' ? 'नमस्ते! 🙏' : 'Namaste! 🙏'}</Text>
          <Text style={styles.subGreeting}>{language === 'hi' ? 'आज मैं आपकी कैसे मदद कर सकता हूँ?' : 'How can I help you today?'}</Text>
        </View>
        <LanguageToggle language={language} onToggle={setLanguage} />
      </View>

      <ActionCard
        title={language === 'hi' ? 'सरकारी योजनाएं खोजें' : 'Find Government Schemes'}
        icon={<Ionicons name="mic" size={36} color={COLORS.background} />}
        style={styles.card}
        description={language === 'hi' ? 'अपने बारे में बोलें और योजनाएं खोजें' : 'Speak about yourself and find schemes'}
        variant="green"
        onPress={() => navigation.navigate('SchemeDiscovery')}
      />

      <ActionCard
        title={language === 'hi' ? 'फॉर्म समझें और भरें' : 'Understand & Fill a Form'}
        icon={<Ionicons name="document-text" size={36} color={COLORS.background} />}
        style={styles.card}
        description={language === 'hi' ? 'फॉर्म की फोटो अपलोड करें' : 'Upload form photo for guidance'}
        variant="blue"
        onPress={() => navigation.navigate('FormAssistant')}
      />

      <ActionCard
        title={language === 'hi' ? '💡 त्वरित सुझाव' : '💡 Quick Tip'}
        description={language === 'hi' ? 'बड़े माइक्रोफोन बटन दबाएँ और अपनी उम्र, काम और आय बोलें।' : 'Press the big mic button and speak about your age, job and income.'}
        variant="orange"
      />

      <ActionCard
        title={language === 'hi' ? 'हाल की गतिविधि' : 'Recent Activity'}
        description={language === 'hi' ? 'अभी कोई इतिहास नहीं' : 'No history yet'}
        variant="orange"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  appTitle: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  greeting: {
    fontSize: FONT_SIZES.heading,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: FONT_SIZES.body,
    color: COLORS.secondary,
  },
  card: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
});