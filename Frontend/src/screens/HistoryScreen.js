import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import './HistoryScreen.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
  </svg>
);

const FORMS = [
  {
    id: 'form-ration-card',
    type: 'form',
    icon: 'document',
    title_en: 'Ration Card Application',
    title_hi: 'राशन कार्ड आवेदन',
  },
  {
    id: 'form-pension',
    type: 'form',
    icon: 'document',
    title_en: 'Pension Form',
    title_hi: 'पेंशन फॉर्म',
  },
];

function formatDate(date, language) {
  const locale = language === 'hi' ? 'hi-IN' : 'en-GB';
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function HistoryScreen() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState('all');

  const [schemesMeta, setSchemesMeta] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/meta/schemes`);
        const data = await res.json();
        if (cancelled) return;
        setSchemesMeta(Array.isArray(data.schemes) ? data.schemes : []);
      } catch {
        if (!cancelled) setSchemesMeta([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const schemeItems = useMemo(() => {
    const now = Date.now();
    return schemesMeta.map((s, idx) => {
      const title = language === 'hi'
        ? (s.hi || s.en || '')
        : (s.en || s.hi || '');
      // Create a descending set of dates for a "history" feel.
      const dt = new Date(now - idx * 24 * 60 * 60 * 1000);
      return {
        id: `scheme-${s.key || idx}`,
        type: 'scheme',
        icon: 'mic',
        title,
        date: formatDate(dt, language),
      };
    });
  }, [language, schemesMeta]);

  const formItems = useMemo(() => {
    const now = Date.now();
    return FORMS.map((f, idx) => {
      const dt = new Date(now - (schemesMeta.length + idx + 1) * 24 * 60 * 60 * 1000);
      return {
        id: f.id,
        type: 'form',
        icon: f.icon,
        title: language === 'hi' ? f.title_hi : f.title_en,
        date: formatDate(dt, language),
      };
    });
  }, [language, schemesMeta.length]);

  const allItems = useMemo(() => {
    const combined = [...schemeItems, ...formItems];
    // Dates are strings; sorting isn't critical here, but keep schemes first for now.
    return combined;
  }, [formItems, schemeItems]);

  const filteredHistory = filter === 'all'
    ? allItems
    : allItems.filter(item => item.type === filter);

  return (
    <div className="history-screen">
      <h1 className="history-title">
        {language === 'hi' ? 'इतिहास' : 'History'}
      </h1>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {language === 'hi' ? 'सभी' : 'All'}
        </button>
        <button
          className={`filter-tab ${filter === 'scheme' ? 'active' : ''}`}
          onClick={() => setFilter('scheme')}
        >
          {language === 'hi' ? 'योजनाएं' : 'Schemes'}
        </button>
        <button
          className={`filter-tab ${filter === 'form' ? 'active' : ''}`}
          onClick={() => setFilter('form')}
        >
          {language === 'hi' ? 'फॉर्म' : 'Forms'}
        </button>
      </div>

      <div className="history-list">
        {loading ? (
          <div className="history-item" style={{ justifyContent: 'center', color: 'var(--color-text-light)' }}>
            {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
          </div>
        ) : null}

        {!loading && filteredHistory.length === 0 ? (
          <div className="history-item" style={{ justifyContent: 'center', color: 'var(--color-text-light)' }}>
            {language === 'hi' ? 'कोई आइटम नहीं' : 'No items'}
          </div>
        ) : null}

        {!loading && filteredHistory.map((item) => (
          <div key={item.id} className="history-item">
            <div className={`history-icon ${item.type}`}>
              {item.icon === 'mic' ? <MicIcon /> : <DocumentIcon />}
            </div>
            <div className="history-content">
              <h3 className="history-item-title">{item.title}</h3>
              <p className="history-item-date">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
