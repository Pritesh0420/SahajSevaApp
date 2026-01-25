import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import MicButton from '../components/MicButton';
import './SchemeListeningScreen.css';

export default function SchemeListeningScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/schemes/results');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="scheme-listening-screen">
      <h1 className="listening-title">
        {language === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}
      </h1>
      <p className="listening-subtitle">
        {language === 'hi' ? 'अपनी उम्र, काम और आय बताएं...' : 'Tell us your age, job, and income...'}
      </p>
      <div className="mic-container">
        <MicButton size="large" isListening={true} />
      </div>
      <p className="recording-text">
        {language === 'hi' ? '• रिकॉर्ड हो रहा है...' : '• Recording...'}
      </p>
    </div>
  );
}
