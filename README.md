<div align="center">
  <img src="D:\SahajSevaApp\Frontend\public\logo.png" alt="Sahaj Seva Logo" width="120" />
  
  <h1>Sahaj Seva (सहज सेवा) 🇮🇳</h1>
  <p><b>Empowering Every Indian to Access Government Benefits with AI</b></p>
</div>

---

## 📑 Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Impact & Goal](#impact--goal)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📝 About

Sahaj Seva is an AI-powered companion designed to bridge the digital divide in India. It helps rural citizens and the elderly discover eligible government schemes through voice-enabled search and provides a "smart assistant" to help them understand and fill complex government forms—without fear or middlemen.

---

## 🌟 Key Features

### 1. AI Scheme Discovery (Voice-First)
- **Multilingual Input:** Speak in your native language (Hindi, Konkani, Marathi, etc.) to describe your profile.
- **Smart Eligibility Engine:** AI maps user attributes (Age, Occupation, Income) to a database of central and state schemes.
- **Simple Summaries:** Explains benefits in "plain talk" rather than legal jargon.

### 2. AI Form-Filling Assistant (Visual Guidance)
- **OCR Integration:** Uses Computer Vision to read uploaded images or PDFs of government forms.
- **Field-by-Field Guidance:** AI identifies each field (e.g., "Aadhaar Number," "IFSC Code") and explains exactly what to write.
- **Voice Instructions:** Converts text explanations into audio so users can listen while they write.

---

## 🏗️ Technical Architecture

- **Frontend:** React.js (Tailwind CSS for a clean, accessible UI)
- **Backend:** FastAPI (Python)
- **AI / LLM:** Google Gemini API / OpenAI (for scheme matching and form summarization)
- **OCR Engine:** EasyOCR / Tesseract (to extract text from forms)
- **Voice Engine:** gTTS (Google Text-to-Speech) / Bhashini API
- **Deployment:** Docker / Vercel (Frontend) & Render (Backend)

---

## ⚙️ How It Works

1. **Input Phase:** User enters details via a form or speaks to the AI assistant.
2. **Processing Phase:**
   - Scheme Finder matches the user profile against a JSON/Database of government schemes.
   - Form Assistant processes uploaded documents via OCR to identify input fields.
3. **Output Phase:**
   - AI generates a simplified walkthrough.
   - TTS (Text-to-Speech) engine converts this into an MP3 file, which plays back to the user in their chosen language.

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js & npm
- API Keys: Gemini API / OpenAI API

### Installation

#### 1. Clone the repo

```bash
git clone https://github.com/your-username/sahaj-seva.git
cd sahaj-seva
```

#### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

#### 3. Mobile App (Expo) Setup

```bash
# From project root
npm install

# Ensure Expo picks compatible versions for React Native deps
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack react-native-safe-area-context react-native-screens

# Start Metro
npx expo start

# On another terminal, launch on Android emulator or device
# (emulator must be running or connected)
npx expo start --android
```

If Android emulator is not installed locally, push this repo to GitHub and run the commands above on a machine with Android Studio + AVD set up.

Troubleshooting:
- If you see a native type error on Android, clear caches: `npx expo start -c`.
- Use `npx expo install ...` to auto-align dependency versions with your Expo SDK.

---

## 🎯 Impact & Goal

In India, thousands of crores in scheme benefits go unclaimed due to a lack of awareness and the complexity of paperwork. Sahaj Seva aims to:

- **Remove Language Barriers:** Support for 22+ regional languages.
- **Increase Literacy:** Help non-tech-savvy users navigate the "Digital India" ecosystem.
- **Eliminate Middlemen:** Direct access to information reduces corruption at the grassroots level.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or new features.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

- **Sakshi** – Frontend & UI/UX
- **Pritesh** – Backend & AI Integration

Developed for Lenovo LEAP AI Hackathon 2026 (Converge 3.0)
