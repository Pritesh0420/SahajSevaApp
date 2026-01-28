import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { getHistory } from '../utils/historyManager';
import './HistoryScreen.css';

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

function formatDate(timestamp, language) {
  const locale = language === 'hi' ? 'hi-IN' : 'en-GB';
  const date = new Date(timestamp);
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Show relative time for recent items
  if (diffHours < 1) {
    return language === 'hi' ? 'अभी' : 'Just now';
  } else if (diffHours < 24) {
    return language === 'hi' 
      ? `${diffHours} घंटे पहले`
      : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return language === 'hi'
      ? `${diffDays} दिन पहले`
      : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function HistoryScreen() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    // Load history from localStorage
    const history = getHistory();
    const items = history.map(item => ({
      id: item.id,
      type: item.type,
      icon: item.type === 'scheme' ? 'mic' : 'document',
      title: item.type === 'scheme' ? item.schemeName : (item.fileName || item.formName || 'Form'),
      date: formatDate(item.timestamp, language),
      timestamp: item.timestamp,
    }));
    setHistoryItems(items);
  }, [language]);

  const filteredHistory = filter === 'all'
    ? historyItems
    : historyItems.filter(item => item.type === filter);

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
        {filteredHistory.length === 0 ? (
          <div className="history-empty">
            <div className="empty-icon">📋</div>
            <p className="empty-text">
              {language === 'hi' 
                ? 'अभी तक कोई इतिहास नहीं है' 
                : 'No history yet'}
            </p>
            <p className="empty-subtext">
              {language === 'hi'
                ? 'योजनाएं देखें या फॉर्म अपलोड करें'
                : 'View schemes or upload forms to see them here'}
            </p>
          </div>
        ) : null}

        {filteredHistory.map((item) => (
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
