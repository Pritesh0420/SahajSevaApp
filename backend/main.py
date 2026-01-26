
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import json
import os
import unicodedata

from ai_providers import get_ai_client
from scheme_models import (
    ExtractProfileRequest,
    ExtractProfileResponse,
    SchemeFinderRequest,
    SchemeFinderResponse,
)

app = FastAPI(title="Sahaj Seva API", version="1.0.0")

# Add scheme finder endpoint
SCHEMES_PATH = os.path.join(os.path.dirname(__file__), "schemes.json")
with open(SCHEMES_PATH, "r", encoding="utf-8") as f:
    SCHEMES = json.load(f)


STATE_DISPLAY = {
    # States
    "andhra pradesh": {"en": "Andhra Pradesh", "hi": "आंध्र प्रदेश"},
    "arunachal pradesh": {"en": "Arunachal Pradesh", "hi": "अरुणाचल प्रदेश"},
    "assam": {"en": "Assam", "hi": "असम"},
    "bihar": {"en": "Bihar", "hi": "बिहार"},
    "chhattisgarh": {"en": "Chhattisgarh", "hi": "छत्तीसगढ़"},
    "goa": {"en": "Goa", "hi": "गोवा"},
    "gujarat": {"en": "Gujarat", "hi": "गुजरात"},
    "haryana": {"en": "Haryana", "hi": "हरियाणा"},
    "himachal pradesh": {"en": "Himachal Pradesh", "hi": "हिमाचल प्रदेश"},
    "jharkhand": {"en": "Jharkhand", "hi": "झारखंड"},
    "karnataka": {"en": "Karnataka", "hi": "कर्नाटक"},
    "kerala": {"en": "Kerala", "hi": "केरल"},
    "madhya pradesh": {"en": "Madhya Pradesh", "hi": "मध्य प्रदेश"},
    "maharashtra": {"en": "Maharashtra", "hi": "महाराष्ट्र"},
    "manipur": {"en": "Manipur", "hi": "मणिपुर"},
    "meghalaya": {"en": "Meghalaya", "hi": "मेघालय"},
    "mizoram": {"en": "Mizoram", "hi": "मिजोरम"},
    "nagaland": {"en": "Nagaland", "hi": "नागालैंड"},
    "odisha": {"en": "Odisha", "hi": "ओडिशा"},
    "punjab": {"en": "Punjab", "hi": "पंजाब"},
    "rajasthan": {"en": "Rajasthan", "hi": "राजस्थान"},
    "sikkim": {"en": "Sikkim", "hi": "सिक्किम"},
    "tamil nadu": {"en": "Tamil Nadu", "hi": "तमिलनाडु"},
    "telangana": {"en": "Telangana", "hi": "तेलंगाना"},
    "tripura": {"en": "Tripura", "hi": "त्रिपुरा"},
    "uttar pradesh": {"en": "Uttar Pradesh", "hi": "उत्तर प्रदेश"},
    "uttarakhand": {"en": "Uttarakhand", "hi": "उत्तराखंड"},
    "west bengal": {"en": "West Bengal", "hi": "पश्चिम बंगाल"},

    # Union Territories
    "andaman and nicobar islands": {"en": "Andaman and Nicobar Islands", "hi": "अंडमान और निकोबार द्वीपसमूह"},
    "chandigarh": {"en": "Chandigarh", "hi": "चंडीगढ़"},
    "dadra and nagar haveli and daman and diu": {"en": "Dadra and Nagar Haveli and Daman and Diu", "hi": "दादरा और नगर हवेली और दमन और दीव"},
    "delhi": {"en": "Delhi", "hi": "दिल्ली"},
    "jammu and kashmir": {"en": "Jammu and Kashmir", "hi": "जम्मू और कश्मीर"},
    "ladakh": {"en": "Ladakh", "hi": "लद्दाख"},
    "lakshadweep": {"en": "Lakshadweep", "hi": "लक्षद्वीप"},
    "puducherry": {"en": "Puducherry", "hi": "पुडुचेरी"},
}

UT_KEYS = {
    "andaman and nicobar islands",
    "chandigarh",
    "dadra and nagar haveli and daman and diu",
    "delhi",
    "jammu and kashmir",
    "ladakh",
    "lakshadweep",
    "puducherry",
}


@app.get("/api/meta/states")
def get_states_meta():
    items = []
    for key, labels in STATE_DISPLAY.items():
        items.append(
            {
                "key": key,
                "en": labels.get("en", ""),
                "hi": labels.get("hi", ""),
                "type": "ut" if key in UT_KEYS else "state",
            }
        )
    items.sort(key=lambda x: x.get("en", ""))
    return {"states": items}


def _scheme_key(name: str) -> str:
    raw = _norm_text_lower(name)
    out = []
    prev_dash = False
    for ch in raw:
        is_alnum = ("a" <= ch <= "z") or ("0" <= ch <= "9")
        if is_alnum:
            out.append(ch)
            prev_dash = False
        else:
            if not prev_dash:
                out.append("-")
                prev_dash = True
    key = "".join(out).strip("-")
    return key or "scheme"


@app.get("/api/meta/schemes")
def get_schemes_meta():
    items = []
    seen = set()
    for i, scheme in enumerate(SCHEMES):
        en = (scheme.get("name") or "").strip()
        hi = (scheme.get("name_hi") or "").strip()
        base = _scheme_key(en or hi or str(i))
        key = base
        # Ensure unique keys even if names collide.
        n = 2
        while key in seen:
            key = f"{base}-{n}"
            n += 1
        seen.add(key)
        items.append({"key": key, "en": en, "hi": hi})
    items.sort(key=lambda x: x.get("en", ""))
    return {"schemes": items}

# Map user-entered state names (English/Hindi/aliases) to our canonical keys.
STATE_ALIASES = {
    "orissa": "odisha",
    "uttaranchal": "uttarakhand",
    "pondicherry": "puducherry",
    "nct of delhi": "delhi",
}


def _norm_text(value: str) -> str:
    return unicodedata.normalize("NFKC", str(value or "")).strip()


def _norm_text_lower(value: str) -> str:
    return _norm_text(value).lower()
for _key, _labels in STATE_DISPLAY.items():
    # Canonical key
    STATE_ALIASES[_norm_text_lower(_key)] = _key
    # English display (lowercase)
    _en = _norm_text_lower(_labels.get("en") or "")
    if _en:
        STATE_ALIASES[_en] = _key
    # Hindi display (exact + trimmed)
    _hi = _norm_text(_labels.get("hi") or "")
    if _hi:
        STATE_ALIASES[_hi] = _key

# Common Hindi spellings / variants (add as needed)
_extra_aliases = {
    "मध्य प्रदेश": "madhya pradesh",
    "आंध्रप्रदेश": "andhra pradesh",
    "उत्तरप्रदेश": "uttar pradesh",
    "पश्चिमबंगाल": "west bengal",
    "तमिल नाडु": "tamil nadu",
    "जम्मू कश्मीर": "jammu and kashmir",
}
for _k, _v in _extra_aliases.items():
    STATE_ALIASES[_norm_text(_k)] = _v
    STATE_ALIASES[_norm_text(_k).replace(" ", "")] = _v


def _normalize_state_key(state_value: str) -> str:
    if not state_value:
        return ""
    raw = _norm_text(state_value)
    if not raw:
        return ""
    # Try direct match first (Hindi + normalized)
    if raw in STATE_ALIASES:
        return STATE_ALIASES[raw]

    lowered = raw.lower()
    if lowered in STATE_ALIASES:
        return STATE_ALIASES[lowered]

    # Also try without spaces (common user input)
    compact = raw.replace(" ", "")
    if compact in STATE_ALIASES:
        return STATE_ALIASES[compact]
    compact_lower = lowered.replace(" ", "")
    if compact_lower in STATE_ALIASES:
        return STATE_ALIASES[compact_lower]

    return lowered


def _normalize_gender_value(gender_value: str) -> str:
    g = (gender_value or "").strip()
    if not g:
        return ""
    gl = g.lower()
    mapping = {
        "male": "male",
        "m": "male",
        "man": "male",
        "पुरुष": "male",
        "female": "female",
        "f": "female",
        "woman": "female",
        "महिला": "female",
        "other": "other",
        "अन्य": "other",
    }
    return mapping.get(g, mapping.get(gl, gl))


def _normalize_occupation_value(occupation_value: str) -> str:
    o = (occupation_value or "").strip()
    if not o:
        return ""
    ol = o.lower()
    mapping = {
        "farmer": "farmer",
        "किसान": "farmer",
        "student": "student",
        "छात्र": "student",
        "विद्यार्थी": "student",
        "labour": "labour",
        "labor": "labour",
        "worker": "labour",
        "मजदूर": "labour",
        "teacher": "teacher",
        "शिक्षक": "teacher",
        "business": "business",
        "व्यापार": "business",
        "दुकानदार": "business",
    }
    return mapping.get(o, mapping.get(ol, ol))


OCCUPATION_DISPLAY = {
    "farmer": {"en": "Farmer", "hi": "किसान"},
    "student": {"en": "Student", "hi": "छात्र"},
    "labour": {"en": "Worker", "hi": "मजदूर"},
    "teacher": {"en": "Teacher", "hi": "शिक्षक"},
    "business": {"en": "Business", "hi": "व्यापार"},
    "other": {"en": "Other", "hi": "अन्य"},
}


def _profile_for_explanation(*, user: dict, match_user: dict, language: str) -> dict:
    p = dict(user)

    occ_key = (match_user.get("occupation") or "").strip().lower()
    if occ_key in OCCUPATION_DISPLAY:
        p["occupation"] = OCCUPATION_DISPLAY[occ_key].get(language) or OCCUPATION_DISPLAY[occ_key].get("en")

    state_key = (match_user.get("state") or "").strip().lower()
    if state_key in STATE_DISPLAY:
        p["state"] = STATE_DISPLAY[state_key].get(language) or STATE_DISPLAY[state_key].get("en")

    gender_key = (match_user.get("gender") or "").strip().lower()
    if language == "hi":
        gender_hi = {"male": "पुरुष", "female": "महिला", "other": "अन्य"}.get(gender_key)
        if gender_hi:
            p["gender"] = gender_hi
    else:
        gender_en = {"male": "Male", "female": "Female", "other": "Other"}.get(gender_key)
        if gender_en:
            p["gender"] = gender_en

    return p


def _state_portal_result(*, state_key: str, language: str) -> dict:
    state_key = _normalize_state_key(state_key)
    label = STATE_DISPLAY.get(state_key, {}).get(language) or STATE_DISPLAY.get(state_key, {}).get("en") or state_key

    if language == "hi":
        return {
            "name": f"{label} के राज्य-स्तरीय योजनाएँ (आधिकारिक पोर्टल)",
            "benefits": "अपने राज्य की योजनाएँ देखें, पात्रता जांचें, और आवेदन/स्थिति की जानकारी पाएं।",
            "why": "यह आपके राज्य के लिए आधिकारिक/राज्य-स्तरीय योजनाओं को ढूँढने का सबसे सुरक्षित तरीका है।",
        }

    return {
        "name": f"{label} State Schemes (Official Portal)",
        "benefits": "Browse your state’s schemes, check eligibility, and get application/status information.",
        "why": "This is the safest way to find verified, state-specific schemes for your location.",
    }

def is_eligible(scheme, user):
    elig = scheme.get("eligibility", {})

    def _to_list(value):
        if value is None:
            return []
        if isinstance(value, list):
            return value
        return [value]

    # Occupation: string or list
    if "occupation" in elig and elig["occupation"] != "any":
        if not user.get("occupation"):
            return False
        allowed = [str(x).strip().lower() for x in _to_list(elig.get("occupation")) if str(x).strip()]
        if allowed and str(user["occupation"]).strip().lower() not in allowed:
            return False

    # Gender: string or list
    if "gender" in elig and elig["gender"] != "any":
        if not user.get("gender"):
            return False
        allowed = [str(x).strip().lower() for x in _to_list(elig.get("gender")) if str(x).strip()]
        if allowed and str(user["gender"]).strip().lower() not in allowed:
            return False

    # Age bounds
    if "age_min" in elig:
        if user.get("age") is None:
            return False
        if int(user["age"]) < int(elig["age_min"]):
            return False
    if "age_max" in elig:
        if user.get("age") is None:
            return False
        if int(user["age"]) > int(elig["age_max"]):
            return False

    # Income bounds
    if "income_min" in elig:
        if user.get("income") is None:
            return False
        if float(user["income"]) < float(elig["income_min"]):
            return False
    if "income_max" in elig:
        if user.get("income") is None:
            return False
        if float(user["income"]) > float(elig["income_max"]):
            return False

    # State: string or list
    if "state" in elig and elig["state"] != "any":
        if not user.get("state"):
            return False
        allowed = [str(x).strip().lower() for x in _to_list(elig.get("state")) if str(x).strip()]
        if allowed and str(user["state"]).strip().lower() not in allowed:
            return False

    return True


ai_client = get_ai_client()


@app.post("/api/profile/extract", response_model=ExtractProfileResponse)
async def extract_profile(payload: ExtractProfileRequest):
    extracted = await ai_client.extract_profile(text=payload.text, language=payload.language)
    return ExtractProfileResponse(
        age=extracted.age,
        gender=extracted.gender,
        occupation=extracted.occupation,
        income=extracted.income,
        state=extracted.state,
    )

@app.post("/api/scheme-finder", response_model=SchemeFinderResponse)
async def scheme_finder(payload: SchemeFinderRequest, request: Request):
    user = payload.model_dump()

    # Normalize user-entered values for reliable matching.
    match_user = dict(user)
    match_user["gender"] = _normalize_gender_value(match_user.get("gender") or "")
    match_user["occupation"] = _normalize_occupation_value(match_user.get("occupation") or "")
    match_user["state"] = _normalize_state_key(match_user.get("state") or "")

    explain_profile = _profile_for_explanation(user=user, match_user=match_user, language=payload.language)

    eligible = []
    for scheme in SCHEMES:
        if is_eligible(scheme, match_user):
            scheme_name = scheme.get("name_hi") if payload.language == "hi" and scheme.get("name_hi") else scheme.get("name", "")
            scheme_benefits = (
                scheme.get("benefits_hi")
                if payload.language == "hi" and scheme.get("benefits_hi")
                else scheme.get("benefits", "")
            )
            scheme_rule_explanation = (
                scheme.get("explanation_hi")
                if payload.language == "hi" and scheme.get("explanation_hi")
                else scheme.get("explanation", "")
            )
            why = await ai_client.explain_scheme(
                scheme_name=scheme_name,
                scheme_benefits=scheme_benefits,
                scheme_rule_explanation=scheme_rule_explanation,
                profile=explain_profile,
                language=payload.language,
            )

            # Defensive de-duplication: benefits are displayed separately in the UI.
            if scheme_benefits and why:
                if payload.language == "hi":
                    why = why.replace(f"लाभ: {scheme_benefits}", "").replace("  ", " ").strip(" -:।\n\t ")
                else:
                    why = why.replace(f"Benefit: {scheme_benefits}", "").replace("  ", " ").strip(" -:.\n\t ")
            eligible.append(
                {
                    "name": scheme_name,
                    "benefits": scheme_benefits,
                    "why": why,
                }
            )

    # Always add a state-specific "official portal" suggestion if we recognize the state.
    state_key = match_user.get("state") or ""
    if state_key and state_key in STATE_DISPLAY:
        eligible.append(_state_portal_result(state_key=state_key, language=payload.language))

    return {"schemes": eligible}

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
