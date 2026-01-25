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

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
