import React from "react";
import { addSchemeToHistory } from "../utils/historyManager";

export default function SchemeResults({ schemes, language = "en" }) {
  const TEXT = {
    en: {
      noSchemes: "No eligible schemes found.",
      eligibleTitle: "Eligible Schemes",
      benefits: "Benefits",
      why: "Why",
      applyNow: "Apply Now",
      moreTitle: "Search More Government Schemes",
      moreDesc: "Explore all central and state schemes on the official MyScheme portal",
      visitMyScheme: "Visit MyScheme Portal",
    },
    hi: {
      noSchemes: "कोई उपयुक्त योजना नहीं मिली।",
      eligibleTitle: "आपके लिए योग्य योजनाएं",
      benefits: "लाभ",
      why: "क्यों",
      applyNow: "अभी आवेदन करें",
      moreTitle: "अधिक सरकारी योजनाएं खोजें",
      moreDesc: "आधिकारिक MyScheme पोर्टल पर सभी केंद्रीय और राज्य योजनाओं का अन्वेषण करें",
      visitMyScheme: "MyScheme पोर्टल पर जाएं",
    },
  };

  const t = TEXT[language] || TEXT.en;

  if (!schemes || schemes.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: 24 }}>
        {t.noSchemes}
      </div>
    );

  return (
    <div className="schemes-list">
      <h3 className="results-title">{t.eligibleTitle}</h3>
      {schemes.map((s, i) => (
        <div key={i} className="scheme-card">
          <div className="scheme-header">
            <h4 className="scheme-name">{s.name}</h4>
            {s.portal_url && (
              <a
                href={s.portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-button"
                onClick={() => addSchemeToHistory(s)}
              >
                {t.applyNow}
              </a>
            )}
          </div>

          <div className="scheme-detail">
            <span className="detail-label">{t.benefits}</span>
            <span className="detail-value benefit">{s.benefits}</span>
          </div>

          <div className="scheme-detail">
            <span className="detail-label">{t.why}</span>
            <span className="detail-value">{s.why}</span>
          </div>
        </div>
      ))}

      {/* MyScheme Portal Link Section */}
      <div className="myscheme-section">
        <div className="myscheme-card">
          <h4 className="myscheme-title">{t.moreTitle}</h4>
          <p className="myscheme-desc">{t.moreDesc}</p>
          <a
            href="https://www.myscheme.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="myscheme-button"
          >
            {t.visitMyScheme}
          </a>
        </div>
      </div>
    </div>
  );
}
