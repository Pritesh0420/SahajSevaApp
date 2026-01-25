import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import './BottomNav.css';

const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const SearchIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const DocumentIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const HistoryIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const HelpIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  const tabs = [
    { path: '/', label: language === 'hi' ? 'होम' : 'Home', Icon: HomeIcon },
    { path: '/schemes', label: language === 'hi' ? 'योजना' : 'Schemes', Icon: SearchIcon },
    { path: '/forms', label: language === 'hi' ? 'फॉर्म' : 'Forms', Icon: DocumentIcon },
    { path: '/history', label: language === 'hi' ? 'इतिहास' : 'History', Icon: HistoryIcon },
    { path: '/help', label: language === 'hi' ? 'सहायता' : 'Help', Icon: HelpIcon },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/schemes') return location.pathname.startsWith('/schemes');
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      {tabs.map(({ path, label, Icon }) => {
        const active = isActive(path);
        return (
          <button
            key={path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon active={active} />
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
