from __future__ import annotations

from typing import Any, Dict, Literal, Optional

from pydantic import BaseModel, Field

LanguageCode = Literal["en", "hi"]


class SchemeFinderRequest(BaseModel):
    age: Optional[int] = Field(default=None, ge=0, le=130)
    gender: Optional[str] = ""
    occupation: Optional[str] = ""
    income: Optional[float] = Field(default=None, ge=0)
    state: Optional[str] = ""
    language: LanguageCode = "en"


class ExtractProfileRequest(BaseModel):
    text: str
    language: LanguageCode = "en"


class ExtractProfileResponse(BaseModel):
    age: Optional[int] = None
    gender: str = ""
    occupation: str = ""
    income: Optional[float] = None
    state: str = ""


class SchemeResult(BaseModel):
    name: str
    benefits: str
    why: str
    portal_url: str = ""


class SchemeFinderResponse(BaseModel):
    schemes: list[SchemeResult]
