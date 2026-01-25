import React from 'react';
import { useLanguage } from '../LanguageContext';
import './LanguageToggle.css';

export default function LanguageToggle() {
  const { language, selectLanguage } = useLanguage();

  return (
    <div className="language-toggle">
      <button
        className={`language-toggle-button ${language === 'en' ? 'active' : ''}`}
        onClick={() => selectLanguage('en')}
      >
        EN
      </button>
      <button
        className={`language-toggle-button ${language === 'hi' ? 'active' : ''}`}
        onClick={() => selectLanguage('hi')}
      >
        हिं
      </button>
    </div>
  );
}
