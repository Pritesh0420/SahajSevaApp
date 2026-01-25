import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../designSystem';
import BigButton from '../components/BigButton';
import AudioPlayer from '../components/AudioPlayer';
import { schemes } from '../mockData';

export default function SchemeDiscoveryScreen({ language }) {
  // Placeholder: show all schemes
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{language === 'hi' ? 'अपने बारे में बोलें: उम्र, काम, आय...' : 'Speak about yourself: age, job, income...'}</Text>
      <BigButton
        title={language === 'hi' ? 'बोलें' : 'Speak'}
        icon={<Ionicons name="mic" size={32} color={COLORS.background} />}
        onPress={() => {}}
        style={styles.micButton}
      />
      <Text style={styles.example}>{language === 'hi' ? 'उदाहरण: "मैं 62 साल का किसान हूं..."' : 'Example: "I am a 62-year-old farmer..."'}</Text>
      <FlatList
        data={schemes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.schemeCard}>
            <Text style={styles.schemeTitle}>{item.name[language]}</Text>
            <Text style={styles.schemeDesc}>{item.description[language]}</Text>
            <BigButton
              title={language === 'hi' ? 'सुनें' : 'Listen'}
              icon={<Ionicons name="volume-high" size={24} color={COLORS.background} />}
              onPress={() => {}}
              style={styles.listenButton}
            />
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  prompt: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    marginBottom: 12,
  },
  micButton: {
    marginBottom: 8,
  },
  example: {
    fontSize: FONT_SIZES.small,
    color: COLORS.secondary,
    marginBottom: 16,
  },
  list: {
    marginTop: 8,
  },
  schemeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  schemeTitle: {
    fontSize: FONT_SIZES.subheading,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  schemeDesc: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    marginBottom: 8,
  },
  listenButton: {
    alignSelf: 'flex-start',
  },
});