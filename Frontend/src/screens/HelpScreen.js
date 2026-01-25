import React from 'react';
import { useLanguage } from '../LanguageContext';
import './HelpScreen.css';

export default function HelpScreen() {
  const { language } = useLanguage();

  return (
    <div className="help-screen">
      <h1 className="help-title">
        {language === 'hi' ? 'सहायता' : 'Help & Support'}
      </h1>

      <div className="help-section">
        <h2 className="section-title">
          {language === 'hi' ? 'कैसे उपयोग करें' : 'How to Use'}
        </h2>
        <div className="help-card">
          <h3 className="card-title">
            {language === 'hi' ? '1. योजना खोजें' : '1. Discover Schemes'}
          </h3>
          <p className="card-text">
            {language === 'hi' 
              ? 'माइक बटन पर टैप करें और अपनी उम्र, पेशा और आय बताएं। हम आपके लिए उपयुक्त योजनाएं खोजेंगे।' 
              : 'Tap the mic button and tell us your age, occupation, and income. We will find suitable schemes for you.'}
          </p>
        </div>

        <div className="help-card">
          <h3 className="card-title">
            {language === 'hi' ? '2. फॉर्म सहायता' : '2. Form Assistant'}
          </h3>
          <p className="card-text">
            {language === 'hi' 
              ? 'फॉर्म की फोटो अपलोड करें और हम आपको कदम-दर-कदम भरने में मदद करेंगे।' 
              : 'Upload a photo of your form and we will help you fill it step-by-step.'}
          </p>
        </div>
      </div>

      <div className="help-section">
        <h2 className="section-title">
          {language === 'hi' ? 'संपर्क करें' : 'Contact Us'}
        </h2>
        <div className="contact-info">
          <p className="contact-item">
            <strong>{language === 'hi' ? 'ईमेल:' : 'Email:'}</strong> support@sahajseva.gov.in
          </p>
          <p className="contact-item">
            <strong>{language === 'hi' ? 'हेल्पलाइन:' : 'Helpline:'}</strong> 1800-XXX-XXXX
          </p>
        </div>
      </div>
    </div>
  );
}
