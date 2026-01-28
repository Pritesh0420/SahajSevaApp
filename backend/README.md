# Sahaj Seva Backend API

FastAPI backend for the Sahaj Seva government assistance application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python main.py
```

## Environment variables

- `GOOGLE_API_KEY` (optional): If set and quota is available, `/api/analyze-form` will use Google's Gemini model to analyze forms.
- `ALLOW_ANALYZE_WITHOUT_LLM` (default `true`): If `true`, `/api/analyze-form` will return a best-effort fallback response when the LLM is unavailable (missing key, invalid key, quota exceeded, etc.) instead of returning HTTP 500.

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- **GET /** - API information
- **GET /health** - Health check
- **POST /api/analyze-form** - Analyze uploaded PDF/image form and generate voice explanation
  - Parameters: `file` (form document), `language` (optional, default: "en")
  - Supports: en, hi, mr, ta, te, bn, gu, kn, ml, pa
  - Returns: Form analysis + voice note in selected language
- **GET /api/schemes** - Get all schemes
- **POST /api/schemes/match** - Match schemes to user profile
- **GET /api/schemes/{scheme_id}** - Get specific scheme
- **POST /api/tts** - Text-to-speech (placeholder)
- **POST /api/stt** - Speech-to-text (placeholder)

## Features

### Multilingual Voice Notes
When a form is uploaded, the system:
1. Scans the PDF/image document
2. Extracts text using OCR (for images) or direct extraction (for PDFs)
3. Analyzes the form structure using Google Gemini AI
4. Creates a voice note in the selected language explaining:
   - What the form is about
   - The purpose of the form
   - Asks if the user wants to continue filling it

See [USAGE.md](USAGE.md) for detailed examples.

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
