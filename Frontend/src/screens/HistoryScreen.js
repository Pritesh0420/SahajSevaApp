import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
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

const mockHistory = [
  { id: '1', type: 'scheme', title: 'PM-KISAN Eligibility Check', date: '20 Jan 2024', icon: 'mic' },
  { id: '2', type: 'form', title: 'Ration Card Application', date: '19 Jan 2024', icon: 'document' },
  { id: '3', type: 'scheme', title: 'Ayushman Bharat Search', date: '18 Jan 2024', icon: 'mic' },
  { id: '4', type: 'form', title: 'Pension Form', date: '15 Jan 2024', icon: 'document' },
];

export default function HistoryScreen() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filteredHistory = filter === 'all' 
    ? mockHistory 
    : mockHistory.filter(item => item.type === filter);

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
