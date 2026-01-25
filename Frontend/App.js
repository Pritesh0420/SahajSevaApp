import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './MainTabs';
import WelcomeScreen from './screens/WelcomeScreen';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { StatusBar } from 'expo-status-bar';

function AppContent() {
  const { language } = useLanguage();
  
  if (!language) {
    return (
      <>
        <StatusBar style="dark" />
        <WelcomeScreen />
      </>
    );
  }
  
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
