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

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- **GET /** - API information
- **GET /health** - Health check
- **GET /api/schemes** - Get all schemes
- **POST /api/schemes/match** - Match schemes to user profile
- **GET /api/schemes/{scheme_id}** - Get specific scheme
- **POST /api/analyze-form** - Analyze uploaded form
- **POST /api/tts** - Text-to-speech (placeholder)
- **POST /api/stt** - Speech-to-text (placeholder)

## AI Integration (OpenAI / Gemini)

This backend supports AI in two places:

- **Profile extraction** from the spoken transcript: `POST /api/profile/extract`
- **Simple eligibility explanation** per scheme in the selected language: `POST /api/scheme-finder`

### State coverage (hackathon-safe)

State-wise schemes vary a lot across India. Instead of hardcoding hundreds of state programs, `POST /api/scheme-finder` automatically appends a **state-specific “Official Portal” suggestion** when a recognized `state` is present. This keeps the demo reliable while still feeling personalized.

### Enable an AI provider

By default, the backend runs in **no-AI mode** (rule-based fallback). To enable AI, set environment variables:

**OpenAI**

- `SAHAJSEVA_AI_PROVIDER=openai`
- `OPENAI_API_KEY=...`
- (optional) `OPENAI_MODEL=gpt-4o-mini`

**Gemini**

- `SAHAJSEVA_AI_PROVIDER=gemini`
- `GEMINI_API_KEY=...`
- (optional) `GEMINI_MODEL=gemini-1.5-flash`

Notes:
- Languages are intentionally limited to **English (`en`) and Hindi (`hi`)**.
- If the provider is misconfigured or the SDK is missing, the server falls back safely to rule-based logic.

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
