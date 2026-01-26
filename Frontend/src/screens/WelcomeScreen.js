import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import BigButton from '../components/BigButton';
import './WelcomeScreen.css';

export default function WelcomeScreen({ onComplete }) {
  const { selectLanguage } = useLanguage();

  const handleLanguageSelect = (lang) => {
    selectLanguage(lang);
    onComplete();
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        {/* Logo is clickable and routes to home */}
        <Link to="/">
          <img src="/logo.png" alt="Sahaj Seva Logo" className="welcome-logo" style={{ cursor: 'pointer' }} />
        </Link>
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
