import React from 'react';
import { useLanguage } from '../LanguageContext';
import BigButton from '../components/BigButton';
import './WelcomeScreen.css';

const Logo = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="55" fill="#4A7C59" opacity="0.1"/>
    <circle cx="60" cy="60" r="45" fill="#4A7C59"/>
    <path d="M 40 60 L 55 75 L 80 45" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function WelcomeScreen({ onComplete }) {
  const { selectLanguage } = useLanguage();

  const handleLanguageSelect = (lang) => {
    selectLanguage(lang);
    onComplete();
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <Logo />
        <h1 className="welcome-title">सहज सेवा<br/>Sahaj Seva</h1>
        <p className="welcome-tagline">
          Your friendly guide to government schemes and forms
        </p>
        
        <div className="language-selection">
          <h2 className="selection-title">Choose your language<br/>अपनी भाषा चुनें</h2>
          <BigButton
            title="हिंदी"
            onPress={() => handleLanguageSelect('hi')}
            variant="primary"
          />
          <BigButton
            title="English"
            onPress={() => handleLanguageSelect('en')}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
}
