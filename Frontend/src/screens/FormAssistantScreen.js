import React, { useRef, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import BigButton from '../components/BigButton';
import './FormAssistantScreen.css';

const BACKEND_URL = "http://127.0.0.1:8000"; // change for prod

export default function FormAssistantScreen() {
  const { language } = useLanguage();
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);  // For photo field uploads
  const audioRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Step 1: Upload form
  const [sessionId, setSessionId] = useState(null);
  const [formAnalysis, setFormAnalysis] = useState(null);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState(null);
  
  // Step 2: Confirm to start
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Step 3: Fill fields
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [photoFile, setPhotoFile] = useState(null);  // For photo uploads
  const [isRecording, setIsRecording] = useState(false);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  // Step 4: Completed
  const [completed, setCompleted] = useState(false);
  const [summary, setSummary] = useState(null);

  const pickImage = () => {
    fileInputRef.current.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BACKEND_URL}/api/analyze-form`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      console.log("AI Result:", data);
      
      setSessionId(data.session_id);
      setFormAnalysis(data.form_analysis);
      setVoiceNoteUrl(data.voice_note_url ? `${BACKEND_URL}${data.voice_note_url}` : null);
      setShowConfirmation(true);
      
      // Don't auto-play - let user control with audio controls

    } catch (err) {
      console.error(err);
      setError(language === 'hi' ? 'अपलोड विफल रहा' : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const playVoice = (url) => {
    if (audioRef.current && url) {
      audioRef.current.src = url;
      audioRef.current.play().catch(e => console.log("Audio play error:", e));
    }
  };

  const handleStartFilling = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("session_id", sessionId);

      const res = await fetch(`${BACKEND_URL}/api/start-filling`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (data.completed) {
        setCompleted(true);
        setSummary(data.message);
      } else {
        setShowConfirmation(false);
        setCurrentQuestion(data);
        
        // Don't auto-play - user controls audio
      }
    } catch (err) {
      console.error(err);
      setError(language === 'hi' ? 'त्रुटि हुई' : 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setFieldValue(`📷 ${file.name}`);
    }
  };

  const openPhotoSelector = () => {
    photoInputRef.current.click();
  };

  const handleSubmitField = async () => {
    // Check if field has value (text or photo)
    const isPhotoField = currentQuestion?.field_type === 'photo';
    
    if (!isPhotoField && !fieldValue.trim()) {
      alert(language === 'hi' ? 'कृपया उत्तर दर्ज करें' : 'Please enter an answer');
      return;
    }
    
    if (isPhotoField && !photoFile) {
      alert(language === 'hi' ? 'कृपया फोटो अपलोड करें' : 'Please upload a photo');
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("session_id", sessionId);
      
      if (isPhotoField && photoFile) {
        formData.append("field_value", `Photo: ${photoFile.name}`);
        formData.append("photo", photoFile);
      } else {
        formData.append("field_value", fieldValue);
      }

      const res = await fetch(`${BACKEND_URL}/api/submit-field`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (data.completed) {
        // Generate final form
        await generateFilledForm();
      } else {
        setCurrentQuestion(data);
        setFieldValue('');
        setPhotoFile(null);
        
        // Don't auto-play - user controls audio
      }
    } catch (err) {
      console.error(err);
      setError(language === 'hi' ? 'त्रुटि हुई' : 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateFilledForm = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("session_id", sessionId);

      const res = await fetch(`${BACKEND_URL}/api/generate-filled-form`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      setCompleted(true);
      setSummary(data);
      setCurrentQuestion(null);
      
      // Don't auto-play - user controls audio
    } catch (err) {
      console.error(err);
      setError(language === 'hi' ? 'त्रुटि हुई' : 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSessionId(null);
    setFormAnalysis(null);
    setVoiceNoteUrl(null);
    setShowConfirmation(false);
    setCurrentQuestion(null);
    setFieldValue('');
    setPhotoFile(null);
    setCompleted(false);
    setSummary(null);
    setError(null);
    setUseVoiceInput(false);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendVoiceToServer(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
      alert(language === 'hi' ? 'माइक्रोफ़ोन एक्सेस विफल' : 'Microphone access failed');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceToServer = async (audioBlob) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('language', language);

      const res = await fetch(`${BACKEND_URL}/api/speech-to-text`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFieldValue(data.text);
      } else {
        throw new Error('Speech recognition failed');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'hi' ? 'आवाज पहचान विफल' : 'Voice recognition failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-assistant-screen">
      <h1 className="form-title">
        {language === 'hi' ? 'फॉर्म सहायक' : 'Form Assistant'}
      </h1>

      <audio ref={audioRef} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handlePhotoSelect}
      />

      {/* Step 1: Upload Form */}
      {!sessionId && !completed && (
        <div className="upload-section">
          <BigButton
            title={language === 'hi' ? 'फोटो अपलोड करें' : 'Upload Form Photo'}
            onPress={pickImage}
            variant="primary"
          />
        </div>
      )}

      {loading && <p className="loading-text">🔄 {language === 'hi' ? 'कृपया प्रतीक्षा करें...' : 'Please wait...'}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Step 2: Show Form Analysis & Ask Confirmation */}
      {showConfirmation && formAnalysis && (
        <div className="analysis-box">
          <h3>{formAnalysis.form_name || 'Form'}</h3>
          
          {/* Voice Note Player */}
          {voiceNoteUrl && (
            <div className="voice-player-section">
              <p className="voice-label">🔊 {language === 'hi' ? 'आवाज़ संदेश सुनें:' : 'Listen to voice message:'}</p>
              <audio controls className="audio-player">
                <source src={voiceNoteUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          
          <p><b>{language === 'hi' ? 'उद्देश्य' : 'Purpose'}:</b> {formAnalysis.purpose}</p>
          <p><b>{language === 'hi' ? 'पात्रता' : 'Eligibility'}:</b> {formAnalysis.eligibility}</p>

          <h4>{language === 'hi' ? 'फील्ड्स' : 'Fields'}:</h4>
          <ul>
            {formAnalysis?.fields?.length > 0 ? (
              formAnalysis.fields.map((f, i) => (
                <li key={i}>
                  <b>{f.field_name}</b>: {f.description}
                </li>
              ))
            ) : (
              <li>{language === 'hi' ? 'कोई फील्ड नहीं मिला' : 'No fields detected'}</li>
            )}
          </ul>

          {formAnalysis?.warnings?.length > 0 && (
            <>
              <h4>{language === 'hi' ? 'चेतावनी' : 'Warnings'}:</h4>
              <ul>
                {formAnalysis.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </>
          )}

          <div className="button-group">
            <BigButton
              title={language === 'hi' ? 'हाँ, भरें' : 'Yes, Fill It'}
              onPress={handleStartFilling}
              variant="primary"
            />
            <BigButton
              title={language === 'hi' ? 'रद्द करें' : 'Cancel'}
              onPress={resetForm}
              variant="secondary"
            />
          </div>
        </div>
      )}

      {/* Step 3: Ask Questions One by One */}
      {currentQuestion && !completed && (
        <div className="question-box">
          <div className="progress-bar">
            <span>
              {language === 'hi' ? 'प्रगति' : 'Progress'}: {(currentQuestion.field_index ?? 0) + 1} / {currentQuestion.total_fields ?? 0}
            </span>
          </div>
          
          <h3>{language === 'hi' ? 'प्रश्न' : 'Question'} {(currentQuestion.field_index ?? 0) + 1}</h3>
          <p className="question-text">{currentQuestion.question}</p>
          
          {/* Voice Note Player for this question */}
          {currentQuestion.voice_url && (
            <div className="voice-player-section">
              <audio controls className="audio-player">
                <source src={`${BACKEND_URL}${currentQuestion.voice_url}`} type="audio/mpeg" />
              </audio>
            </div>
          )}
          
          {/* Photo Field */}
          {currentQuestion.field_type === 'photo' ? (
            <div className="photo-input-section">
              <button className="photo-button" onClick={openPhotoSelector}>
                📷 {language === 'hi' ? 'फोटो लें या अपलोड करें' : 'Take Photo or Upload'}
              </button>
              {photoFile && (
                <div className="photo-preview">
                  <p>✅ {photoFile.name}</p>
                  <img 
                    src={URL.createObjectURL(photoFile)} 
                    alt="Preview" 
                    className="photo-thumbnail"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Input Method Toggle */}
              <div className="input-method-toggle">
                <button 
                  className={!useVoiceInput ? 'toggle-active' : 'toggle-inactive'}
                  onClick={() => setUseVoiceInput(false)}
                >
                  ⌨️ {language === 'hi' ? 'टाइप करें' : 'Type'}
                </button>
                <button 
                  className={useVoiceInput ? 'toggle-active' : 'toggle-inactive'}
                  onClick={() => setUseVoiceInput(true)}
                >
                  🎤 {language === 'hi' ? 'बोलें' : 'Speak'}
                </button>
              </div>
              
              {!useVoiceInput ? (
                <input
                  type={currentQuestion.field_type === 'number' ? 'number' : 'text'}
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  placeholder={language === 'hi' ? 'यहाँ अपना उत्तर दर्ज करें' : 'Enter your answer here'}
                  className="field-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitField()}
                />
              ) : (
                <div className="voice-input-section">
                  {!isRecording ? (
                    <button className="mic-button" onClick={startVoiceRecording}>
                      🎤 {language === 'hi' ? 'रिकॉर्डिंग शुरू करें' : 'Start Recording'}
                    </button>
                  ) : (
                    <button className="mic-button recording" onClick={stopVoiceRecording}>
                      ⏹️ {language === 'hi' ? 'रिकॉर्डिंग बंद करें' : 'Stop Recording'}
                    </button>
                  )}
                  {fieldValue && (
                    <p className="transcribed-text">
                      {language === 'hi' ? 'आपका उत्तर:' : 'Your answer:'} "{fieldValue}"
                    </p>
                  )}
                </div>
              )}
            </>
          )}
          
          <div className="button-group">
            <BigButton
              title={language === 'hi' ? 'अगला' : 'Next'}
              onPress={handleSubmitField}
              variant="primary"
            />
          </div>
        </div>
      )}

      {/* Step 4: Show Summary */}
      {completed && summary && (
        <div className="completion-box">
          <h2>✅ {language === 'hi' ? 'पूर्ण!' : 'Completed!'}</h2>
          
          {/* Voice Note for Summary */}
          {summary.voice_url && (
            <div className="voice-player-section">
              <p className="voice-label">🔊 {language === 'hi' ? 'सारांश सुनें:' : 'Listen to summary:'}</p>
              <audio controls className="audio-player">
                <source src={`${BACKEND_URL}${summary.voice_url}`} type="audio/mpeg" />
              </audio>
            </div>
          )}
          
          <p className="summary-text">{summary.message || summary}</p>
          
          {/* Show Filled Form */}
          {summary.filled_form_text && (
            <div className="filled-form-display">
              <h3>{language === 'hi' ? 'भरा हुआ फॉर्म:' : 'Filled Form:'}</h3>
              <pre className="form-content">{summary.filled_form_text}</pre>
              <button 
                className="download-button"
                onClick={() => {
                  const blob = new Blob([summary.filled_form_text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${summary.form_name || 'form'}_filled.txt`;
                  a.click();
                }}
              >
                💾 {language === 'hi' ? 'डाउनलोड करें' : 'Download'}
              </button>
            </div>
          )}
          
          {summary.field_responses && (
            <div className="responses-summary">
              <h4>{language === 'hi' ? 'आपके उत्तर:' : 'Your Responses:'}</h4>
              <ul>
                {Object.entries(summary.field_responses).map(([field, value], i) => (
                  <li key={i}>
                    <b>{field}:</b> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <BigButton
            title={language === 'hi' ? 'नया फॉर्म' : 'New Form'}
            onPress={resetForm}
            variant="primary"
          />
        </div>
      )}
    </div>
  );
}
