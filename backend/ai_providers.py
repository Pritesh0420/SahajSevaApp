import json
import os
import re
from dataclasses import dataclass
from typing import Any, Dict, Literal, Optional

from starlette.concurrency import run_in_threadpool

LanguageCode = Literal["en", "hi"]
AIProvider = Literal["none", "openai", "gemini"]


@dataclass(frozen=True)
class ExtractedProfile:
    age: Optional[int] = None
    gender: str = ""  # male|female|other|""
    occupation: str = ""
    income: Optional[float] = None
    state: str = ""


def _safe_lower(text: str) -> str:
    return (text or "").strip().lower()


def _parse_income_rupees(text: str) -> Optional[float]:
    """Best-effort parse annual income from free text.

    Supports patterns like: 2 lakh, 2 लाख, 200000, 2k, 50 thousand.
    Returns rupees as float.
    """
    t = _safe_lower(text)

    # Explicit numeric (₹ / rs / rupees) e.g. 250000
    m = re.search(r"(\d{2,9})", t)
    if m and not re.search(r"\d{2}\D*(?:years?|साल)", t):
        # This might also be age; we keep it as a weak fallback.
        pass

    # lakh patterns
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:lakh|लाख)", t)
    if m:
        return float(m.group(1)) * 100000.0

    # thousand patterns
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:thousand|हजार)", t)
    if m:
        return float(m.group(1)) * 1000.0

    # k suffix
    m = re.search(r"(\d+(?:\.\d+)?)\s*[kK]\b", t)
    if m:
        return float(m.group(1)) * 1000.0

    # rupees/rs with optional commas
    m = re.search(r"(?:₹|rs\.?|rupees)\s*(\d[\d,]{2,})", t)
    if m:
        return float(m.group(1).replace(",", ""))

    # Last resort: big-ish number in text
    m = re.search(r"\b(\d{5,9})\b", t)
    if m:
        return float(m.group(1))

    return None


def _parse_age(text: str) -> Optional[int]:
    t = _safe_lower(text)

    # Hindi pattern: "62 साल"
    m = re.search(r"\b(\d{1,3})\s*(?:years?\s*old|yrs?\s*old|year\s*old|साल)\b", t)
    if m:
        age = int(m.group(1))
        if 0 < age < 130:
            return age

    # Weak fallback: first 1-2 digit number
    m = re.search(r"\b(\d{1,2})\b", t)
    if m:
        age = int(m.group(1))
        if 0 < age < 130:
            return age

    return None


def _detect_gender(text: str) -> str:
    t = _safe_lower(text)
    gender_map = {
        "male": ["male", "m", "man", "boy", "पुरुष", "लड़का", "आदमी"],
        "female": ["female", "f", "woman", "girl", "महिला", "लड़की", "औरत"],
        "other": ["other", "अन्य"],
    }
    for key, terms in gender_map.items():
        if any(term in t for term in terms):
            return key
    return ""


def _detect_state(text: str) -> str:
    t = _safe_lower(text)
    # Full list (states + union territories). We keep normalized keys (lowercase English).
    states = [
        # States
        "andhra pradesh",
        "arunachal pradesh",
        "assam",
        "bihar",
        "chhattisgarh",
        "goa",
        "gujarat",
        "haryana",
        "himachal pradesh",
        "jharkhand",
        "karnataka",
        "kerala",
        "madhya pradesh",
        "maharashtra",
        "manipur",
        "meghalaya",
        "mizoram",
        "nagaland",
        "odisha",
        "punjab",
        "rajasthan",
        "sikkim",
        "tamil nadu",
        "telangana",
        "tripura",
        "uttar pradesh",
        "uttarakhand",
        "west bengal",
        # Union Territories
        "andaman and nicobar islands",
        "chandigarh",
        "dadra and nagar haveli and daman and diu",
        "delhi",
        "jammu and kashmir",
        "ladakh",
        "lakshadweep",
        "puducherry",
    ]
    hindi_aliases = {
        "andhra pradesh": ["आंध्र प्रदेश"],
        "arunachal pradesh": ["अरुणाचल प्रदेश"],
        "assam": ["असम"],
        "bihar": ["बिहार"],
        "chhattisgarh": ["छत्तीसगढ़"],
        "goa": ["गोवा"],
        "gujarat": ["गुजरात"],
        "haryana": ["हरियाणा"],
        "himachal pradesh": ["हिमाचल प्रदेश"],
        "jharkhand": ["झारखंड"],
        "karnataka": ["कर्नाटक"],
        "kerala": ["केरल"],
        "madhya pradesh": ["मध्य प्रदेश"],
        "maharashtra": ["महाराष्ट्र"],
        "odisha": ["ओडिशा", "उड़ीसा"],
        "punjab": ["पंजाब"],
        "rajasthan": ["राजस्थान"],
        "tamil nadu": ["तमिलनाडु", "तमिल नाडु"],
        "telangana": ["तेलंगाना"],
        "uttar pradesh": ["उत्तर प्रदेश"],
        "uttarakhand": ["उत्तराखंड"],
        "west bengal": ["पश्चिम बंगाल"],
        "delhi": ["दिल्ली"],
        "jammu and kashmir": ["जम्मू और कश्मीर"],
        "ladakh": ["लद्दाख"],
        "puducherry": ["पुडुचेरी"],
        "andaman and nicobar islands": ["अंडमान", "निकोबार", "अंडमान और निकोबार"],
        "chandigarh": ["चंडीगढ़"],
        "lakshadweep": ["लक्षद्वीप"],
    }

    for s in states:
        if s in t:
            return s
        for alias in hindi_aliases.get(s, []):
            if alias in text:
                return s

    return ""


def _detect_occupation(text: str) -> str:
    t = _safe_lower(text)
    # Normalize to English tokens used by schemes.json
    mapping = {
        "farmer": ["farmer", "किसान"],
        "student": ["student", "छात्र", "विद्यार्थी"],
        "labour": ["labour", "labor", "मजदूर", "worker"],
        "teacher": ["teacher", "शिक्षक"],
        "business": ["business", "व्यापार", "दुकानदार"],
    }
    for normalized, terms in mapping.items():
        if any(term in t or term in text for term in terms):
            return normalized

    # Fallback: try to capture "I am a X" / "मैं X हूँ"
    m = re.search(r"\b(?:i am|i'm|im)\s+(?:a\s+|an\s+)?([a-z]{3,20})\b", t)
    if m:
        return m.group(1)

    return ""


def simple_extract_profile(text: str) -> ExtractedProfile:
    return ExtractedProfile(
        age=_parse_age(text),
        gender=_detect_gender(text),
        occupation=_detect_occupation(text),
        income=_parse_income_rupees(text),
        state=_detect_state(text),
    )


def simple_explain_eligibility(
    *,
    scheme_name: str,
    scheme_benefits: str,
    scheme_rule_explanation: str,
    profile: Dict[str, Any],
    language: LanguageCode,
) -> str:
    """Deterministic fallback (no LLM) for eligibility explanation."""
    occupation = (profile.get("occupation") or "").strip()
    income = profile.get("income")
    state = (profile.get("state") or "").strip()

    if language == "hi":
        parts = [f"आप {scheme_name} के लिए आवेदन कर सकते हैं।"]
        reasons = []
        if occupation:
            reasons.append(f"आपका पेशा: {occupation}")
        if income is not None:
            reasons.append(f"आपकी आय: ₹{int(float(income)):,}".replace(",", ","))
        if state:
            reasons.append(f"राज्य: {state}")
        if reasons:
            parts.append("क्योंकि " + ", ".join(reasons) + "।")
        if scheme_rule_explanation:
            parts.append(f"नोट: {scheme_rule_explanation}")
        return " ".join(parts).strip()

    # English
    parts = [f"You can apply for {scheme_name}."]
    reasons = []
    if occupation:
        reasons.append(f"your occupation is {occupation}")
    if income is not None:
        reasons.append(f"your income is ₹{int(float(income)):,}".replace(",", ","))
    if state:
        reasons.append(f"you are in {state}")
    if reasons:
        parts.append("Because " + ", ".join(reasons) + ".")
    if scheme_rule_explanation:
        parts.append(f"Note: {scheme_rule_explanation}")
    return " ".join(parts).strip()


class BaseAIClient:
    async def extract_profile(self, *, text: str, language: LanguageCode) -> ExtractedProfile:
        raise NotImplementedError

    async def explain_scheme(
        self,
        *,
        scheme_name: str,
        scheme_benefits: str,
        scheme_rule_explanation: str,
        profile: Dict[str, Any],
        language: LanguageCode,
    ) -> str:
        raise NotImplementedError


class NoopAIClient(BaseAIClient):
    async def extract_profile(self, *, text: str, language: LanguageCode) -> ExtractedProfile:
        return simple_extract_profile(text)

    async def explain_scheme(
        self,
        *,
        scheme_name: str,
        scheme_benefits: str,
        scheme_rule_explanation: str,
        profile: Dict[str, Any],
        language: LanguageCode,
    ) -> str:
        return simple_explain_eligibility(
            scheme_name=scheme_name,
            scheme_benefits=scheme_benefits,
            scheme_rule_explanation=scheme_rule_explanation,
            profile=profile,
            language=language,
        )


class OpenAIClient(BaseAIClient):
    def __init__(self, *, api_key: str, model: str) -> None:
        from openai import OpenAI  # type: ignore

        self._client = OpenAI(api_key=api_key)
        self._model = model

    async def extract_profile(self, *, text: str, language: LanguageCode) -> ExtractedProfile:
        prompt = (
            "Extract a user profile from the text. "
            "Return ONLY valid JSON with keys: age (number|null), gender (male|female|other|\"\"), "
            "occupation (string), income (number|null, annual rupees), state (string). "
            "Do not include any extra keys.\n\n"
            f"Text: {text}"
        )

        def _call() -> str:
            resp = self._client.chat.completions.create(
                model=self._model,
                messages=[
                    {"role": "system", "content": "You output strict JSON only."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0,
            )
            return resp.choices[0].message.content or "{}"

        raw = await run_in_threadpool(_call)
        try:
            data = json.loads(raw)
        except Exception:
            return simple_extract_profile(text)

        return ExtractedProfile(
            age=int(data["age"]) if data.get("age") not in (None, "") else None,
            gender=str(data.get("gender") or "").strip(),
            occupation=str(data.get("occupation") or "").strip(),
            income=float(data["income"]) if data.get("income") not in (None, "") else None,
            state=str(data.get("state") or "").strip(),
        )

    async def explain_scheme(
        self,
        *,
        scheme_name: str,
        scheme_benefits: str,
        scheme_rule_explanation: str,
        profile: Dict[str, Any],
        language: LanguageCode,
    ) -> str:
        lang_name = "Hindi" if language == "hi" else "English"
        prompt = (
            f"Explain eligibility in simple {lang_name}. "
            "Output 1-2 short sentences ONLY (no bullets). "
            "Must start with the scheme name. "
            "Do NOT repeat the benefit text (benefits are shown elsewhere in the UI).\n\n"
            f"Scheme name: {scheme_name}\n"
            f"Benefits: {scheme_benefits}\n"
            f"Eligibility note: {scheme_rule_explanation}\n"
            f"User profile: {json.dumps(profile, ensure_ascii=False)}\n"
        )

        def _call() -> str:
            resp = self._client.chat.completions.create(
                model=self._model,
                messages=[
                    {"role": "system", "content": "You write concise, user-friendly explanations."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
            )
            return resp.choices[0].message.content or ""

        text = (await run_in_threadpool(_call)).strip()
        if not text:
            return simple_explain_eligibility(
                scheme_name=scheme_name,
                scheme_benefits=scheme_benefits,
                scheme_rule_explanation=scheme_rule_explanation,
                profile=profile,
                language=language,
            )
        return text


class GeminiClient(BaseAIClient):
    def __init__(self, *, api_key: str, model: str) -> None:
        import google.generativeai as genai  # type: ignore

        genai.configure(api_key=api_key)
        self._genai = genai
        self._model_name = model

    async def _generate(self, prompt: str) -> str:
        def _call() -> str:
            model = self._genai.GenerativeModel(self._model_name)
            resp = model.generate_content(prompt)
            return getattr(resp, "text", "") or ""

        return (await run_in_threadpool(_call)).strip()

    async def extract_profile(self, *, text: str, language: LanguageCode) -> ExtractedProfile:
        prompt = (
            "Extract a user profile from the text. "
            "Return ONLY valid JSON with keys: age (number|null), gender (male|female|other|\"\"), "
            "occupation (string), income (number|null, annual rupees), state (string). "
            "Do not include any extra keys.\n\n"
            f"Text: {text}"
        )
        raw = await self._generate(prompt)
        try:
            data = json.loads(raw)
        except Exception:
            return simple_extract_profile(text)

        return ExtractedProfile(
            age=int(data["age"]) if data.get("age") not in (None, "") else None,
            gender=str(data.get("gender") or "").strip(),
            occupation=str(data.get("occupation") or "").strip(),
            income=float(data["income"]) if data.get("income") not in (None, "") else None,
            state=str(data.get("state") or "").strip(),
        )

    async def explain_scheme(
        self,
        *,
        scheme_name: str,
        scheme_benefits: str,
        scheme_rule_explanation: str,
        profile: Dict[str, Any],
        language: LanguageCode,
    ) -> str:
        lang_name = "Hindi" if language == "hi" else "English"
        prompt = (
            f"Explain eligibility in simple {lang_name}. "
            "Output 1-2 short sentences ONLY (no bullets). "
            "Must start with the scheme name. "
            "Do NOT repeat the benefit text (benefits are shown elsewhere in the UI).\n\n"
            f"Scheme name: {scheme_name}\n"
            f"Benefits: {scheme_benefits}\n"
            f"Eligibility note: {scheme_rule_explanation}\n"
            f"User profile: {json.dumps(profile, ensure_ascii=False)}\n"
        )
        text = await self._generate(prompt)
        if not text:
            return simple_explain_eligibility(
                scheme_name=scheme_name,
                scheme_benefits=scheme_benefits,
                scheme_rule_explanation=scheme_rule_explanation,
                profile=profile,
                language=language,
            )
        return text


def get_ai_client() -> BaseAIClient:
    provider: AIProvider = os.getenv("SAHAJSEVA_AI_PROVIDER", "none").strip().lower()  # type: ignore
    if provider == "openai":
        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip()
        if not api_key:
            return NoopAIClient()
        try:
            return OpenAIClient(api_key=api_key, model=model)
        except Exception:
            return NoopAIClient()

    if provider == "gemini":
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash").strip()
        if not api_key:
            return NoopAIClient()
        try:
            return GeminiClient(api_key=api_key, model=model)
        except Exception:
            return NoopAIClient()

    return NoopAIClient()
