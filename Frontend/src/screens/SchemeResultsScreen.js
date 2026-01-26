import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import SchemeFinderForm from '../components/SchemeFinderForm';
import SchemeResults from '../components/SchemeResults';
import './SchemeResultsScreen.css';

export default function SchemeResultsScreen() {
  const location = useLocation();
  const { language: globalLanguage } = useLanguage();
  const language = useMemo(() => {
    return globalLanguage || (location.state && location.state.language ? location.state.language : 'en');
  }, [globalLanguage, location.state]);
  const transcript = location.state && location.state.transcript ? location.state.transcript : '';
  const [schemes, setSchemes] = useState([]);

  const countLabel = language === 'hi'
    ? `${schemes.length} योजनाएं उपलब्ध हैं`
    : `${schemes.length} schemes available`;

  return (
    <div className="scheme-results-screen">
      {transcript ? (
        <div className="you-said-box">
          <p className="you-said-title">{language === 'hi' ? 'आपने कहा:' : 'You said:'}</p>
          <p className="you-said-text">{transcript}</p>
        </div>
      ) : null}

      <div className="scheme-page">
        <aside className="scheme-sidebar">
          <SchemeFinderForm onResult={setSchemes} />
        </aside>

        <main className="scheme-content">
          <div className="scheme-topbar">
            <div className="scheme-count">{countLabel}</div>
          </div>

          <SchemeResults schemes={schemes} language={language} />
        </main>
      </div>
    </div>
  );
}
