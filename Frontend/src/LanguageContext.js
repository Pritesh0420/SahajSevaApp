import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('sahajSevaLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('sahajSevaLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, selectLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
