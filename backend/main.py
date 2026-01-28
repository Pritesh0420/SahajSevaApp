import os
import uuid
import json
import re
from typing import List, Optional

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

from google import genai
from google.genai import types
from gtts import gTTS
from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException
from googletrans import Translator
import uvicorn

import pdfplumber
import pytesseract
from PIL import Image

# ---------------- ENV + GOOGLE GEMINI ----------------
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    client = genai.Client(api_key=GOOGLE_API_KEY)
    MODEL_NAME = 'gemini-1.5-flash'
else:
    client = None
    MODEL_NAME = None

# When true, the API will return a best-effort, non-LLM result if the LLM is
# unavailable (missing key, quota exhausted, network issues, etc.).
ALLOW_ANALYZE_WITHOUT_LLM = os.getenv("ALLOW_ANALYZE_WITHOUT_LLM", "true").strip().lower() in (
    "1",
    "true",
    "yes",
    "y",
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Session storage for conversation state (in-memory, use Redis/DB for production)
conversation_sessions = {}

# ---------------- APP ----------------
app = FastAPI(title="Sahaj Seva AI Backend", version="5.0.0")


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
                    "portal_url": scheme.get("portal_url", ""),
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
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ---------------- MODELS ----------------
class UserProfile(BaseModel):
    age: int
    occupation: str
    income: float
    location: Optional[str] = None


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


class UserResponse(BaseModel):
    session_id: str
    response: str


class FieldQuestion(BaseModel):
    field_name: str
    question: str
    voice_url: Optional[str]
    example: str


# ---------------- ROUTES ----------------
@app.get("/")
def root():
    return {"status": "Sahaj Seva AI Backend Running 🚀"}


@app.get("/health")
def health():
    return {"ok": True}


# ---------------- HELPERS ----------------
def extract_text_from_file(path: str, ext: str) -> str:
    text = ""

    if ext == "pdf":
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""

    elif ext in ["png", "jpg", "jpeg"]:
        image = Image.open(path)
        text = pytesseract.image_to_string(image)

    else:
        raise HTTPException(400, "Only PDF, PNG, JPG, JPEG files allowed")

    if not text.strip():
        raise HTTPException(400, "❌ Could not extract any text from file")

    return text


def _basic_field_guess_from_text(extracted_text: str, max_fields: int = 25) -> List[FormField]:
    fields: List[FormField] = []
    seen = set()

    # Look for common form field patterns - improved to capture longer field names
    patterns = [
        r"([A-Za-z][A-Za-z0-9 ,/\-]{3,80})\s*[:\-–_]+\s*",  # Name: _____ or Address Details:
        r"\d+\.\s*([A-Za-z][A-Za-z0-9 ,/\-]{3,80})(?:\s*[:\-–_]|$)",  # 1. Name or 1. Full Address
        r"([A-Za-z][A-Za-z0-9 ,/\-]{3,80})\s*\(",  # Name(
    ]
    
    # Photo field keywords
    photo_keywords = ['photo', 'photograph', 'image', 'picture', 'pic']

    for raw_line in extracted_text.splitlines():
        line = re.sub(r"\s+", " ", raw_line).strip()
        if not line or len(line) < 3 or len(line) > 200:
            continue

        for pattern in patterns:
            matches = re.findall(pattern, line, re.IGNORECASE)
            for match in matches:
                candidate_name = match.strip()
                
                # Skip common words that aren't field names
                skip_words = {'page', 'form', 'application', 'government', 'date', 'the', 'and', 'for', 'of', 'to', 
                             'please', 'provide', 'enter', 'fill', 'write', 'details', 'information'}
                
                # Clean up trailing punctuation and extra words
                candidate_name = re.sub(r'[:\-–_]+$', '', candidate_name).strip()
                
                # Skip if too short or in skip words
                if len(candidate_name) < 3 or candidate_name.lower() in skip_words:
                    continue
                
                # Skip if already seen
                if candidate_name.lower() in seen:
                    continue

                seen.add(candidate_name.lower())
                
                # Detect if this is a photo/image field
                field_type = "photo" if any(keyword in candidate_name.lower() for keyword in photo_keywords) else "text"

                fields.append(
                    FormField(
                        field_name=candidate_name,
                        field_type=field_type,
                        required=False,
                        description=f"Please provide your {candidate_name.lower()}",
                        example="",
                    )
                )

                if len(fields) >= max_fields:
                    return fields

    return fields if fields else [
        FormField(
            field_name="Information",
            field_type="text",
            required=False,
            description="Please provide required information",
            example=""
        )
    ]


def _fallback_form_analysis(extracted_text: str, original_filename: str) -> FormAnalysis:
    guessed_fields = _basic_field_guess_from_text(extracted_text)
    
    # Try to extract form name from text
    form_name = "Application Form"
    first_lines = extracted_text.split('\n')[:5]
    for line in first_lines:
        if len(line.strip()) > 5 and len(line.strip()) < 100:
            form_name = line.strip()
            break
    
    # Basic purpose extraction
    purpose = "This form requires you to fill in the following information"
    if 'application' in extracted_text.lower():
        purpose = "This is an application form that requires your personal and relevant information"
    elif 'registration' in extracted_text.lower():
        purpose = "This is a registration form"
    
    return FormAnalysis(
        form_id=str(uuid.uuid4()),
        form_name=form_name,
        purpose=purpose,
        eligibility="Please check the form for eligibility criteria",
        fields=guessed_fields,
        warnings=[
            "Please read the form carefully before filling",
            "Ensure all required information is accurate",
        ],
    )


def _translate_text(text: str, target_lang: str) -> str:
    """Translate text to target language."""
    if not text or target_lang == "en":
        return text
    
    try:
        translator = Translator()
        result = translator.translate(text, dest=target_lang)
        return result.text
    except Exception as e:
        print(f"Translation error: {e}")
        return text  # Return original if translation fails


def _create_intro_text(form_name: str, purpose: str, fields: List[dict], lang: str) -> str:
    """Create a comprehensive introduction that explains form details and all fields."""
    
    # Translate form name and purpose to selected language
    translated_form_name = _translate_text(form_name, lang)
    translated_purpose = _translate_text(purpose, lang)
    
    # Build field list description
    field_names = [f['field_name'] for f in fields] if fields else []
    
    if lang == "hi":
        intro = f"यह दस्तावेज़ {translated_form_name} है। {translated_purpose}\n\n"
        intro += "इस फॉर्म में निम्नलिखित जानकारी की आवश्यकता है:\n"
        for i, field in enumerate(fields[:10], 1):  # Limit to 10 for voice clarity
            translated_field_name = _translate_text(field['field_name'], lang)
            translated_description = _translate_text(field.get('description', ''), lang)
            intro += f"{i}. {translated_field_name} - {translated_description}\n"
        if len(fields) > 10:
            intro += f"और {len(fields) - 10} अधिक फील्ड्स।\n"
        intro += "\nक्या आप इस फॉर्म को भरना शुरू करना चाहेंगे?"
    elif lang == "mr":
        intro = f"हा दस्तऐवज {translated_form_name} आहे। {translated_purpose}\n\n"
        intro += "या फॉर्ममध्ये खालील माहिती आवश्यक आहे:\n"
        for i, field in enumerate(fields[:10], 1):
            translated_field_name = _translate_text(field['field_name'], lang)
            translated_description = _translate_text(field.get('description', ''), lang)
            intro += f"{i}. {translated_field_name} - {translated_description}\n"
        if len(fields) > 10:
            intro += f"आणि {len(fields) - 10} अधिक फील्ड।\n"
        intro += "\nतुम्ही हा फॉर्म भरणे सुरू करू इच्छिता का?"
    else:  # Default English
        intro = f"This document is {translated_form_name}. {translated_purpose}\n\n"
        intro += "This form requires the following information:\n"
        for i, field in enumerate(fields[:10], 1):
            intro += f"{i}. {field['field_name']} - {field.get('description', '')}\n"
        if len(fields) > 10:
            intro += f"and {len(fields) - 10} more fields.\n"
        intro += "\nWould you like to start filling this form?"
    
    return intro


def _create_voice_note(explanation_text: str, target_lang: str = None) -> tuple[Optional[str], str]:
    text = (explanation_text or "").strip() or "Form analysis is ready."

    # Use target language if provided, otherwise auto-detect
    if target_lang:
        lang = target_lang
    else:
        try:
            lang = detect(text)
        except LangDetectException:
            lang = "en"

    audio_filename = f"{uuid.uuid4()}.mp3"
    audio_path = os.path.join(UPLOAD_DIR, audio_filename)

    try:
        gTTS(text=text, lang=lang).save(audio_path)
    except Exception:
        # Fallback to English if the language is not supported
        lang = "en"
        try:
            gTTS(text=text, lang=lang).save(audio_path)
        except Exception:
            return None, lang

    return f"/uploads/{audio_filename}", lang


# 🔹 FORM ANALYSIS + VOICE NOTE
@app.post("/api/analyze-form")
async def analyze_form(
    file: UploadFile = File(...),
    language: str = Form(default="en")  # Language code: 'en', 'hi', 'mr', 'ta', etc.
):
    try:
        ext = file.filename.split(".")[-1].lower()
        filename = f"{uuid.uuid4()}.{ext}"
        path = os.path.join(UPLOAD_DIR, filename)

        with open(path, "wb") as f:
            f.write(await file.read())

        extracted_text = extract_text_from_file(path, ext)

        if client is None:
            if not ALLOW_ANALYZE_WITHOUT_LLM:
                raise HTTPException(
                    status_code=503,
                    detail={
                        "code": "llm_not_configured",
                        "message": "GOOGLE_API_KEY is not configured on the server.",
                    },
                )

            result_json = _fallback_form_analysis(extracted_text, file.filename).model_dump()
            
            # Create introductory voice note in selected language
            intro_text = _create_intro_text(
                result_json.get("form_name", "Form"), 
                result_json.get("purpose", ""), 
                result_json.get("fields", []),
                language
            )
            voice_note_url, lang = _create_voice_note(intro_text, language)
            
            return {
                "form_analysis": result_json,
                "voice_note_url": voice_note_url,
                "language_detected": lang,
                "fallback": True,
            }

        prompt = f"""
You are analyzing an Indian government application form.

Return JSON only:
{{
  "form_id": "...",
  "form_name": "...",
  "purpose": "...",
  "eligibility": "...",
  "fields": [
    {{
      "field_name": "...",
      "field_type": "text/number/date",
      "required": true,
      "description": "...",
      "example": "..."
    }}
  ],
  "warnings": ["..."]
}}

Use very simple language for senior citizens.

FORM TEXT:
\"\"\"{extracted_text}\"\"\"
"""

        try:
            full_prompt = "You only return valid JSON. No markdown. No explanation.\n\n" + prompt
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    temperature=0.2,
                ),
            )
            result_text = response.text
        except Exception as e:
            error_str = str(e).lower()
            # Handle quota/rate limiting
            if "quota" in error_str or "rate" in error_str or "429" in error_str:
                if not ALLOW_ANALYZE_WITHOUT_LLM:
                    raise HTTPException(
                        status_code=429,
                        detail={
                            "code": "gemini_rate_limited",
                            "message": "LLM request was rate-limited or quota was exceeded.",
                            "provider_error": str(e),
                        },
                    )
                result_json = _fallback_form_analysis(extracted_text, file.filename).model_dump()
                intro_text = _create_intro_text(
                    result_json.get("form_name", "Form"), 
                    result_json.get("purpose", ""), 
                    result_json.get("fields", []),
                    language
                )
                voice_note_url, lang = _create_voice_note(intro_text, language)
                return {"form_analysis": result_json, "voice_note_url": voice_note_url, "language_detected": lang, "fallback": True}
            
            # Handle authentication errors
            elif "api key" in error_str or "invalid" in error_str or "auth" in error_str:
                if not ALLOW_ANALYZE_WITHOUT_LLM:
                    raise HTTPException(
                        status_code=401,
                        detail={
                            "code": "gemini_auth_failed",
                            "message": "LLM authentication failed. Check GOOGLE_API_KEY.",
                            "provider_error": str(e),
                        },
                    )
                result_json = _fallback_form_analysis(extracted_text, file.filename).model_dump()
                intro_text = _create_intro_text(
                    result_json.get("form_name", "Form"), 
                    result_json.get("purpose", ""), 
                    result_json.get("fields", []),
                    language
                )
                voice_note_url, lang = _create_voice_note(intro_text, language)
                return {"form_analysis": result_json, "voice_note_url": voice_note_url, "language_detected": lang, "fallback": True}
            
            # Handle connection errors
            else:
                if not ALLOW_ANALYZE_WITHOUT_LLM:
                    raise HTTPException(
                        status_code=503,
                        detail={
                            "code": "gemini_error",
                            "message": "Could not reach the LLM provider or other error occurred.",
                            "provider_error": str(e),
                        },
                    )
                result_json = _fallback_form_analysis(extracted_text, file.filename).model_dump()
                intro_text = _create_intro_text(
                    result_json.get("form_name", "Form"), 
                    result_json.get("purpose", ""), 
                    result_json.get("fields", []),
                    language
                )
                voice_note_url, lang = _create_voice_note(intro_text, language)
                return {"form_analysis": result_json, "voice_note_url": voice_note_url, "language_detected": lang, "fallback": True}
        # Clean up response text (remove markdown code blocks if present)
        result_text = result_text.strip()
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
        result_text = result_text.strip()
        
        try:
            result_json = json.loads(result_text)
        except Exception as e:
            if ALLOW_ANALYZE_WITHOUT_LLM:
                result_json = _fallback_form_analysis(extracted_text, file.filename).model_dump()
                intro_text = _create_intro_text(
                    result_json.get("form_name", "Form"), 
                    result_json.get("purpose", ""), 
                    result_json.get("fields", []),
                    language
                )
                voice_note_url, lang = _create_voice_note(intro_text, language)
                return {
                    "form_analysis": result_json,
                    "voice_note_url": voice_note_url,
                    "language_detected": lang,
                    "fallback": True,
                    "warning": "LLM returned invalid JSON; using fallback analysis instead.",
                }

            raise HTTPException(
                status_code=502,
                detail={
                    "code": "invalid_llm_json",
                    "message": "LLM response was not valid JSON.",
                    "provider_error": str(e),
                },
            )

        # 🔊 Create Voice Note with introduction and all field details
        form_name = result_json.get("form_name", "Form")
        purpose = result_json.get("purpose", "")
        fields = result_json.get("fields", [])
        
        intro_text = _create_intro_text(form_name, purpose, fields, language)
        voice_note_url, lang = _create_voice_note(intro_text, language)

        # Create session for conversation
        session_id = str(uuid.uuid4())
        conversation_sessions[session_id] = {
            "form_analysis": result_json,
            "language": language,
            "current_field_index": 0,
            "field_responses": {},
            "form_language": "hi" if any(ord(c) > 127 for c in extracted_text[:100]) else "en",
            "original_file_path": path,
        }
        
        # Clean up the uploaded file after processing (keep only voice notes)
        try:
            if os.path.exists(path):
                os.remove(path)
        except Exception as e:
            print(f"Could not delete file {path}: {e}")

        return {
            "session_id": session_id,
            "form_analysis": result_json,
            "voice_note_url": voice_note_url,
            "language_detected": lang
        }

    except Exception as e:
        print("🔥 ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# 🔹 START FORM FILLING CONVERSATION
@app.post("/api/start-filling")
async def start_filling(session_id: str = Form(...)):
    """User confirmed they want to start filling the form"""
    if session_id not in conversation_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = conversation_sessions[session_id]
    fields = session["form_analysis"].get("fields", [])
    
    if not fields:
        return {
            "completed": True,
            "message": "No fields to fill"
        }
    
    # Ask first field
    return await _get_next_field_question(session_id)


# 🔹 GET NEXT FIELD QUESTION
async def _get_next_field_question(session_id: str):
    session = conversation_sessions[session_id]
    fields = session["form_analysis"].get("fields", [])
    current_index = session["current_field_index"]
    language = session["language"]
    
    if current_index >= len(fields):
        # All fields completed
        return {
            "completed": True,
            "message": "All fields completed! Generating filled form..."
        }
    
    field = fields[current_index]
    
    # Translate field name and description to selected language
    translated_field_name = _translate_text(field['field_name'], language)
    translated_description = _translate_text(field['description'], language)
    
    # Create question in selected language (NO VOICE NOTE - already played comprehensive intro)
    question_texts = {
        "en": f"Please provide: {translated_field_name}. {translated_description}",
        "hi": f"कृपया प्रदान करें: {translated_field_name}। {translated_description}",
        "mr": f"कृपया प्रदान करा: {translated_field_name}। {translated_description}",
        "ta": f"தயவுசெய்து வழங்கவும்: {translated_field_name}। {translated_description}",
        "te": f"దయచేసి అందించండి: {translated_field_name}। {translated_description}",
        "bn": f"অনুগ্রহ করে প্রদান করুন: {translated_field_name}। {translated_description}",
        "gu": f"કૃપા કરીને પ્રદાન કરો: {translated_field_name}। {translated_description}",
        "kn": f"ದಯವಿಟ್ಟು ಒದಗಿಸಿ: {translated_field_name}। {translated_description}",
        "ml": f"ദയവായി നൽകുക: {translated_field_name}। {translated_description}",
        "pa": f"ਕਿਰਪਾ ਕਰਕੇ ਪ੍ਰਦਾਨ ਕਰੋ: {translated_field_name}। {translated_description}",
    }
    
    question_text = question_texts.get(language, question_texts["en"])
    
    # Add example if available
    if field.get('example'):
        example_texts = {
            "en": f"Example: {field['example']}",
            "hi": f"उदाहरण: {field['example']}",
            "mr": f"उदाहरण: {field['example']}",
            "ta": f"உதாரணம்: {field['example']}",
            "te": f"ఉదాహరణ: {field['example']}",
            "bn": f"উদাহরণ: {field['example']}",
            "gu": f"ઉદાહરણ: {field['example']}",
            "kn": f"ಉದಾಹರಣೆ: {field['example']}",
            "ml": f"ഉദാഹരണം: {field['example']}",
            "pa": f"ਉਦਾਹਰਣ: {field['example']}",
        }
        question_text += " " + example_texts.get(language, example_texts["en"])
    
    # Generate voice note for this question
    voice_url, _ = _create_voice_note(question_text, language)
    
    return {
        "completed": False,
        "field_index": current_index,
        "total_fields": len(fields),
        "field_name": field["field_name"],
        "question": question_text,
        "voice_url": voice_url,  # Voice note for this field question
        "field_type": field.get("field_type", "text"),
    }


# 🔹 SUBMIT FIELD RESPONSE
@app.post("/api/submit-field")
async def submit_field(
    session_id: str = Form(...),
    field_value: str = Form(...)
):
    """Submit user's response for current field and get next question"""
    if session_id not in conversation_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = conversation_sessions[session_id]
    fields = session["form_analysis"].get("fields", [])
    current_index = session["current_field_index"]
    
    if current_index < len(fields):
        field_name = fields[current_index]["field_name"]
        session["field_responses"][field_name] = field_value
        session["current_field_index"] += 1
    
    # Get next question or complete
    return await _get_next_field_question(session_id)


# 🔹 SPEECH TO TEXT (for voice input)
@app.post("/api/speech-to-text")
async def speech_to_text(
    audio: UploadFile = File(...),
    language: str = Form(default="en")
):
    """Convert speech audio to text - supports Hindi and English recognition"""
    try:
        # Save audio temporarily
        audio_filename = f"{uuid.uuid4()}.{audio.filename.split('.')[-1]}"
        audio_path = os.path.join(UPLOAD_DIR, audio_filename)
        
        with open(audio_path, "wb") as f:
            f.write(await audio.read())
        
        # Use Google Speech Recognition
        import speech_recognition as sr
        recognizer = sr.Recognizer()
        
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
        
        # Map language codes to speech recognition
        lang_map = {
            "en": "en-US",
            "hi": "hi-IN",
            "mr": "mr-IN",
            "ta": "ta-IN",
            "te": "te-IN",
            "bn": "bn-IN",
            "gu": "gu-IN",
            "kn": "kn-IN",
            "ml": "ml-IN",
            "pa": "pa-IN",
        }
        
        recognition_lang = lang_map.get(language, "en-US")
        
        # Try to recognize in selected language
        try:
            text = recognizer.recognize_google(audio_data, language=recognition_lang)
        except (sr.UnknownValueError, sr.RequestError):
            # If Hindi is selected and fails, try English as fallback
            if language == "hi":
                try:
                    text = recognizer.recognize_google(audio_data, language="en-US")
                except:
                    raise sr.UnknownValueError()
            else:
                raise
        
        # Clean up audio file
        try:
            os.remove(audio_path)
        except:
            pass
        
        return {"text": text, "success": True, "detected_language": language}
        
    except sr.UnknownValueError:
        raise HTTPException(status_code=400, detail="Could not understand audio")
    except sr.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Speech recognition service error: {str(e)}")
    except Exception as e:
        print(f"Speech to text error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# 🔹 GENERATE FILLED FORM
@app.post("/api/generate-filled-form")
async def generate_filled_form(session_id: str = Form(...)):
    """Generate the filled form based on all responses"""
    if session_id not in conversation_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = conversation_sessions[session_id]
    form_analysis = session["form_analysis"]
    form_language = session.get("form_language", "en")
    responses = session["field_responses"]
    language = session["language"]
    
    # Initialize translator
    translator = Translator()
    
    # Create a formatted filled form
    form_name = form_analysis.get("form_name", "Form")
    
    filled_form_text = f"\n{'='*50}\n"
    filled_form_text += f"{form_name.upper()}\n"
    filled_form_text += f"{'='*50}\n\n"
    
    # Add all fields with responses - translate if needed
    for field in form_analysis.get("fields", []):
        field_name = field["field_name"]
        value = responses.get(field_name, "Not provided")
        
        # Translate answer to match form language if different
        if value and value != "Not provided":
            try:
                # Detect the language of the answer
                detected_lang = detect(value)
                
                # If answer language doesn't match form language, translate it
                if detected_lang != form_language:
                    translation = translator.translate(value, dest=form_language)
                    value = translation.text
                    print(f"Translated '{responses.get(field_name)}' from {detected_lang} to {form_language}: {value}")
            except Exception as e:
                print(f"Translation error for field {field_name}: {e}")
                # Keep original value if translation fails
                pass
        
        filled_form_text += f"{field_name}: {value}\n"
    
    filled_form_text += f"\n{'='*50}\n"
    
    # Create completion message
    completion_texts = {
        "en": f"Form filling completed successfully! All {len(responses)} fields have been filled.",
        "hi": f"फॉर्म भरना सफलतापूर्वक पूरा हुआ! सभी {len(responses)} फील्ड भर दिए गए हैं।",
        "mr": f"फॉर्म भरणे यशस्वीरित्या पूर्ण झाले! सर्व {len(responses)} फील्ड भरले गेले आहेत।",
        "ta": f"படிவம் நிரப்புதல் வெற்றிகரமாக முடிந்தது! அனைத்து {len(responses)} புலங்களும் நிரப்பப்பட்டுள்ளன.",
        "te": f"ఫారమ్ నింపడం విజయవంతంగా పూర్తయింది! అన్నీ {len(responses)} ఫీల్డ్‌లు నింపబడ్డాయి.",
        "bn": f"ফর্ম পূরণ সফলভাবে সম্পন্ন! সমস্ত {len(responses)} ক্ষেত্র পূরণ করা হয়েছে।",
        "gu": f"ફોર્મ ભરવાનું સફળતાપૂર્વક પૂર્ણ થયું! બધા {len(responses)} ફીલ્ડ ભરવામાં આવ્યા છે।",
        "kn": f"ಫಾರ್ಮ್ ಭರ್ತಿ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ! ಎಲ್ಲಾ {len(responses)} ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಲಾಗಿದೆ.",
        "ml": f"ഫോം പൂരിപ്പിക്കൽ വിജയകരമായി പൂർത്തിയായി! എല്ലാ {len(responses)} ഫീൽഡുകളും പൂരിപ്പിച്ചു.",
        "pa": f"ਫਾਰਮ ਭਰਨਾ ਸਫਲਤਾਪੂਰਵਕ ਪੂਰਾ ਹੋਇਆ! ਸਾਰੇ {len(responses)} ਫੀਲਡ ਭਰ ਦਿੱਤੇ ਗਏ ਹਨ।",
    }
    
    summary_message = completion_texts.get(language, completion_texts["en"])
    voice_url, _ = _create_voice_note(summary_message, language)
    
    return {
        "success": True,
        "summary": summary_message,
        "voice_url": voice_url,
        "field_responses": responses,
        "filled_form_text": filled_form_text,
        "form_language": form_language,
        "form_name": form_name,
        "message": summary_message
    }


# ---------------- RUN ----------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
