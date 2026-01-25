from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Sahaj Seva API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserProfile(BaseModel):
    age: int
    occupation: str
    income: float
    location: Optional[str] = None

class Scheme(BaseModel):
    id: str
    name: str
    description: str
    eligibility: str
    benefits: List[str]
    application_process: str

class FormField(BaseModel):
    field_name: str
    field_type: str
    required: bool
    description: str
    example: str

class FormAnalysis(BaseModel):
    form_id: str
    form_name: str
    purpose: str
    eligibility: str
    fields: List[FormField]
    warnings: List[str]

# Mock data
MOCK_SCHEMES = [
    {
        "id": "pm-kisan",
        "name": "PM-Kisan Samman Nidhi",
        "description": "Financial support to farmers with direct income support of ₹6,000 per year",
        "eligibility": "Small and marginal farmers owning up to 2 hectares of land",
        "benefits": ["₹2,000 paid three times a year", "Direct bank transfer", "No middlemen"],
        "application_process": "Apply online through PM-Kisan portal or visit nearest CSC"
    },
    {
        "id": "old-age-pension",
        "name": "Old Age Pension Scheme",
        "description": "Monthly pension for senior citizens",
        "eligibility": "Citizens above 60 years with income below ₹2 lakh per year",
        "benefits": ["Monthly pension of ₹500-1000", "Direct bank transfer", "Medical benefits"],
        "application_process": "Apply through state government portal or local panchayat office"
    }
]

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to Sahaj Seva API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "schemes": "/api/schemes",
            "analyze_form": "/api/analyze-form"
        }
    }

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Get all schemes
@app.get("/api/schemes", response_model=List[Scheme])
def get_all_schemes():
    """Get all available government schemes"""
    return MOCK_SCHEMES

# Get schemes based on user profile
@app.post("/api/schemes/match")
def match_schemes(profile: UserProfile):
    """Match schemes based on user profile"""
    matched_schemes = []
    
    for scheme in MOCK_SCHEMES:
        # Simple matching logic (can be enhanced with ML)
        if scheme["id"] == "pm-kisan" and "farmer" in profile.occupation.lower():
            matched_schemes.append(scheme)
        elif scheme["id"] == "old-age-pension" and profile.age >= 60:
            matched_schemes.append(scheme)
    
    return {
        "profile": profile.dict(),
        "matched_schemes": matched_schemes,
        "count": len(matched_schemes)
    }

# Analyze uploaded form
@app.post("/api/analyze-form", response_model=FormAnalysis)
def analyze_form(form_image_data: dict):
    """Analyze an uploaded form and extract field information"""
    # Mock response - in production, this would use OCR and NLP
    return {
        "form_id": "ration-card",
        "form_name": "Ration Card Application Form",
        "purpose": "Apply for a new ration card to receive subsidized food grains",
        "eligibility": "All Indian citizens residing in the state",
        "fields": [
            {
                "field_name": "Full Name",
                "field_type": "text",
                "required": True,
                "description": "Enter your full name as per Aadhaar card",
                "example": "Ram Kumar Sharma"
            },
            {
                "field_name": "Father's Name",
                "field_type": "text",
                "required": True,
                "description": "Enter your father's full name",
                "example": "Shyam Lal Sharma"
            },
            {
                "field_name": "Date of Birth",
                "field_type": "date",
                "required": True,
                "description": "Enter your date of birth in DD/MM/YYYY format",
                "example": "15/08/1985"
            },
            {
                "field_name": "Aadhaar Number",
                "field_type": "number",
                "required": True,
                "description": "Enter your 12-digit Aadhaar number",
                "example": "1234 5678 9012"
            }
        ],
        "warnings": [
            "Ensure all documents are attested",
            "Keep original documents for verification",
            "Application processing takes 15-30 days"
        ]
    }

# Get scheme by ID
@app.get("/api/schemes/{scheme_id}", response_model=Scheme)
def get_scheme_by_id(scheme_id: str):
    """Get details of a specific scheme"""
    for scheme in MOCK_SCHEMES:
        if scheme["id"] == scheme_id:
            return scheme
    raise HTTPException(status_code=404, detail="Scheme not found")

# Text-to-speech endpoint (placeholder)
@app.post("/api/tts")
def text_to_speech(text: str, language: str = "en"):
    """Convert text to speech (placeholder for actual TTS integration)"""
    return {
        "text": text,
        "language": language,
        "audio_url": "https://example.com/audio/placeholder.mp3",
        "message": "TTS integration pending"
    }

# Speech-to-text endpoint (placeholder)
@app.post("/api/stt")
def speech_to_text(audio_data: dict):
    """Convert speech to text (placeholder for actual STT integration)"""
    return {
        "transcription": "I am 62 years old, a farmer, my income is 2 lakh rupees",
        "language": "hi",
        "confidence": 0.95,
        "message": "STT integration pending"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
