import React from "react";

export default function SchemeResults({ schemes, language = "en" }) {
  if (!schemes || schemes.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: 24 }}>
        {language === "hi" ? "कोई उपयुक्त योजना नहीं मिली।" : "No eligible schemes found."}
      </div>
    );

  return (
    <div className="schemes-list">
      <h3 className="results-title">{language === "hi" ? "आपके लिए योग्य योजनाएं" : "Eligible Schemes"}</h3>
      {schemes.map((s, i) => (
        <div key={i} className="scheme-card">
          <div className="scheme-header">
            <h4 className="scheme-name">{s.name}</h4>
          </div>

          <div className="scheme-detail">
            <span className="detail-label">{language === "hi" ? "लाभ" : "Benefits"}</span>
            <span className="detail-value benefit">{s.benefits}</span>
          </div>

          <div className="scheme-detail">
            <span className="detail-label">{language === "hi" ? "क्यों" : "Why"}</span>
            <span className="detail-value">{s.why}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
