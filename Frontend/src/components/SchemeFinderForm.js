
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const initialState = {
  age: "",
  gender: "",
  occupation: "",
  income: "",
  state: ""
};

const TEXT = {
  en: {
    title: "Discover Schemes",
    languageEn: "English",
    languageHi: "Hindi",
    age: "Age",
    gender: "Gender",
    occupation: "Occupation",
    income: "Annual Income (₹)",
    state: "State",
    genderPlaceholder: "Select",
    occupationPlaceholder: "Select",
    statePlaceholder: "Select",
    finding: "Finding...",
    submit: "Discover Schemes"
  },
  hi: {
    title: "योजनाएं खोजें",
    languageEn: "अंग्रेज़ी",
    languageHi: "हिंदी",
    age: "आयु",
    gender: "लिंग",
    occupation: "पेशा",
    income: "वार्षिक आय (₹)",
    state: "राज्य",
    genderPlaceholder: "चुनें",
    occupationPlaceholder: "चुनें",
    statePlaceholder: "चुनें",
    finding: "खोज रहे हैं...",
    submit: "योजनाएं खोजें"
  }
};

const OCCUPATIONS = [
  { value: "farmer", en: "Farmer", hi: "किसान" },
  { value: "student", en: "Student", hi: "छात्र" },
  { value: "labour", en: "Worker", hi: "मजदूर" },
  { value: "teacher", en: "Teacher", hi: "शिक्षक" },
  { value: "business", en: "Business", hi: "व्यापार" },
  { value: "other", en: "Other", hi: "अन्य" }
];

function normalizeInitialProfile(profile) {
  const p = profile || {};
  const rawGender = String(p.gender || "").trim();
  const genderLower = rawGender.toLowerCase();
  const genderMap = {
    male: "male",
    m: "male",
    man: "male",
    पुरुष: "male",
    female: "female",
    f: "female",
    woman: "female",
    महिला: "female",
    other: "other",
    अन्य: "other"
  };

  const normalizedGender = genderMap[rawGender] || genderMap[genderLower] || p.gender || "";
  // Normalize occupation to canonical values when possible
  const rawOcc = String(p.occupation || "").trim();
  const occLower = rawOcc.toLowerCase();
  const occMap = {
    farmer: "farmer",
    किसान: "farmer",
    student: "student",
    छात्र: "student",
    विद्यार्थी: "student",
    labour: "labour",
    labor: "labour",
    worker: "labour",
    मजदूर: "labour",
    teacher: "teacher",
    शिक्षक: "teacher",
    business: "business",
    व्यापर: "business",
    व्यापार: "business",
    दुकानदार: "business",
    other: "other",
    अन्य: "other"
  };
  const normalizedOccupation = occMap[rawOcc] || occMap[occLower] || p.occupation || "";

  return {
    ...initialState,
    ...p,
    gender: normalizedGender,
    occupation: normalizedOccupation
  };
}

export default function SchemeFinderForm({ onResult }) {
  const location = useLocation();
  const { language: globalLanguage, selectLanguage } = useLanguage();
  const initialProfile =
    location.state && location.state.initialProfile ? location.state.initialProfile : initialState;
  const normalizedInitialProfile = normalizeInitialProfile(initialProfile);
  const initialLang =
    location.state && location.state.language
      ? location.state.language
      : globalLanguage || "en";
  const [form, setForm] = useState(normalizedInitialProfile);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(initialLang);
  const t = TEXT[language] || TEXT.en;
  const [statesMeta, setStatesMeta] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const autoSearchTriggeredRef = useRef(false);
  const shouldAutoSearch = Boolean(
    location.state && (location.state.transcript || location.state.initialProfile)
  );

  // Keep local language in sync with global context.
  useEffect(() => {
    if (globalLanguage && globalLanguage !== language) {
      setLanguage(globalLanguage);
    }
  }, [globalLanguage, language]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/meta/states`);
        const data = await res.json();
        if (!cancelled) setStatesMeta(Array.isArray(data.states) ? data.states : []);
      } catch {
        if (!cancelled) setStatesMeta([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // If the form already has a display-name state (en/hi), convert it to a canonical key once metadata is loaded.
  useEffect(() => {
    if (!statesMeta.length) return;
    const current = String(form.state || "").trim();
    if (!current) return;
    const hasKey = statesMeta.some(s => s.key === current);
    if (hasKey) return;
    const match = statesMeta.find(
      s => String(s.en || "").toLowerCase() === current.toLowerCase() || String(s.hi || "") === current
    );
    if (match) setForm(prev => ({ ...prev, state: match.key }));
  }, [statesMeta, form.state]);

  const sortedStates = useMemo(() => {
    const list = [...statesMeta];
    list.sort((a, b) => String(a.en || "").localeCompare(String(b.en || "")));
    return list;
  }, [statesMeta]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const runSearch = useCallback(async (langOverride) => {
    const lang = langOverride || language;
    setLoading(true);
    try {
      const payload = { ...form, language: lang };
      const res = await fetch(`${API_BASE_URL}/api/scheme-finder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      onResult(data.schemes || []);
    } finally {
      setLoading(false);
    }
  }, [form, language, onResult]);

  const handleSubmit = async e => {
    e.preventDefault();
    setHasSubmitted(true);
    await runSearch(language);
  };

  // Auto-translate results on language toggle by re-running the search.
  useEffect(() => {
    if (!hasSubmitted) return;
    runSearch(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Auto-search once when arriving from voice flow (transcript/initialProfile in location.state).
  useEffect(() => {
    if (!shouldAutoSearch) return;
    if (autoSearchTriggeredRef.current) return;

    const currentState = String(form.state || "").trim();
    if (currentState) {
      const hasKey = statesMeta.some(s => s.key === currentState);
      if (!hasKey) {
        // Wait for metadata to load so we can convert display-name -> key.
        if (!statesMeta.length) return;
        const match = statesMeta.find(
          s =>
            String(s.en || "").toLowerCase() === currentState.toLowerCase() ||
            String(s.hi || "") === currentState
        );
        if (match) {
          setForm(prev => ({ ...prev, state: match.key }));
          return;
        }
      }
    }

    autoSearchTriggeredRef.current = true;
    setHasSubmitted(true);
    runSearch(language);
  }, [form.state, language, runSearch, shouldAutoSearch, statesMeta]);

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 16 }}>
      <h2 style={{ textAlign: "center", marginBottom: 12 }}>{t.title}</h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        {["en", "hi"].map(code => (
          <button
            key={code}
            type="button"
            onClick={() => {
              setLanguage(code);
              selectLanguage(code);
            }}
            style={{
              background: language === code ? "#4A7C59" : "#eee",
              color: language === code ? "#fff" : "#333",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              marginRight: 8,
              cursor: "pointer"
            }}
          >
            {code === "en" ? t.languageEn : t.languageHi}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <label style={{ fontWeight: 600, minWidth: 110 }}>{t.age}</label>
        <input name="age" type="number" placeholder={t.age} value={form.age} onChange={handleChange} required style={{ flex: 1, fontSize: 16, padding: 6 }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <label style={{ fontWeight: 600, minWidth: 110 }}>{t.gender}</label>
        <select name="gender" value={form.gender} onChange={handleChange} required style={{ flex: 1, fontSize: 16, padding: 6 }}>
          <option value="">{t.genderPlaceholder}</option>
          <option value="male">{language === "hi" ? "पुरुष" : "Male"}</option>
          <option value="female">{language === "hi" ? "महिला" : "Female"}</option>
          <option value="other">{language === "hi" ? "अन्य" : "Other"}</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <label style={{ fontWeight: 600, minWidth: 110 }}>{t.occupation}</label>
        <select name="occupation" value={form.occupation} onChange={handleChange} required style={{ flex: 1, fontSize: 16, padding: 6 }}>
          <option value="">{t.occupationPlaceholder}</option>
          {OCCUPATIONS.map(o => (
            <option key={o.value} value={o.value}>
              {language === "hi" ? o.hi : o.en}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <label style={{ fontWeight: 600, minWidth: 110 }}>{t.income}</label>
        <input name="income" type="number" placeholder={language === "hi" ? "आय" : "Income"} value={form.income} onChange={handleChange} required style={{ flex: 1, fontSize: 16, padding: 6 }} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        <label style={{ fontWeight: 600, minWidth: 110 }}>{t.state}</label>
        <select name="state" value={form.state} onChange={handleChange} required style={{ flex: 1, fontSize: 16, padding: 6 }}>
          <option value="">{t.statePlaceholder}</option>
          {sortedStates.map(s => (
            <option key={s.key} value={s.key}>
              {language === "hi" ? s.hi : s.en}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading} style={{ width: "100%", fontSize: 18, background: "#4A7C59", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", marginTop: 12, cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? t.finding : t.submit}
      </button>
    </form>
  );
}
