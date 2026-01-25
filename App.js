import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './Frontend/navigation/MainTabs';
import WelcomeScreen from './Frontend/screens/WelcomeScreen';
import { LanguageProvider, useLanguage } from './Frontend/contexts/LanguageContext';

function AppContent() {
  const { language } = useLanguage();
  if (!language) return <WelcomeScreen />;
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
