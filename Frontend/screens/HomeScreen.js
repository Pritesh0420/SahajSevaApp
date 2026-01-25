import React from 'react';
import { View, StyleSheet } from 'react-native';
import ActionCard from '../components/ActionCard';
import BigButton from '../components/BigButton';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../designSystem';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomeScreen({ language, setLanguage, navigation }) {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <LanguageToggle language={language} onToggle={setLanguage} />
      <ActionCard
        title={t('homeFindSchemesTitle')}
        icon={<Ionicons name="search" size={36} color={COLORS.primary} />}
        style={styles.card}
        description={t('homeFindSchemesDesc')}
        >
        <BigButton title={t('homeFindSchemesCTA')} onPress={() => navigation.navigate('SchemeDiscovery')} style={{ marginTop: 8 }} />
      </ActionCard>
      <ActionCard
        title={t('homeFillFormTitle')}
        icon={<Ionicons name="document-text" size={36} color={COLORS.primary} />}
        style={styles.card}
        description={t('homeFillFormDesc')}
      >
        <BigButton title={t('homeFillFormCTA')} onPress={() => navigation.navigate('FormAssistant')} style={{ marginTop: 8 }} />
      </ActionCard>

      <ActionCard
        title={t('homeQuickTipTitle')}
        description={t('homeQuickTipDesc')}
      />

      <ActionCard
        title={t('homeRecentTitle')}
        description={t('homeRecentDesc')}
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