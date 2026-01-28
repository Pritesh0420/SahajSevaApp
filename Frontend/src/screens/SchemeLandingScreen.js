
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import MicButton from '../components/MicButton';
import './SchemeLandingScreen.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export default function SchemeLandingScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);

  // Improved parser for English/Hindi
  function parseProfile(text) {
    // Gender lookup
    const genderMap = {
      male: ["male", "पुरुष", "m", "boy", "लड़का"],
      female: ["female", "महिला", "f", "girl", "लड़की"],
      other: ["other", "अन्य"]
    };
    // State lookup (add more as needed)
    const stateMap = {
      up: ["uttar pradesh", "up", "उत्तर प्रदेश"],
      mh: ["maharashtra", "mh", "महाराष्ट्र"],
      gj: ["gujarat", "gj", "गुजरात"],
      dl: ["delhi", "dl", "दिल्ली"],
      br: ["bihar", "br", "बिहार"],
      mp: ["madhya pradesh", "mp", "मध्य प्रदेश"]
      // Add more states as needed
    };
    // Occupation lookup (expand as needed)
    const occupationList = ["farmer", "किसान", "student", "teacher", "labour", "worker", "business", "businessman", "engineer", "doctor", "महिला", "पुरुष", "other"];

    let ageMatch = text.match(/(\d{2})/);
    let occupationMatch = occupationList.find(o => text.toLowerCase().includes(o));
    let incomeMatch = text.match(/(\d+[\s,]*लाख|\d+[\s,]*thousand|\d+[\s,]*हजार|\d+[\s,]*[kK])/);

    // Gender detection
    let gender = '';
    for (const [key, arr] of Object.entries(genderMap)) {
      if (arr.some(g => text.toLowerCase().includes(g))) {
        gender = key;
        break;
      }
    }

    // State detection
    let state = '';
    for (const arr of Object.values(stateMap)) {
      if (arr.some(s => text.toLowerCase().includes(s))) {
        state = arr[0]; // Use full state name
        break;
      }
    }

    let age = ageMatch ? ageMatch[0] : '';
    let occupation = occupationMatch || '';
    let income = incomeMatch ? incomeMatch[0].replace(/[^\d]/g, '') : '';
    return {
      age,
      gender,
      occupation,
      income,
      state
    };
  }

  const handleMic = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    setIsListening(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      (async () => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript;
        try {
          const res = await fetch(`${API_BASE_URL}/api/profile/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: transcript, language })
          });
          if (!res.ok) throw new Error('extract failed');
          const profile = await res.json();
          navigate('/schemes/results', { state: { initialProfile: profile, language, transcript } });
        } catch (e) {
          const profile = parseProfile(transcript);
          navigate('/schemes/results', { state: { initialProfile: profile, language, transcript } });
        }
      })();
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      alert('Voice input error: ' + event.error);
    };
    recognition.start();
  };

  return (
    <div className="scheme-landing-screen">
      <h1 className="scheme-title">
        {language === 'hi' ? 'टैप करें और बोलें' : 'Tap and Speak'}
      </h1>
      <p className="scheme-subtitle">
        {language === 'hi' ? 'अपनी उम्र, काम और आय बताएं...' : 'Tell us your age, job, and income...'}
      </p>
      <div className="mic-container">
        <MicButton
          size="large"
          isListening={isListening}
          onPress={handleMic}
        />
      </div>
      <div className="example-box">
        <p className="example-text">
          {language === 'hi' 
            ? '"मैं 62 साल का हूं, किसान, आय ₹2 लाख"' 
            : '"I am 62 years old, a farmer, income ₹2 lakh"'}
        </p>
      </div>
    </div>
  );
}
