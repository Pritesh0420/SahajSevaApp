import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ActionCard from '../components/ActionCard';
import './HomeScreen.css';

const SearchIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
  </svg>
);

export default function HomeScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="home-greeting">
          {language === 'hi' ? 'नमस्ते!' : 'Namaste!'}
        </h1>
        <LanguageToggle />
      </div>

      <p className="home-subtitle">
        {language === 'hi' 
          ? 'मैं आपकी कैसे मदद कर सकता हूं?' 
          : 'How can I help you today?'}
      </p>

      <div className="action-cards">
        <ActionCard
          title={language === 'hi' ? 'योजना खोजें' : 'Discover Schemes'}
          description={language === 'hi' ? 'अपनी योग्यता के अनुसार योजनाएं खोजें' : 'Find schemes you are eligible for'}
          icon={SearchIcon}
          variant="green"
          onPress={() => navigate('/schemes')}
        />
        <ActionCard
          title={language === 'hi' ? 'फॉर्म सहायता' : 'Form Assistant'}
          description={language === 'hi' ? 'फॉर्म भरने में मदद पाएं' : 'Get help filling out forms'}
          icon={DocumentIcon}
          variant="blue"
          onPress={() => navigate('/forms')}
        />
      </div>
    </div>
  );
}
