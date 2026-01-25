import React from 'react';
import { useLanguage } from '../LanguageContext';
import BigButton from '../components/BigButton';
import './SchemeResultsScreen.css';

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const mockSchemes = [
  {
    id: '1',
    name: 'PM-Kisan Samman Nidhi',
    eligibility: 'Farmers with land up to 2 hectares',
    benefit: '₹6,000/year in 3 installments',
  },
  {
    id: '2',
    name: 'Old Age Pension',
    eligibility: 'Senior citizens above 60 years',
    benefit: '₹500-1000/month pension',
  },
  {
    id: '3',
    name: 'Ayushman Bharat',
    eligibility: 'Families with annual income below ₹2.5 lakh',
    benefit: 'Free health insurance up to ₹5 lakh',
  },
];

export default function SchemeResultsScreen() {
  const { language } = useLanguage();

  return (
    <div className="scheme-results-screen">
      <div className="you-said-box">
        <h3 className="you-said-title">
          {language === 'hi' ? 'आपने कहा:' : 'You said:'}
        </h3>
        <p className="you-said-text">
          {language === 'hi' 
            ? '"मैं 62 साल का हूं, किसान, आय ₹2 लाख"' 
            : '"I am 62 years old, a farmer, income ₹2 lakh"'}
        </p>
      </div>

      <h2 className="results-title">
        {language === 'hi' ? 'आपके लिए योजनाएं:' : 'Schemes for you:'}
      </h2>

      <div className="schemes-list">
        {mockSchemes.map((scheme) => (
          <div key={scheme.id} className="scheme-card">
            <div className="scheme-header">
              <CheckIcon />
              <h3 className="scheme-name">{scheme.name}</h3>
            </div>
            <div className="scheme-detail">
              <span className="detail-label">
                {language === 'hi' ? 'योग्यता:' : 'Eligibility:'}
              </span>
              <span className="detail-value">{scheme.eligibility}</span>
            </div>
            <div className="scheme-detail">
              <span className="detail-label">
                {language === 'hi' ? 'लाभ:' : 'Benefit:'}
              </span>
              <span className="detail-value benefit">{scheme.benefit}</span>
            </div>
          </div>
        ))}
      </div>

      <BigButton
        title={language === 'hi' ? 'फिर से खोजें' : 'Search Again'}
        onPress={() => window.history.back()}
        variant="primary"
      />
    </div>
  );
}
