import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './LanguageContext';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import SchemeLandingScreen from './screens/SchemeLandingScreen';
import SchemeListeningScreen from './screens/SchemeListeningScreen';
import SchemeResultsScreen from './screens/SchemeResultsScreen';
import FormAssistantScreen from './screens/FormAssistantScreen';
import HistoryScreen from './screens/HistoryScreen';
import HelpScreen from './screens/HelpScreen';
import BottomNav from './components/BottomNav';
import './App.css';

function AppContent() {
  const { language } = useLanguage();
  const [showWelcome, setShowWelcome] = useState(!language);

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div className="app-container">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/schemes" element={<SchemeLandingScreen />} />
          <Route path="/schemes/listening" element={<SchemeListeningScreen />} />
          <Route path="/schemes/results" element={<SchemeResultsScreen />} />
          <Route path="/forms" element={<FormAssistantScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/help" element={<HelpScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </BrowserRouter>
  );
}
