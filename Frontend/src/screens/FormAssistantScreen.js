import React from 'react';
import { useLanguage } from '../LanguageContext';
import BigButton from '../components/BigButton';
import './FormAssistantScreen.css';

const CameraIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.2c1.77 0 3.2-1.43 3.2-3.2 0-1.77-1.43-3.2-3.2-3.2-1.77 0-3.2 1.43-3.2 3.2 0 1.77 1.43 3.2 3.2 3.2zm0-4.9c.93 0 1.7.77 1.7 1.7s-.77 1.7-1.7 1.7-1.7-.77-1.7-1.7.77-1.7 1.7-1.7z"/>
    <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 14H4V7h16v12z"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
);

export default function FormAssistantScreen() {
  const { language } = useLanguage();

  const handleCapture = () => {
    alert(language === 'hi' 
      ? 'कैमरा सुविधा जल्द ही उपलब्ध होगी' 
      : 'Camera feature coming soon');
  };

  const handleGallery = () => {
    alert(language === 'hi' 
      ? 'गैलरी सुविधा जल्द ही उपलब्ध होगी' 
      : 'Gallery feature coming soon');
  };

  return (
    <div className="form-assistant-screen">
      <h1 className="form-title">
        {language === 'hi' ? 'फॉर्म सहायता' : 'Form Assistant'}
      </h1>
      <p className="form-subtitle">
        {language === 'hi' 
          ? 'फॉर्म की फोटो अपलोड करें और हम आपको भरने में मदद करेंगे' 
          : 'Upload a photo of your form and we will help you fill it'}
      </p>

      <div className="upload-section">
        <BigButton
          title={language === 'hi' ? 'कैमरा से फोटो लें' : 'Take Photo with Camera'}
          icon={CameraIcon}
          onPress={handleCapture}
          variant="primary"
        />
        <BigButton
          title={language === 'hi' ? 'गैलरी से चुनें' : 'Choose from Gallery'}
          icon={ImageIcon}
          onPress={handleGallery}
          variant="secondary"
        />
      </div>

      <div className="info-box">
        <h3 className="info-title">
          {language === 'hi' ? 'समर्थित फॉर्म:' : 'Supported Forms:'}
        </h3>
        <ul className="info-list">
          <li>{language === 'hi' ? 'राशन कार्ड' : 'Ration Card'}</li>
          <li>{language === 'hi' ? 'पेंशन फॉर्म' : 'Pension Forms'}</li>
          <li>{language === 'hi' ? 'आधार कार्ड' : 'Aadhar Card'}</li>
          <li>{language === 'hi' ? 'सरकारी योजना आवेदन' : 'Government Scheme Applications'}</li>
        </ul>
      </div>
    </div>
  );
}
