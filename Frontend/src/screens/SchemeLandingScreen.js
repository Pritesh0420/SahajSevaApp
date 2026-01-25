import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import MicButton from '../components/MicButton';
import './SchemeLandingScreen.css';

export default function SchemeLandingScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="scheme-landing-screen">
      <h1 className="scheme-title">
        {language === 'hi' ? 'टैप करें और बोलें' : 'Tap and Speak'}
      </h1>
      <p className="scheme-subtitle">
        {language === 'hi' ? 'अपनी उम्र, काम और आय बताएं...' : 'Tell us your age, job, and income...'}
      </p>
      <div className="mic-container">
        <MicButton
          size="large"
          onPress={() => navigate('/schemes/listening')}
        />
      </div>
      <div className="example-box">
        <p className="example-text">
          {language === 'hi' 
            ? '"मैं 62 साल का हूं, किसान, आय ₹2 लाख"' 
            : '"I am 62 years old, a farmer, income ₹2 lakh"'}
        </p>
      </div>
    </div>
  );
}
