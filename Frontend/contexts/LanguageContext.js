import React, { createContext, useContext, useState } from 'react';

const translations = {
  appName: { en: 'Sahaj Seva', hi: 'सहज सेवा' },
  tagline: { en: 'Your Digital Government Helper', hi: 'आपका डिजिटल सरकारी सहायक' },
  home: { en: 'Home', hi: 'होम' },
  history: { en: 'History', hi: 'इतिहास' },
  help: { en: 'Help', hi: 'मदद' },
  welcomeTitle: { en: 'Welcome to Sahaj Seva', hi: 'सहज सेवा में आपका स्वागत है' },
  selectLanguage: { en: 'Select Your Language', hi: 'अपनी भाषा चुनें' },
  hindi: { en: 'हिंदी', hi: 'हिंदी' },
  english: { en: 'English', hi: 'English' },
  speakToSelect: { en: 'Or speak to select', hi: 'या बोलकर चुनें' },
  findSchemes: { en: 'Find Government Schemes', hi: 'सरकारी योजनाएं खोजें' },
  findSchemesDesc: { en: 'Speak about yourself to discover eligible schemes', hi: 'अपने बारे में बोलें और योजनाएं खोजें' },
  fillForm: { en: 'Understand & Fill a Form', hi: 'फॉर्म समझें और भरें' },
  fillFormDesc: { en: 'Upload a form photo for step-by-step guidance', hi: 'फॉर्म की फोटो अपलोड करें' },
  speakNow: { en: 'Tap and Speak', hi: 'टैप करें और बोलें' },
  listening: { en: 'Listening...', hi: 'सुन रहे हैं...' },
  speakHint: { en: 'Tell us your age, job, and income...', hi: 'अपनी उम्र, काम और आय बताएं...' },
  speakExample: { en: '"I am 62 years old, a farmer, income ₹2 lakh"', hi: '"मैं 62 साल का किसान हूं, आय ₹2 लाख"' },
  schemesFound: { en: 'Schemes Found for You', hi: 'आपके लिए योजनाएं मिलीं' },
  listenExplanation: { en: 'Listen to Explanation', hi: 'व्याख्या सुनें' },
  saveScheme: { en: 'Save', hi: 'सेव करें' },
  takePhoto: { en: 'Take Photo of Form', hi: 'फॉर्म की फोटो लें' },
  uploadFile: { en: 'Upload from Gallery', hi: 'गैलरी से अपलोड करें' },
  formPreview: { en: 'Form Preview', hi: 'फॉर्म प्रीव्यू' },
  explainForm: { en: 'Explain This Form', hi: 'यह फॉर्म समझाएं' },
  whatIsForm: { en: 'What is this form?', hi: 'यह फॉर्म क्या है?' },
  whoShouldFill: { en: 'Who should fill it?', hi: 'इसे कौन भरे?' },
  benefits: { en: 'Benefits you will receive', hi: 'आपको मिलने वाले लाभ' },
  warnings: { en: 'Important warnings', hi: 'महत्वपूर्ण चेतावनी' },
  fieldGuide: { en: 'Field-by-Field Guide', hi: 'फील्ड-दर-फील्ड गाइड' },
  fieldName: { en: 'Field Name', hi: 'फील्ड का नाम' },
  whatToWrite: { en: 'What to Write', hi: 'क्या लिखें' },
  listenWhileFill: { en: 'Listen While You Fill', hi: 'भरते समय सुनें' },
  recentActivity: { en: 'Recent Activity', hi: 'हालिया गतिविधि' },
  noHistory: { en: 'No history yet', hi: 'अभी कोई इतिहास नहीं' },
  schemes: { en: 'Schemes', hi: 'योजनाएं' },
  forms: { en: 'Forms', hi: 'फॉर्म' },
  helpTitle: { en: 'How can we help?', hi: 'हम कैसे मदद करें?' },
  faq: { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न' },
  callHelp: { en: 'Call for Help', hi: 'मदद के लिए कॉल करें' },
  watchTutorial: { en: 'Watch Tutorial Video', hi: 'ट्यूटोरियल वीडियो देखें' },
  back: { en: 'Back', hi: 'वापस' },
  next: { en: 'Next', hi: 'आगे' },
  cancel: { en: 'Cancel', hi: 'रद्द करें' },
  done: { en: 'Done', hi: 'हो गया' },
  loading: { en: 'Loading...', hi: 'लोड हो रहा है...' },
  error: { en: 'Something went wrong', hi: 'कुछ गलत हो गया' },
  tryAgain: { en: 'Try Again', hi: 'फिर से कोशिश करें' },
  
  // Home cards
  homeFindSchemesTitle: { en: 'Find Schemes for Me', hi: 'मेरे लिए योजनाएँ खोजें' },
  homeFindSchemesDesc: { en: 'Discover government schemes you may be eligible for', hi: 'सरकारी योजनाएँ खोजें जिनके लिए आप पात्र हैं' },
  homeFindSchemesCTA: { en: 'Go', hi: 'जाएँ' },
  homeFillFormTitle: { en: 'Help Me Fill a Form', hi: 'मदद करें फॉर्म भरने में' },
  homeFillFormDesc: { en: 'Understand and fill government forms with guidance', hi: 'सरकारी फॉर्म समझें और मार्गदर्शन के साथ भरें' },
  homeFillFormCTA: { en: 'Go', hi: 'जाएँ' },
  homeQuickTipTitle: { en: 'Quick Tip', hi: 'त्वरित सुझाव' },
  homeQuickTipDesc: { en: 'Press the big mic button and speak about your age, job and income.', hi: 'बड़े माइक्रोफोन बटन दबाएँ और अपनी उम्र, काम और आय बोलें।' },
  homeRecentTitle: { en: 'Recent Activity', hi: 'हाल की गतिविधि' },
  homeRecentDesc: { en: 'No history yet', hi: 'अभी कोई इतिहास नहीं' },

  // Scheme flow
  schemeTapSpeakTitle: { en: 'Tap and Speak', hi: 'टैप करें और बोलें' },
  schemeTapSpeakHint: { en: 'Tell us your age, job, and income...', hi: 'अपनी उम्र, काम और आय बताएं...' },
  schemeExample: { en: '"I am 62 years old, a farmer, income ₹2 lakh"', hi: '"मैं 62 साल का हूं, किसान, आय ₹2 लाख"' },
  schemeListeningTitle: { en: 'Listening...', hi: 'सुन रहे हैं...' },
  schemeListeningHint: { en: 'Tell us your age, job, and income...', hi: 'अपनी उम्र, काम और आय बताएं...' },
  schemeRecordingLabel: { en: '• Recording...', hi: '• रिकॉर्ड हो रहा है...' },
  schemeResultsHeader: { en: 'Schemes Found for You (3)', hi: 'आपके लिए मिली योजनाएँ (3)' },
  schemeYouSaidLabel: { en: 'You said:', hi: 'आपने कहा:' },
  schemeListenDetailsCTA: { en: 'Listen to Details', hi: 'विवरण सुनें' },
  schemeSearchAgainCTA: { en: 'Search Again', hi: 'फिर से खोजें' },
};

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null); // null until user selects

  const t = (key) => {
    const entry = translations[key];
    if (!entry) {
      console.warn('Missing translation for', key);
      return key;
    }
    const lang = language || 'en';
    return entry[lang] || entry.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};

export default LanguageContext;
